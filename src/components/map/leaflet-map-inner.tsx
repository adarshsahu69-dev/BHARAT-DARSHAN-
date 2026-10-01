'use client';

import { useEffect, useRef } from 'react';
import L, { type Map as LeafletMap, type Marker } from 'leaflet';
// Leaflet's stylesheet must be a static import; Next bundles it with this chunk,
// which is itself loaded lazily, so it only ships on pages that show a map.
import 'leaflet/dist/leaflet.css';
import { TILE_ATTRIBUTION, TILE_URL, type MapMarker } from './map-view';

interface InnerProps {
  markers: MapMarker[];
  fitBounds: boolean;
  center: [number, number];
  zoom: number;
  activeId: string | null;
  onMarkerClick?: (id: string) => void;
  showRoute: boolean;
  routeColor: string;
  scrollWheelZoom: boolean;
  onReady(): void;
  onError(message: string): void;
}

/**
 * Leaflet's imperative body, split out so that the module which statically
 * imports `leaflet.css` can be loaded with `next/dynamic` from `map-view.tsx`.
 */
export default function LeafletMapInner({
  markers,
  fitBounds,
  center,
  zoom,
  activeId,
  onMarkerClick,
  showRoute,
  routeColor,
  scrollWheelZoom,
  onReady,
  onError,
}: InnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  const markerIndex = useRef(new Map<string, Marker>());
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);

  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  // Create the map once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let createdMap: LeafletMap | null = null;

    try {
      const map = L.map(container, {
        center,
        zoom,
        scrollWheelZoom,
        // Touch-first: one finger pans, two fingers zoom.
        dragging: true,
        zoomControl: true,
        attributionControl: true,
      });
      createdMap = map;
      mapRef.current = map;

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 18,
        // Keeps the view from straying far from India without hard-locking it.
        minZoom: 4,
      }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      onReadyRef.current();
    } catch (error) {
      onErrorRef.current(
        error instanceof Error ? error.message : 'The map could not be loaded.',
      );
    }

    // Capture the marker index now: by cleanup time the ref may already have
    // been reassigned, and this must tear down *this* map instance.
    const createdIndex = markerIndex.current;

    return () => {
      createdIndex.clear();
      layerRef.current = null;
      routeRef.current = null;
      createdMap?.remove();
      if (mapRef.current === createdMap) mapRef.current = null;
    };
    // Constructed once; all subsequent updates flow through the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollWheelZoom]);

  // Redraw markers whenever the set, order or active selection changes.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markerIndex.current.clear();
    routeRef.current = null;

    for (const marker of markers) {
      const isActive = marker.id === activeId;
      const icon = L.divIcon({
        className: '',
        html: `<span class="bd-marker${isActive ? ' bd-marker--active' : ''}"><span class="bd-marker__pin"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span></span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const instance = L.marker([marker.latitude, marker.longitude], {
        icon,
        title: marker.name,
        alt: `${marker.name}, ${marker.city}, ${marker.state}`,
        keyboard: true,
      });

      instance.bindPopup(
        `<div style="display:flex;gap:0.75rem;padding:0.75rem;">
          ${
            marker.imageUrl
              ? `<img src="${escapeAttribute(marker.imageUrl)}" alt="" width="72" height="72" loading="lazy" style="width:72px;height:72px;object-fit:cover;border-radius:0.5rem;flex-shrink:0;" />`
              : ''
          }
          <div style="min-width:0;">
            <p style="margin:0;font-size:0.875rem;font-weight:600;line-height:1.25;">${escapeHtml(marker.name)}</p>
            <p style="margin:0.125rem 0 0;font-size:0.6875rem;color:#6b5d52;">${escapeHtml(marker.city)}, ${escapeHtml(marker.state)}</p>
            ${marker.tagline ? `<p style="margin:0.375rem 0 0;font-size:0.6875rem;color:#4a3f37;line-height:1.4;">${escapeHtml(marker.tagline)}</p>` : ''}
            <a href="${escapeAttribute(marker.href)}" style="display:inline-block;margin-top:0.5rem;font-size:0.75rem;font-weight:600;color:#7a2d18;text-decoration:underline;">View details</a>
          </div>
        </div>`,
        { maxWidth: 280 },
      );

      instance.on('click', () => onMarkerClick?.(marker.id));
      instance.addTo(layer);
      markerIndex.current.set(marker.id, instance);
    }

    if (showRoute && markers.length > 1) {
      routeRef.current = L.polyline(
        markers.map((m) => [m.latitude, m.longitude] as [number, number]),
        { color: routeColor, weight: 3, opacity: 0.75, dashArray: '8 6' },
      ).addTo(map);
    }

    if (fitBounds && markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map((m) => [m.latitude, m.longitude] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 13 });
    } else {
      map.setView(center, zoom);
    }
  }, [
    activeId,
    center,
    fitBounds,
    markers,
    onMarkerClick,
    routeColor,
    showRoute,
    zoom,
  ]);

  // Centre on the active marker when the selection changes elsewhere.
  useEffect(() => {
    if (!activeId) return;
    const marker = markerIndex.current.get(activeId);
    const map = mapRef.current;
    if (!marker || !map) return;
    map.panTo(marker.getLatLng(), { animate: true, duration: 0.4 });
  }, [activeId]);

  return <div ref={containerRef} className="h-full w-full" />;
}

/** Escapes text interpolated into popup HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes a value interpolated into a double-quoted HTML attribute. */
function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/javascript:/gi, '');
}
