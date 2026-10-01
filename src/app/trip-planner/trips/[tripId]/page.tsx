import type { Metadata } from 'next';
import { ItineraryBuilder } from '@/components/trip/itinerary-builder';

export const metadata: Metadata = {
  title: 'Itinerary',
  description: 'Your day-by-day itinerary, with the route on the map.',
  // Per-user and private: never indexed, never cached across requests.
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  return <ItineraryBuilder tripId={tripId} />;
}
