'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  GripVertical,
  Info,
  MapPin,
  Navigation,
  Plus,
  Route as RouteIcon,
  Trash2,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import {
  getTripWithStops,
  removeStop,
  reorderStops,
  updateStop,
  recordActivity,
} from '@/lib/store/user-data';
import { redirectToLogin } from '@/lib/auth/redirect';
import { MapView, toMarkers } from '@/components/map/map-view';
import { routeOnGoogleMaps, directionsToGoogleMaps } from '@/lib/maps/google-maps';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { Field } from '@/components/trip/trip-planner';
import { AddDestinationDialog } from '@/components/trip/add-destination-dialog';
import {
  addDays,
  cn,
  daysBetween,
  estimateRouteLegs,
  formatDate,
  formatDistance,
  formatDuration,
  parseHHMM,
  sumRoute,
} from '@/lib/utils';
import type { TripWithStops } from '@/lib/types';

/**
 * Itinerary builder.
 *
 * Reordering is drag-and-drop with keyboard equivalents, because drag-and-drop
 * on its own is unusable without a pointer. Each stop also exposes "move up" and
 * "move down", which are focusable, labelled, and announced.
 */
export function ItineraryBuilder({ tripId }: { tripId: string }) {
  const { profile, loading } = useAuth();
  const { toast } = useToast();

  const [trip, setTrip] = useState<TripWithStops | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'missing'>('loading');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const load = useCallback(async () => {
    if (!profile) return;
    setState('loading');
    const result = await getTripWithStops(profile.id, tripId);
    if (!result) {
      setState('missing');
      return;
    }
    setTrip(result);
    setState('ready');
  }, [profile, tripId]);

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      setState('ready');
      return;
    }
    void load();
  }, [load, loading, profile]);

  const persistOrder = useCallback(
    async (orderedIds: string[]) => {
      if (!profile) return;
      const result = await reorderStops(profile.id, tripId, orderedIds);
      if (!result.ok) {
        toast({ variant: 'error', title: result.error ?? 'Could not save the new order.' });
        // Reload so the UI shows the order that was actually persisted.
        void load();
      }
    },
    [load, profile, toast, tripId],
  );

  const move = useCallback(
    (from: number, to: number) => {
      if (!trip) return;
      if (to < 0 || to >= trip.stops.length) return;
      const next = [...trip.stops];
      const [moved] = next.splice(from, 1);
      if (!moved) return;
      next.splice(to, 0, moved);

      // Optimistic: the list reorders immediately and reverts on failure.
      setTrip({ ...trip, stops: next.map((s, i) => ({ ...s, orderIndex: i })) });
      void persistOrder(next.map((s) => s.id));
    },
    [persistOrder, trip],
  );

  if (loading) {
    return (
      <div className="container-page py-14" role="status" aria-label="Loading itinerary">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton mt-4 h-40 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Sign in to see this itinerary"
          description="Itineraries are tied to your account."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => redirectToLogin(`/trip-planner/trips/${tripId}`)}
            >
              Sign in
            </button>
          }
        />
      </div>
    );
  }

  if (state === 'missing') {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Trip not found"
          description="This trip does not exist, or it belongs to a different account."
          action={
            <Link href="/trip-planner" className="btn-primary">
              Back to your trips
            </Link>
          }
        />
      </div>
    );
  }

  if (state === 'error' || !trip) {
    return (
      <div className="container-page py-14">
        <ErrorState onRetry={() => void load()} />
      </div>
    );
  }

  const days = daysBetween(trip.startDate, trip.endDate);
  const markers = toMarkers(trip.stops.map((s) => s.destination));
  // The start location has no coordinates, so the route estimate covers the
  // stops only. Google Maps is the authority for the full door-to-door route.
  const legs = estimateRouteLegs(
    trip.stops.map((s) => ({
      name: s.destination.name,
      latitude: s.destination.latitude,
      longitude: s.destination.longitude,
    })),
  );
  const totals = sumRoute(legs);

  const googleRouteUrl = routeOnGoogleMaps(
    {
      label: trip.stops[trip.stops.length - 1]?.destination.name ?? trip.startLocation,
      lat: trip.stops[trip.stops.length - 1]?.destination.latitude,
      lng: trip.stops[trip.stops.length - 1]?.destination.longitude,
    },
    trip.stops.slice(0, -1).map((s) => ({
      label: s.destination.name,
      lat: s.destination.latitude,
      lng: s.destination.longitude,
    })),
    { label: trip.startLocation },
  );

  return (
    <div className="container-page py-8 lg:py-12">
      <Link href="/trip-planner" className="inline-flex items-center gap-1.5 text-sm font-medium text-maroon-700 hover:text-maroon-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All trips
      </Link>

      <header className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">Itinerary</p>
          <h1 className="mt-2 text-display-sm font-semibold text-charcoal">{trip.name}</h1>
          <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-charcoal-soft">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-charcoal-muted" aria-hidden="true" />
              <dd>
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}{' '}
                <span className="text-xs text-charcoal-muted">
                  ({days} {days === 1 ? 'day' : 'days'})
                </span>
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-charcoal-muted" aria-hidden="true" />
              <dd>From {trip.startLocation}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-charcoal-muted" aria-hidden="true" />
              <dd>{trip.travelers} travelling</dd>
            </div>
          </dl>
          {trip.notes ? (
            <p className="mt-3 max-w-2xl rounded-xl border border-sand-200 bg-white p-3.5 text-sm leading-relaxed text-charcoal-soft">
              {trip.notes}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add destination
          </button>
          {trip.stops.length > 0 ? (
            <a
              href={googleRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <RouteIcon className="h-4 w-4" aria-hidden="true" />
              Open route in Google Maps
            </a>
          ) : null}
        </div>
      </header>

      {trip.stops.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No destinations yet"
            description="Add the places you want to visit, then drag them into the order you plan to walk them."
            action={
              <button type="button" className="btn-primary" onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add your first destination
              </button>
            }
            secondaryAction={
              <Link href="/destinations" className="btn-secondary">
                Browse destinations
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* ------------------------------------------------------- */}
          {/* Itinerary list                                          */}
          {/* ------------------------------------------------------- */}
          <div>
            <ItineraryDays trip={trip} />

            <ul
              ref={listRef}
              className="mt-4 space-y-3"
              aria-label="Trip destinations, in visiting order"
            >
              {trip.stops.map((stop, index) => (
                <li
                  key={stop.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragEnter={() => setOverIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (dragIndex !== null && dragIndex !== index) move(dragIndex, index);
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={cn(
                    'card relative p-4 transition-all duration-200',
                    dragIndex === index && 'opacity-40',
                    overIndex === index && dragIndex !== index && 'ring-2 ring-saffron-500',
                  )}
                >
                  <div className="flex gap-3">
                    {/* Drag handle plus keyboard-accessible move controls. */}
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <span
                        aria-hidden="true"
                        className="mt-1 cursor-grab text-charcoal-muted active:cursor-grabbing"
                      >
                        <GripVertical className="h-5 w-5" />
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon-700 text-xs font-semibold text-sand-50">
                        {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-base font-semibold text-charcoal">
                            <Link
                              href={`/destinations/${stop.destination.slug}`}
                              className="hover:text-maroon-800"
                            >
                              {stop.destination.name}
                            </Link>
                          </h2>
                          <p className="mt-0.5 text-xs text-charcoal-muted">
                            {stop.destination.city}, {stop.destination.state} ·{' '}
                            {stop.destination.historicalPeriod}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => move(index, index - 1)}
                            disabled={index === 0}
                            aria-label={`Move ${stop.destination.name} earlier`}
                            className="rounded-lg p-1.5 text-charcoal-muted transition-colors hover:bg-sand-100 hover:text-charcoal disabled:opacity-30"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4" aria-hidden="true">
                              <path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => move(index, index + 1)}
                            disabled={index === trip.stops.length - 1}
                            aria-label={`Move ${stop.destination.name} later`}
                            className="rounded-lg p-1.5 text-charcoal-muted transition-colors hover:bg-sand-100 hover:text-charcoal disabled:opacity-30"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4" aria-hidden="true">
                              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <RemoveStopButton
                            stop={stop}
                            tripId={tripId}
                            onChanged={load}
                          />
                        </div>
                      </div>

                      <StopEditor stop={stop} tripId={tripId} onChanged={load} />
                    </div>
                  </div>

                  {index < trip.stops.length - 1 && legs[index] ? (
                    <p className="mt-3 flex items-center gap-2 border-t border-dashed border-sand-200 pt-3 text-xs text-charcoal-muted">
                      <RouteIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      About {formatDistance(legs[index].distanceKm)} and{' '}
                      {formatDuration(legs[index].durationMinutes)} to{' '}
                      {legs[index].toName}
                      <span className="text-charcoal-muted/70">(estimate)</span>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-charcoal-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                Distances and times above are straight-line estimates with a fixed road
                factor — useful for comparing options, not for planning departure times.{' '}
                <a
                  href={googleRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-maroon-700 underline underline-offset-2"
                >
                  Google Maps
                </a>{' '}
                has the real routed distance and live traffic.
              </span>
            </p>
          </div>

          {/* ------------------------------------------------------- */}
          {/* Sidebar: map and route summary                          */}
          {/* ------------------------------------------------------- */}
          <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start" aria-label="Trip route">
            <div className="card overflow-hidden">
              <MapView
                markers={markers}
                showRoute
                routeColor="#963a1e"
                height="18rem"
                ariaLabel={`Map showing the route through ${trip.stops.length} destinations in ${trip.name}`}
              />
            </div>

            <div className="card p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                <RouteIcon className="h-4 w-4 text-maroon-700" aria-hidden="true" />
                Route summary
              </h2>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-charcoal-muted">Starting point</dt>
                  <dd className="text-right font-medium text-charcoal-soft">{trip.startLocation}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-charcoal-muted">Stops</dt>
                  <dd className="font-medium text-charcoal-soft">{trip.stops.length}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-charcoal-muted">Days</dt>
                  <dd className="font-medium text-charcoal-soft">{days}</dd>
                </div>
                {trip.stops.length > 1 ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-charcoal-muted">Approx. distance</dt>
                      <dd className="font-medium text-charcoal-soft">
                        {formatDistance(totals.distanceKm)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-charcoal-muted">Approx. travel time</dt>
                      <dd className="font-medium text-charcoal-soft">
                        {formatDuration(totals.durationMinutes)}
                      </dd>
                    </div>
                  </>
                ) : null}
              </dl>

              {trip.stops.length > 0 ? (
                <a
                  href={googleRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-4 w-full"
                >
                  <RouteIcon className="h-4 w-4" aria-hidden="true" />
                  Open full route
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>

            {trip.stops.length > 0 ? (
              <div className="card p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                  <Navigation className="h-4 w-4 text-maroon-700" aria-hidden="true" />
                  Navigate to a stop
                </h2>
                <p className="mt-1 text-xs text-charcoal-muted">
                  Open turn-by-turn directions to any stop, from the trip&rsquo;s starting
                  point or your current location.
                </p>
                <ul className="mt-3 space-y-1.5">
                  {trip.stops.map((stop, index) => (
                    <li key={stop.id}>
                      <a
                        href={directionsToGoogleMaps(
                          {
                            label: stop.destination.name,
                            lat: stop.destination.latitude,
                            lng: stop.destination.longitude,
                          },
                          { label: trip.startLocation },
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm text-charcoal-soft transition-colors hover:bg-sand-100 hover:text-charcoal"
                      >
                        <span className="min-w-0 truncate">
                          <span className="mr-1.5 text-xs text-charcoal-muted">
                            {index + 1}.
                          </span>
                          {stop.destination.name}
                        </span>
                        <Navigation className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      )}

      <AddDestinationDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        tripId={tripId}
        existingIds={trip.stops.map((s) => s.destinationId)}
        onAdded={() => {
          setAddDialogOpen(false);
          void load();
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Day-by-day view                                                     */
/* ------------------------------------------------------------------ */

/** Groups stops by visit date, falling back to a single unscheduled day. */
function ItineraryDays({ trip }: { trip: TripWithStops }) {
  const days = useMemo(() => {
    const total = daysBetween(trip.startDate, trip.endDate);
    const list = Array.from({ length: total }, (_, i) => ({
      index: i,
      date: addDays(trip.startDate, i),
      stops: [] as HydratedStop[],
    }));

    for (const stop of trip.stops) {
      if (!stop.visitDate) continue;
      const match = list.find((day) => day.date === stop.visitDate);
      if (match) match.stops.push(stop);
    }
    return list;
  }, [trip]);

  const unscheduled = trip.stops.filter((s) => !s.visitDate);

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
      <h2 className="text-sm font-semibold text-charcoal">Daily itinerary</h2>
      <ul className="mt-3 space-y-2">
        {days.map((day) => (
          <li key={day.date} className="flex items-start gap-3 text-sm">
            <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide text-saffron-700">
              Day {day.index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-charcoal-muted">{formatDate(day.date)}</span>
              {day.stops.length > 0 ? (
                <span className="mt-0.5 block text-charcoal-soft">
                  {day.stops
                    .map((s) => `${s.startTime ? `${s.startTime} ` : ''}${s.destination.name}`)
                    .join(' → ')}
                </span>
              ) : (
                <span className="mt-0.5 block text-xs italic text-charcoal-muted">
                  Nothing scheduled
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {unscheduled.length > 0 ? (
        <p className="mt-3 flex items-start gap-2 border-t border-sand-200 pt-3 text-xs text-charcoal-muted">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-saffron-600" aria-hidden="true" />
          <span>
            {unscheduled.length} {unscheduled.length === 1 ? 'place has' : 'places have'} no day
            assigned yet. Set a visit date on the stop below to slot them in.
          </span>
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stop editor                                                         */
/* ------------------------------------------------------------------ */

/** A stop with its destination record resolved, as stored on `TripWithStops`. */
type HydratedStop = TripWithStops['stops'][number];

function StopEditor({
  stop,
  tripId,
  onChanged,
}: {
  stop: HydratedStop;
  tripId: string;
  onChanged(): void;
}) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [busyField, setBusyField] = useState<string | null>(null);

  const save = async (patch: Parameters<typeof updateStop>[3], field: string) => {
    if (!profile) return;
    setBusyField(field);
    const result = await updateStop(profile.id, tripId, stop.id, patch);
    setBusyField(null);
    if (!result.ok) {
      toast({ variant: 'error', title: result.error ?? 'Could not save that change.' });
    }
    onChanged();
  };

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-3">
      <Field label="Visit date">
        <input
          type="date"
          value={stop.visitDate ?? ''}
          onChange={(event) => save({ visitDate: event.target.value || null }, 'date')}
          className="input !py-1.5 !text-xs"
          aria-label={`Visit date for ${stop.destination.name}`}
        />
      </Field>

      <Field label="Start time">
        <input
          type="time"
          value={stop.startTime ?? ''}
          onChange={(event) => save({ startTime: parseHHMM(event.target.value) || null }, 'start')}
          className="input !py-1.5 !text-xs"
          aria-label={`Start time for ${stop.destination.name}`}
        />
      </Field>

      <Field label="End time">
        <input
          type="time"
          value={stop.endTime ?? ''}
          onChange={(event) => save({ endTime: parseHHMM(event.target.value) || null }, 'end')}
          className="input !py-1.5 !text-xs"
          aria-label={`End time for ${stop.destination.name}`}
        />
      </Field>

      <div className="sm:col-span-3">
        <Field label="Note or activity">
          <input
            type="text"
            value={stop.activity ?? ''}
            placeholder="e.g. Western Group temples, then the archaeological museum"
            onChange={(event) => save({ activity: event.target.value || null }, 'activity')}
            className="input !py-1.5 !text-xs"
            aria-label={`Note for ${stop.destination.name}`}
          />
        </Field>
      </div>

      {busyField ? (
        <p className="sr-only" role="status">
          Saving
        </p>
      ) : null}
    </div>
  );
}

function RemoveStopButton({
  stop,
  tripId,
  onChanged,
}: {
  stop: HydratedStop;
  tripId: string;
  onChanged(): void;
}) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!profile) return;
    setBusy(true);
    const result = await removeStop(profile.id, tripId, stop.id);
    setBusy(false);
    if (!result.ok) {
      toast({ variant: 'error', title: result.error ?? 'Could not remove that stop.' });
      return;
    }
    void recordActivity(profile.id, stop.destinationId, 'trip_remove');
    toast({ variant: 'success', title: 'Removed from the trip' });
    onChanged();
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      aria-label={`Remove ${stop.destination.name} from the trip`}
      className="rounded-lg p-1.5 text-charcoal-muted transition-colors hover:bg-danger-50 hover:text-danger-700 disabled:opacity-40"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
