import type { Metadata } from 'next';
import { ItineraryFromQuery } from '@/components/trip/itinerary-from-query';

export const metadata: Metadata = {
  title: 'Itinerary',
  description: 'Your day-by-day itinerary, with the route on the map.',
  // Per-user and private: never indexed, never cached across requests.
  robots: { index: false, follow: false },
};

/**
 * The itinerary for one trip, identified by `?trip=<id>`.
 *
 * A static export cannot prerender `/trip-planner/trips/[tripId]`: trip ids are
 * created in the visitor's browser, so no build knows them. One prerendered page
 * plus a query parameter gives the same deep link. See `itineraryHref` in
 * `@/lib/routes` for the other half of this contract.
 */
export default function TripItineraryPage() {
  return <ItineraryFromQuery />;
}