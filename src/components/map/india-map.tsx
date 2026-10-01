'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crosshair, List, Map as MapIcon, Route as RouteIcon, X } from 'lucide-react';
import { ALL_STATES, DESTINATIONS, categoriesOf } from '@/data/destinations';
import { MapView, toMarkers, type MapMarker } from '@/components/map/map-view';
import { EmptyState } from '@/components/ui/states';
import { SearchBar } from '@/components/search/search-bar';
import { AddToTripButton } from '@/components/trip/add-to-trip-button';
import { directionsToGoogleMaps, viewOnGoogleMaps } from '@/lib/maps/google-maps';
import { cn } from '@/lib/utils';
import type { Category, Destination } from '@/lib/types';

type MobileTab = 'list' | 'map';

/**
 * Explore India map.
 *
 * The list and the map are the same data, so the mobile tab switch is a
 * reordering of the layout rather than a different view — selecting a destination
 * on either surface focuses the same marker on the other.
 */
export function IndiaMap() {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('list');

  // Deep-link support: /map?q=… pre-filters, and selecting from search deep-links back.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');
    if (state && ALL_STATES.includes(state)) setActiveState(state);
  }, []);

  const filtered = useMemo(
    () =>
      DESTINATIONS.filter((destination) => {
        if (activeState && destination.state !== activeState) return false;
        if (activeCategory && !categoriesOf(destination).includes(activeCategory)) return false;
        return true;
      }),
    [activeCategory, activeState],
  );

  const markers = useMemo<MapMarker[]>(() => toMarkers(filtered), [filtered]);
  const active = useMemo(
    () => filtered.find((d) => d.id === activeId) ?? null,
    [activeId, filtered],
  );

  const categories = useMemo(() => {
    const set = new Set<Category>();
    for (const destination of DESTINATIONS) {
      for (const category of categoriesOf(destination)) set.add(category);
    }
    return [...set].sort();
  }, []);

  const reset = () => {
    setActiveState(null);
    setActiveCategory(null);
    setActiveId(null);
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col lg:h-[calc(100dvh-4.5rem)]">
      {/* Controls */}
      <div className="shrink-0 border-b border-sand-200 bg-white">
        <div className="container-page py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="lg:w-80">
              <SearchBar
                variant="page"
                placeholder="Search the map for a place…"
                onNavigate={() => setMobileTab('list')}
              />
            </div>

            <div className="flex flex-1 flex-wrap items-center gap-2">
              <label htmlFor="map-state" className="sr-only">
                Filter by state
              </label>
              <select
                id="map-state"
                value={activeState ?? ''}
                onChange={(event) => setActiveState(event.target.value || null)}
                className="input !w-auto !py-1.5 !text-sm"
              >
                <option value="">All states and regions</option>
                {ALL_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <label htmlFor="map-category" className="sr-only">
                Filter by category
              </label>
              <select
                id="map-category"
                value={activeCategory ?? ''}
                onChange={(event) =>
                  setActiveCategory((event.target.value || null) as Category | null)
                }
                className="input !w-auto !py-1.5 !text-sm"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <p className="text-sm text-charcoal-muted" role="status" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? 'place' : 'places'} on the map
              </p>

              {(activeState || activeCategory) && (
                <button type="button" onClick={reset} className="btn-ghost btn-sm">
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear
                </button>
              )}

              <div className="ml-auto lg:hidden">
                {/* Tab switch: one surface or the other, never a squashed pair. */}
                <div
                  role="tablist"
                  aria-label="Map or list"
                  className="flex rounded-full border border-sand-300 bg-white p-0.5"
                >
                  {(['list', 'map'] as MobileTab[]).map((tab) => (
                    <button
                      key={tab}
                      role="tab"
                      type="button"
                      aria-selected={mobileTab === tab}
                      onClick={() => setMobileTab(tab)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                        mobileTab === tab
                          ? 'bg-maroon-700 text-sand-50'
                          : 'text-charcoal-soft hover:bg-sand-100',
                      )}
                    >
                      {tab === 'list' ? (
                        <List className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <MapIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {tab === 'list' ? 'List' : 'Map'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex min-h-0 flex-1">
        {/* List / detail panel */}
        <div
          className={cn(
            'w-full shrink-0 overflow-y-auto border-r border-sand-200 bg-ivory lg:w-[26rem]',
            mobileTab === 'map' ? 'hidden lg:block' : 'block',
          )}
        >
          {active ? (
            <DestinationPanel destination={active} onClose={() => setActiveId(null)} />
          ) : filtered.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Nothing on the map here"
                description="No records match this combination of state and category. Try clearing a filter."
                action={
                  <button type="button" className="btn-primary" onClick={reset}>
                    Clear filters
                  </button>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-sand-200">
              {filtered.map((destination) => (
                <li key={destination.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(destination.id)}
                    className={cn(
                      'flex w-full items-start gap-3 p-3.5 text-left transition-colors',
                      activeId === destination.id ? 'bg-maroon-50' : 'hover:bg-sand-50',
                    )}
                  >
                    <span className="relative h-14 w-18 shrink-0 overflow-hidden rounded-lg bg-sand-200">
                      {destination.imageUrl ? (
                        <Image
                          src={destination.imageUrl}
                          alt=""
                          fill
                          sizes="72px"
                          loading="lazy"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-charcoal">
                        {destination.name}
                      </span>
                      <span className="block truncate text-xs text-charcoal-muted">
                        {destination.city}, {destination.state}
                      </span>
                      <span className="mt-1 block text-[11px] text-saffron-700">
                        {destination.category} · {destination.historicalPeriod}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map */}
        <div className={cn('relative min-w-0 flex-1', mobileTab === 'list' ? 'hidden lg:block' : 'block')}>
          <MapView
            markers={markers}
            activeId={activeId}
            onMarkerClick={setActiveId}
            fitBounds
            height="100%"
            className="h-full"
            ariaLabel={`Map of ${filtered.length} heritage destinations across India`}
          />

          {/* Re-centre button, shown when a filter has narrowed the view. */}
          {(activeState || activeCategory) && (
            <button
              type="button"
              onClick={reset}
              className="absolute right-4 top-4 z-[500] flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3.5 py-2 text-xs font-semibold text-charcoal shadow-card"
            >
              <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
              Show all of India
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail panel                                                        */
/* ------------------------------------------------------------------ */

function DestinationPanel({
  destination,
  onClose,
}: {
  destination: Destination;
  onClose(): void;
}) {
  return (
    <div className="p-4">
      <div className="relative">
        {destination.imageUrl ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-sand-200">
            <Image
              src={destination.imageUrl}
              alt={destination.name}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close destination panel"
          className="absolute right-2 top-2 rounded-full bg-charcoal/70 p-1.5 text-sand-50 backdrop-blur-sm hover:bg-charcoal/90"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
        {destination.category}
      </p>
      <h2 className="mt-1 text-lg font-semibold leading-snug text-charcoal">
        {destination.name}
      </h2>
      <p className="mt-0.5 text-xs text-charcoal-muted">
        {destination.city}, {destination.state} · {destination.historicalPeriod}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
        {destination.tagline}. {destination.description}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <Link href={`/destinations/${destination.slug}`} className="btn-primary w-full">
          View details
        </Link>
        <div className="flex gap-2">
          <a
            href={directionsToGoogleMaps({
              label: destination.name,
              lat: destination.latitude,
              lng: destination.longitude,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1"
          >
            <RouteIcon className="h-4 w-4" aria-hidden="true" />
            Directions
          </a>
          <a
            href={viewOnGoogleMaps({
              label: destination.name,
              lat: destination.latitude,
              lng: destination.longitude,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            aria-label={`View ${destination.name} on Google Maps`}
          >
            <MapIcon className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <AddToTripButton destination={destination} className="w-full" />
      </div>
    </div>
  );
}
