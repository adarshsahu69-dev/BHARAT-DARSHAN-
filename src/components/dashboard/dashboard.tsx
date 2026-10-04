'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Eye,
  History,
  Luggage,
  MapPin,
  Settings,
  Shield,
} from 'lucide-react';
import { DESTINATIONS, getDestinationById } from '@/data/destinations';
import { useAuth } from '@/lib/auth/session-provider';
import { redirectToLogin } from '@/lib/auth/redirect';
import {
  getRecentActivity,
  getSavedIds,
  getTripWithStops,
  getTrips,
  summariseTrips,
} from '@/lib/store/user-data';
import { EmptyState } from '@/components/ui/states';
import { ConfirmDialog, useDisclosure } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { cn, daysBetween, formatDateRange, relativeTime } from '@/lib/utils';
import type { Destination, Trip, TripWithStops, UserActivity } from '@/lib/types';
import { itineraryHref } from '@/lib/routes';

interface DashboardData {
  saved: Destination[];
  trips: TripWithStops[];
  activity: UserActivity[];
}

export function Dashboard() {
  const { profile, loading, mode } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [state, setState] = useState<'loading' | 'ready'>('loading');
  const deleteDialog = useDisclosure();
  const [pendingDelete, setPendingDelete] = useState<Trip | null>(null);

  const load = useCallback(async () => {
    if (!profile) return;
    const [savedIds, trips, activity] = await Promise.all([
      getSavedIds(profile.id),
      getTrips(profile.id),
      getRecentActivity(profile.id, 12),
    ]);

    const hydrated = await Promise.all(
      trips.map(async (trip) => (await getTripWithStops(profile.id, trip.id)) ?? { ...trip, stops: [] }),
    );

    setData({
      saved: savedIds.map(getDestinationById).filter((d): d is Destination => Boolean(d)),
      trips: hydrated,
      activity,
    });
    setState('ready');
  }, [profile]);

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      setState('ready');
      return;
    }
    void load();
  }, [load, loading, profile]);

  const summaries = useMemo(() => (data ? summariseTrips(data.trips) : []), [data]);

  const stats = useMemo(() => {
    const completed = summaries.filter((s) => s.completed).length;
    return {
      saved: data?.saved.length ?? 0,
      planned: summaries.filter((s) => !s.completed).length,
      completed,
      recent: data?.activity.filter((a) => a.activityType === 'view').length ?? 0,
    };
  }, [data, summaries]);

  if (!loading && !profile) {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Sign in to your dashboard"
          description="Your saved places, trips and recently viewed destinations live here."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => redirectToLogin('/dashboard')}
            >
              Sign in
            </button>
          }
          secondaryAction={
            <Link href="/signup" className="btn-secondary">
              Create an account
            </Link>
          }
        />
      </div>
    );
  }

  const onDelete = async () => {
    if (!profile || !pendingDelete) return;
    const { deleteTrip } = await import('@/lib/store/user-data');
    const result = await deleteTrip(profile.id, pendingDelete.id);
    deleteDialog.close();
    if (!result.ok) {
      toast({ variant: 'error', title: result.error ?? 'Could not delete the trip.' });
      return;
    }
    toast({ variant: 'success', title: `Deleted “${pendingDelete.name}”` });
    setPendingDelete(null);
    void load();
  };

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-2 text-display-sm font-semibold text-charcoal">
            Welcome back, {profile?.name.split(' ')[0] ?? 'traveller'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
            Your saved places, planned trips and recent reading, in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/saved" className="btn-secondary btn-sm">
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            Saved places
          </Link>
          <Link href="/dashboard/trips" className="btn-secondary btn-sm">
            <Luggage className="h-4 w-4" aria-hidden="true" />
            My trips
          </Link>
          <Link href="/dashboard/profile" className="btn-secondary btn-sm">
            <Settings className="h-4 w-4" aria-hidden="true" />
            Profile
          </Link>
          {profile?.role === 'admin' ? (
            <Link href="/admin" className="btn-secondary btn-sm">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Admin
            </Link>
          ) : null}
        </div>
      </header>

      {mode === 'demo' ? (
        <p className="mt-5 rounded-xl border border-saffron-300/60 bg-saffron-50 p-3.5 text-sm text-saffron-900">
          Demo mode: this dashboard reads from your browser&rsquo;s storage. Nothing is sent to a
          server.
        </p>
      ) : null}

      {/* Counters */}
      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Bookmark} label="Saved places" value={stats.saved} href="/dashboard/saved" />
        <StatCard icon={CalendarDays} label="Planned trips" value={stats.planned} href="/dashboard/trips" />
        <StatCard icon={CheckCircle2} label="Completed trips" value={stats.completed} href="/dashboard/trips" />
        <StatCard icon={Eye} label="Recently viewed" value={stats.recent} />
      </dl>

      {state === 'loading' ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading your dashboard">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-44 rounded-2xl" />
          ))}
        </div>
      ) : data ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Saved and trips */}
          <div className="space-y-8">
            <section aria-labelledby="dash-saved">
              <div className="flex items-center justify-between gap-3">
                <h2 id="dash-saved" className="text-display-sm font-semibold text-charcoal">
                  Saved places
                </h2>
                {data.saved.length > 0 ? (
                  <Link
                    href="/dashboard/saved"
                    className="group inline-flex items-center gap-1 text-sm font-semibold text-maroon-700 hover:text-maroon-800"
                  >
                    See all
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>

              {data.saved.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No saved places yet"
                    description="Tap the bookmark on any destination to keep it here for later."
                    action={
                      <Link href="/destinations" className="btn-primary">
                        Browse destinations
                      </Link>
                    }
                  />
                </div>
              ) : (
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {data.saved.slice(0, 6).map((destination) => (
                    <li key={destination.id}>
                      <Link
                        href={`/destinations/${destination.slug}`}
                        className="group block overflow-hidden rounded-xl border border-sand-200 bg-white shadow-card transition-all duration-200 hover:border-sand-300 hover:shadow-card-hover"
                      >
                        <span className="relative block aspect-[4/3] overflow-hidden bg-sand-200">
                          {destination.imageUrl ? (
                            <Image
                              src={destination.imageUrl}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 50vw, 200px"
                              loading="lazy"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : null}
                        </span>
                        <span className="block p-2.5">
                          <span className="block truncate text-sm font-semibold text-charcoal">
                            {destination.name}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-charcoal-muted">
                            {destination.city}, {destination.state}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="dash-trips">
              <div className="flex items-center justify-between gap-3">
                <h2 id="dash-trips" className="text-display-sm font-semibold text-charcoal">
                  My trips
                </h2>
                {data.trips.length > 0 ? (
                  <Link
                    href="/dashboard/trips"
                    className="group inline-flex items-center gap-1 text-sm font-semibold text-maroon-700 hover:text-maroon-800"
                  >
                    See all
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>

              {data.trips.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No trips planned"
                    description="Create a trip, add the places you want to see, and arrange them into a route."
                    action={
                      <Link href="/trip-planner" className="btn-primary">
                        Plan a trip
                      </Link>
                    }
                  />
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.trips.slice(0, 4).map((trip) => {
                    const summary = summaries.find((s) => s.tripId === trip.id);
                    return (
                      <li key={trip.id} className="card p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-charcoal">
                              <Link href={itineraryHref(trip.id)} className="hover:text-maroon-800">
                                {trip.name}
                              </Link>
                            </h3>
                            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal-muted">
                              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                              <span>·</span>
                              <span>
                                {summary?.stops ?? 0} {summary?.stops === 1 ? 'stop' : 'stops'}
                              </span>
                              <span>·</span>
                              <span>
                                {daysBetween(trip.startDate, trip.endDate)}{' '}
                                {daysBetween(trip.startDate, trip.endDate) === 1 ? 'day' : 'days'}
                              </span>
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-muted">
                              <MapPin className="h-3 w-3" aria-hidden="true" />
                              From {trip.startLocation}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {summary?.completed ? (
                              <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-[11px] font-semibold text-success-700">
                                Completed
                              </span>
                            ) : summary?.fullyScheduled ? (
                              <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-[11px] font-semibold text-success-700">
                                Fully scheduled
                              </span>
                            ) : (
                              <span className="rounded-full bg-saffron-50 px-2.5 py-0.5 text-[11px] font-semibold text-saffron-800">
                                In progress
                              </span>
                            )}
                            <Link href={itineraryHref(trip.id)} className="btn-secondary btn-sm">
                              Open
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setPendingDelete(trip);
                                deleteDialog.open();
                              }}
                              aria-label={`Delete ${trip.name}`}
                              className="rounded-lg p-1.5 text-charcoal-muted transition-colors hover:bg-danger-50 hover:text-danger-700"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>

          {/* Recent activity */}
          <aside aria-labelledby="dash-activity">
            <h2 id="dash-activity" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
              <History className="h-5 w-5 text-saffron-600" aria-hidden="true" />
              Recent activity
            </h2>

            {data.activity.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="Nothing yet"
                  description="Destinations you open will show up here, so you can pick up where you left off."
                />
              </div>
            ) : (
              <ol className="mt-4 space-y-2">
                {data.activity.map((entry) => {
                  const destination = entry.destinationId ? getDestinationById(entry.destinationId) : null;
                  const label = activityLabel(entry.activityType);

                  return (
                    <li
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white p-2.5"
                    >
                      <span className="relative h-10 w-12 shrink-0 overflow-hidden rounded-md bg-sand-200">
                        {destination?.imageUrl ? (
                          <Image
                            src={destination.imageUrl}
                            alt=""
                            fill
                            sizes="48px"
                            loading="lazy"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        {destination ? (
                          <Link
                            href={`/destinations/${destination.slug}`}
                            className="block truncate text-sm font-medium text-charcoal hover:text-maroon-800"
                          >
                            {destination.name}
                          </Link>
                        ) : (
                          <span className="block truncate text-sm font-medium text-charcoal">
                            {label}
                          </span>
                        )}
                        <span className="block truncate text-[11px] text-charcoal-muted">
                          {label} · {relativeTime(entry.createdAt)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* Recommendations, drawn from the collection rather than user data. */}
            <section className="mt-8" aria-labelledby="dash-recommended">
              <h2 id="dash-recommended" className="text-base font-semibold text-charcoal">
                You might like
              </h2>
              <p className="mt-1 text-xs text-charcoal-muted">
                Places from the collection, unrelated to what you have saved.
              </p>
              <ul className="mt-3 space-y-2">
                {DESTINATIONS.slice(0, 4).map((destination) => (
                  <li key={destination.id}>
                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sand-50"
                    >
                      <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md bg-sand-200">
                        {destination.imageUrl ? (
                          <Image
                            src={destination.imageUrl}
                            alt=""
                            fill
                            sizes="56px"
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-charcoal">
                          {destination.name}
                        </span>
                        <span className="block truncate text-[11px] text-charcoal-muted">
                          {destination.state} · {destination.historicalPeriod}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      ) : null}

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onClose={() => {
          deleteDialog.close();
          setPendingDelete(null);
        }}
        onConfirm={onDelete}
        title={`Delete “${pendingDelete?.name ?? ''}”?`}
        message="The trip and its itinerary will be removed. This cannot be undone."
        confirmLabel="Delete trip"
      />
    </div>
  );
}

function activityLabel(type: UserActivity['activityType']): string {
  switch (type) {
    case 'view':
      return 'Viewed';
    case 'save':
      return 'Saved';
    case 'unsave':
      return 'Removed from saved';
    case 'trip_add':
      return 'Added to a trip';
    case 'trip_remove':
      return 'Removed from a trip';
    case 'trip_create':
      return 'Created a trip';
    default:
      return 'Activity';
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Bookmark;
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-maroon-50 text-maroon-700">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="mt-3 block font-display text-3xl font-semibold text-charcoal">{value}</span>
      <span className="mt-0.5 block text-xs text-charcoal-muted">{label}</span>
    </>
  );

  const className = cn(
    'card p-4 text-left',
    href && 'transition-all duration-200 hover:border-sand-300 hover:shadow-card-hover',
  );

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
