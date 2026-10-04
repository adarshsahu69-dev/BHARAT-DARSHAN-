'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { ItineraryBuilder } from '@/components/trip/itinerary-builder';
import { EmptyState, TripCardSkeleton } from '@/components/ui/states';

/**
 * Resolves the trip id from `?trip=<id>` and hands it to the itinerary builder.
 *
 * The id is read from `window.location` rather than `useSearchParams` because
 * this page is prerendered to a static HTML file: at build time there is no query
 * string, so the value only exists in the browser. Until it is read, the
 * skeleton below is what ships — the same thing a per-request render would have
 * produced before the move to a static export.
 */
export function ItineraryFromQuery() {
  const [tripId, setTripId] = useState<string | null>(null);

  useEffect(() => {
    setTripId(new URLSearchParams(window.location.search).get('trip'));
  }, []);

  if (tripId === null) {
    return (
      <div className="container-page py-10" role="status" aria-label="Loading itinerary">
        <TripCardSkeleton />
      </div>
    );
  }

  if (tripId === '') {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={CalendarDays}
          title="No trip selected"
          description="This link is missing its trip reference. Open one of your trips and choose it from there."
          action={
            <Link href="/trip-planner" className="btn-primary">
              Go to the trip planner
            </Link>
          }
        />
      </div>
    );
  }

  return <ItineraryBuilder tripId={tripId} />;
}