import { appConfig } from '@/lib/config';
import type { LatLng } from '@/lib/utils';

/**
 * Google Maps integration.
 *
 * Everything the app needs from Google Maps is reachable through the documented
 * URL schemes below, which take no API key at all. That is deliberate: the
 * navigation, directions and "open in Maps" actions are the parts a traveller
 * actually needs, and they work with zero configuration and zero cost.
 *
 * A `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is supported for the richer embeds
 * (static maps, place autocomplete) and is referenced only through
 * `mapsEmbedUrl`. Note the naming: `NEXT_PUBLIC_*` is by definition shipped to
 * the browser. A Google Maps browser key must be restricted by HTTP referrer, and
 * the Maps JavaScript API restricts it further. The service key — the only one
 * that should ever be trusted with server-side calls — is read from
 * `GOOGLE_MAPS_SERVER_KEY` and is never referenced from any client module.
 */

const hasServerKey = Boolean(process.env.GOOGLE_MAPS_SERVER_KEY?.trim());

export const mapsCapabilities = {
  /** URL-scheme actions: always available, no key required. */
  urlActions: true,
  /** Keyed embeds (interactive embed, static map images). */
  embeds: true,
  /** `maps.googleapis.com` Places/Geocoding calls from the server. */
  serverApi: hasServerKey,
} as const;

export type TravelMode = 'driving' | 'transit' | 'walking' | 'bicycling';

export interface PlaceRef {
  label: string;
  lat?: number;
  lng?: number;
}

/* ------------------------------------------------------------------ */
/* URL builders                                                        */
/* ------------------------------------------------------------------ */

function encodePlace(place: PlaceRef): string {
  if (place.lat !== undefined && place.lng !== undefined) {
    // The "api=1" universal navigation link accepts coordinates, and the app
    // shows lat/lng on every record, so a pin is more reliable than an address.
    return `${place.lat},${place.lng}`;
  }
  return place.label;
}

/** Opens a place in Google Maps, centred and zoomed on it. */
export function viewOnGoogleMaps(place: PlaceRef, zoom = 15): string {
  const params = new URLSearchParams({ api: '1', query: encodePlace(place), zoom: String(zoom) });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

/** Opens turn-by-turn directions to a single destination. */
export function directionsToGoogleMaps(
  destination: PlaceRef,
  origin?: PlaceRef | null,
  mode: TravelMode = 'driving',
): string {
  const params = new URLSearchParams({
    api: '1',
    destination: encodePlace(destination),
    travelmode: mode,
  });

  if (origin) params.set('origin', encodePlace(origin));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Opens a multi-stop route in Google Maps, in the order given.
 * `waypoints` are the intermediate stops; the last point is the destination.
 */
export function routeOnGoogleMaps(
  destination: PlaceRef,
  waypoints: PlaceRef[],
  origin?: PlaceRef | null,
  mode: TravelMode = 'driving',
): string {
  const params = new URLSearchParams({
    api: '1',
    destination: encodePlace(destination),
    travelmode: mode,
  });

  if (origin) params.set('origin', encodePlace(origin));

  if (waypoints.length > 0) {
    // Google accepts at most 9 waypoints via the URL scheme; beyond that the
    // caller must open the trip planner in Google Maps directly.
    const capped = waypoints.slice(0, 9);
    params.set('waypoints', capped.map(encodePlace).join('|'));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Hands off to the native navigation app on the device.
 * On Android this resolves to the `google.navigation:` intent; on other
 * platforms the link is not understood, so callers should treat it as a
 * progressive enhancement alongside `directionsToGoogleMaps`.
 */
export function startNavigation(place: PlaceRef): string | null {
  if (place.lat === undefined || place.lng === undefined) return null;
  return `google.navigation:q=${place.lat},${place.lng}&mode=d`;
}

/**
 * Interactive embed URL. The `output=embed` form needs no API key, so this works
 * out of the box; when a key is present the same URL serves a fully interactive
 * map, so the markup does not have to change.
 */
export function mapsEmbedUrl(place: PlaceRef & Partial<LatLng>, zoom = 14): string {
  const params = new URLSearchParams({
    q: encodePlace(place),
    z: String(zoom),
    output: 'embed',
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}

/** Static Maps image URL, used for Open Graph and previews. */
export function staticMapUrl(
  place: LatLng,
  width = 1200,
  height = 630,
  zoom = 12,
): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key) return null;
  const params = new URLSearchParams({
    center: `${place.latitude},${place.longitude}`,
    zoom: String(zoom),
    size: `${width}x${height}`,
    scale: '2',
    maptype: 'roadmap',
    key,
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

/* ------------------------------------------------------------------ */
/* Geohoding helpers                                                   */
/* ------------------------------------------------------------------ */

/** Approximate bounding box, used to derive a `bbox` parameter. */
export function bboxAround(place: LatLng, zoom: number) {
  // Rough degrees-per-pixel relationship at the equator; adequate for framing.
  const span = 360 / 2 ** zoom;
  return {
    south: place.latitude - span / 2,
    west: place.longitude - span / 2,
    north: place.latitude + span / 2,
    east: place.longitude + span / 2,
  };
}

/**
 * Server-side reverse geocode, used to turn a dropped pin into a place label.
 * Returns null when no server key is configured or the call fails — callers must
 * handle that rather than assuming a result.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<PlaceRef | null> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY?.trim();
  if (!key) return null;

  const params = new URLSearchParams({ latlng: `${lat},${lng}`, key });

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`,
      { next: { revalidate: 86_400 } },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      status: string;
      results?: { formatted_address: string }[];
    };
    if (data.status !== 'OK' || !data.results?.[0]) return null;

    return { label: data.results[0].formatted_address, lat, lng };
  } catch {
    return null;
  }
}

/** Canonical share URL for a destination record. */
export function shareUrlFor(slug: string): string {
  return `${appConfig.url}/destinations/${slug}`;
}
