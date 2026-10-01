'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Destination } from '@/lib/types';

/**
 * Map surface.
 *
 * Leaflet is loaded with `next/dynamic` and `ssr: false`. It cannot render on the
 * server, and the CSS it needs must travel with the same chunk, so the split is
 * done here rather than inside the component that uses Leaflet.
 *
 * Tiles come from OpenStreetMap, which needs no API key, no billing account and
 * no domain registration. Google Maps handles the *actions* — directions and
 * turn-by-turn navigation — because that is what a traveller needs from it; see
 * `lib/maps/google-maps`.
 */

export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const LeafletMapInner = dynamic(() => import('./leaflet-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-sand-100">
      <Loader2 className="h-6 w-6 animate-spin text-maroon-700" aria-hidden="true" />
      <p className="text-sm text-charcoal-muted">Loading map…</p>
    </div>
  ),
});

export interface MapMarker {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  href: string;
  imageUrl?: string;
  tagline?: string;
}

interface MapViewProps {
  markers: MapMarker[];
  /** Fits the viewport to the markers. Disable when a fixed centre is wanted. */
  fitBounds?: boolean;
  center?: [number, number];
  zoom?: number;
  activeId?: string | null;
  onMarkerClick?: (id: string) => void;
  /** Draws a polyline through the markers, in order, for a trip route. */
  showRoute?: boolean;
  routeColor?: string;
  className?: string;
  height?: string;
  scrollWheelZoom?: boolean;
  ariaLabel?: string;
}

export function MapView({
  markers,
  fitBounds = true,
  center = [22.5, 79],
  zoom = 5,
  activeId = null,
  onMarkerClick,
  showRoute = false,
  routeColor = '#7a2d18',
  className,
  height = '100%',
  scrollWheelZoom = false,
  ariaLabel = 'Map of heritage destinations in India',
}: MapViewProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const onReady = useCallback(() => setStatus('ready'), []);
  const onError = useCallback((message: string) => {
    setErrorMessage(message);
    setStatus('error');
  }, []);

  return (
    <div className={cn('relative isolate', className)} style={{ height }}>
      {status !== 'error' ? (
        <div
          className="h-full w-full"
          role="application"
          aria-label={ariaLabel}
          aria-busy={status === 'loading'}
        >
          <LeafletMapInner
            markers={markers}
            fitBounds={fitBounds}
            center={center}
            zoom={zoom}
            activeId={activeId}
            onMarkerClick={onMarkerClick}
            showRoute={showRoute}
            routeColor={routeColor}
            scrollWheelZoom={scrollWheelZoom}
            onReady={onReady}
            onError={onError}
          />
        </div>
      ) : null}

      {status === 'loading' ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-sand-100">
          <Loader2 className="h-6 w-6 animate-spin text-maroon-700" aria-hidden="true" />
          <p className="text-sm text-charcoal-muted">Loading map…</p>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-sand-100 p-6 text-center">
          <MapPin className="h-6 w-6 text-charcoal-muted" aria-hidden="true" />
          <p className="text-sm font-semibold text-charcoal">The map could not be loaded</p>
          <p className="max-w-xs text-xs text-charcoal-muted">
            {errorMessage ||
              'Map tiles are served from OpenStreetMap, so this usually means the connection dropped. Reload to try again.'}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/** Converts destinations into map markers. */
export function toMarkers(destinations: Destination[]): MapMarker[] {
  return destinations.map((destination) => ({
    id: destination.id,
    name: destination.name,
    city: destination.city,
    state: destination.state,
    latitude: destination.latitude,
    longitude: destination.longitude,
    href: `/destinations/${destination.slug}`,
    imageUrl: destination.imageUrl,
    tagline: destination.tagline,
  }));
}

/** Single-destination map used on the detail page. */
export function DestinationMiniMap({ destination }: { destination: Destination }) {
  const markers = useMemo(() => toMarkers([destination]), [destination]);

  return (
    <MapView
      markers={markers}
      fitBounds={false}
      center={[destination.latitude, destination.longitude]}
      zoom={13}
      showRoute={false}
      height="18rem"
      ariaLabel={`Map showing ${destination.name} near ${destination.city}, ${destination.state}`}
    />
  );
}
