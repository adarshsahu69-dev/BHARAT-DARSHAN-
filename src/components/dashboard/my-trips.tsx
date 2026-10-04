'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, MapPin, Plus, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { redirectToLogin } from '@/lib/auth/redirect';
import { getTripWithStops, getTrips, summariseTrips } from '@/lib/store/user-data';
import { EmptyState, TripCardSkeleton } from '@/components/ui/states';
import { daysBetween, formatDate, formatDateRange } from '@/lib/utils';
import type { TripWithStops } from '@/lib/types';
import { itineraryHref } from '@/lib/routes';

/** The dashboard's trip list, with fuller detail than the compact panel. */
export function MyTrips() {
  const { profile, loading } = useAuth();
  const [trips, setTrips] = useState<TripWithStops[] | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      setTrips([]);
      return;
    }
    void (async () => {
      const list = await getTrips(profile.id);
      const hydrated = await Promise.all(
        list.map(async (trip) => (await getTripWithStops(profile.id, trip.id)) ?? { ...trip, stops: [] }),
      );
      setTrips(hydrated);
    })();
  }, [loading, profile]);

  const summaries = useMemo(() => (trips ? summariseTrips(trips) : []), [trips]);

  if (!loading && !profile) {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Sign in to see your trips"
          description="Your itineraries are tied to your account."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => redirectToLogin('/dashboard/trips')}
            >
              Sign in
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-2 text-display-sm font-semibold text-charcoal">My trips</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
            Every trip you have planned, with how far through the itinerary each one is.
          </p>
        </div>
        <Link href="/trip-planner" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New trip
        </Link>
      </header>

      {trips === null ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No trips yet"
            description="Create a trip in the planner, then add destinations and arrange them into a route."
            action={
              <Link href="/trip-planner" className="btn-primary">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Plan your first trip
              </Link>
            }
            secondaryAction={
              <Link href="/destinations" className="btn-secondary">
                Browse destinations
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => {
            const summary = summaries.find((s) => s.tripId === trip.id);
            const days = daysBetween(trip.startDate, trip.endDate);
            const scheduled = trip.stops.filter((s) => s.visitDate).length;
            const ratio = trip.stops.length > 0 ? (scheduled / trip.stops.length) * 100 : 0;

            return (
              <li key={trip.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-snug text-charcoal">
                    <Link href={itineraryHref(trip.id)} className="hover:text-maroon-800">
                      {trip.name}
                    </Link>
                  </h2>
                  {summary?.completed ? (
                    <span className="shrink-0 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700">
                      Completed
                    </span>
                  ) : null}
                </div>

                <dl className="mt-3 space-y-1.5 text-sm text-charcoal-soft">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
                    <dd>{formatDateRange(trip.startDate, trip.endDate)}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
                    <dd className="truncate">From {trip.startLocation}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
                    <dd>
                      {trip.travelers} · {days} {days === 1 ? 'day' : 'days'}
                    </dd>
                  </div>
                </dl>

                {trip.stops.length > 0 ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-charcoal-muted">
                      <span>
                        {scheduled} of {trip.stops.length} stops scheduled
                      </span>
                      <span>{Math.round(ratio)}%</span>
                    </div>
                    <div
                      className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand-200"
                      role="progressbar"
                      aria-valuenow={Math.round(ratio)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${trip.name} scheduling progress`}
                    >
                      <div
                        className="h-full rounded-full bg-saffron-500 transition-all duration-500"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <p className="mt-3 text-xs text-charcoal-muted">
                  Created {formatDate(trip.createdAt)}
                </p>

                <div className="mt-4 flex gap-2 border-t border-sand-200 pt-4">
                  <Link href={itineraryHref(trip.id)} className="btn-primary btn-sm flex-1">
                    View itinerary
                  </Link>
                  <Link href="/trip-planner" className="btn-secondary btn-sm">
                    Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
