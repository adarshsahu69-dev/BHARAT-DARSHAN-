import type { Metadata } from 'next';
import { TripPlanner } from '@/components/trip/trip-planner';
import { appConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Trip planner',
  description:
    'Build an itinerary from India’s heritage destinations, arrange the order, set the day and time for each stop, and open the whole route in Google Maps.',
  alternates: { canonical: `${appConfig.url}/trip-planner` },
  robots: { index: false, follow: true },
};

export default function TripPlannerPage() {
  return <TripPlanner />;
}
