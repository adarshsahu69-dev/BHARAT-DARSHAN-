'use client';

import { useEffect, useState } from 'react';
import { Compass, LocateFixed, Navigation, Route as RouteIcon } from 'lucide-react';
import {
  directionsToGoogleMaps,
  startNavigation,
  viewOnGoogleMaps,
  type PlaceRef,
  type TravelMode,
} from '@/lib/maps/google-maps';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const MODES: { value: TravelMode; label: string }[] = [
  { value: 'driving', label: 'Drive' },
  { value: 'transit', label: 'Transit' },
  { value: 'walking', label: 'Walk' },
  { value: 'bicycling', label: 'Cycle' },
];

/**
 * Directions panel.
 *
 * "Use my location" hands the browser's geolocation to Google Maps as a plain
 * coordinate, so the coordinates never have to be resolved to an address first —
 * and nothing is sent anywhere except to the user clicking through to Maps.
 */
export function DirectionsPanel({
  destination,
  className,
  defaultOrigin,
  compact = false,
}: {
  destination: PlaceRef;
  className?: string;
  defaultOrigin?: PlaceRef;
  compact?: boolean;
}) {
  const { toast } = useToast();
  const [origin, setOrigin] = useState(defaultOrigin?.label ?? '');
  const [mode, setMode] = useState<TravelMode>('driving');
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Reset when the destination changes, so a stale origin is never applied.
  useEffect(() => {
    setCoords(null);
    setOrigin(defaultOrigin?.label ?? '');
  }, [defaultOrigin, destination.label]);

  const originRef: PlaceRef | null = coords
    ? { label: 'Current location', lat: coords.lat, lng: coords.lng }
    : origin.trim()
      ? { label: origin.trim() }
      : null;

  const useMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      toast({
        variant: 'error',
        title: 'Location is not available in this browser',
        description: 'Type a starting point instead.',
      });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setOrigin('Current location');
        setLocating(false);
        toast({ variant: 'success', title: 'Using your current location' });
      },
      (error) => {
        setLocating(false);
        toast({
          variant: 'error',
          title: 'Could not read your location',
          description:
            error.code === error.PERMISSION_DENIED
              ? 'Location permission was declined. Type a starting point instead.'
              : 'Your position is unavailable right now. Type a starting point instead.',
        });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  };

  const directionsUrl = directionsToGoogleMaps(destination, originRef, mode);

  const onNavigate = () => {
    const url = startNavigation(destination);
    if (!url) {
      toast({
        variant: 'info',
        title: 'Turn-by-turn navigation needs coordinates',
        description: 'Opening the route in Google Maps instead.',
      });
      window.open(directionsToGoogleMaps(destination, originRef, 'driving'), '_blank', 'noopener');
      return;
    }
    // Android resolves this intent to the navigation app. Elsewhere the browser
    // may ignore the scheme, so the directions URL is the fallback.
    const opened = window.open(url, '_self');
    if (!opened) {
      window.open(directionsToGoogleMaps(destination, originRef, 'driving'), '_blank', 'noopener');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {!compact ? (
        <fieldset>
          <legend className="label">Starting point</legend>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={origin}
              onChange={(event) => {
                setOrigin(event.target.value);
                setCoords(null);
              }}
              placeholder="City, station or address"
              aria-label="Starting point"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="btn-secondary shrink-0"
            >
              <LocateFixed
                className={cn('h-4 w-4', locating && 'animate-pulse')}
                aria-hidden="true"
              />
              {locating ? 'Locating…' : 'Use my location'}
            </button>
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="label">Travel mode</legend>
        <div className="flex flex-wrap gap-2">
          {MODES.map((option) => (
            <label
              key={option.value}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                mode === option.value
                  ? 'border-maroon-700 bg-maroon-700 text-sand-50'
                  : 'border-sand-300 bg-white text-charcoal-soft hover:border-sand-400',
              )}
            >
              <input
                type="radio"
                name="travel-mode"
                value={option.value}
                checked={mode === option.value}
                onChange={() => setMode(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1"
        >
          <RouteIcon className="h-4 w-4" aria-hidden="true" />
          Get directions
          <span className="sr-only"> in Google Maps (opens in a new tab)</span>
        </a>
        <button type="button" onClick={onNavigate} className="btn-secondary flex-1">
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Start navigation
        </button>
      </div>

      <a
        href={viewOnGoogleMaps(destination, 15)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-700 underline underline-offset-2 hover:text-maroon-800"
      >
        <Compass className="h-3.5 w-3.5" aria-hidden="true" />
        View on Google Maps
      </a>
    </div>
  );
}

/** Compact directions block for a destination page sidebar. */
export function DirectionsCard({ destination }: { destination: PlaceRef }) {
  return (
    <div className="card p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
        <Navigation className="h-4 w-4 text-maroon-700" aria-hidden="true" />
        Getting there
      </h2>
      <p className="mt-1 text-xs text-charcoal-muted">
        Directions and navigation open in Google Maps, which is where the live traffic and
        turn-by-turn directions actually live.
      </p>
      <DirectionsPanel destination={destination} className="mt-4" />
    </div>
  );
}
