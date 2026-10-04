import type { Metadata } from 'next';
import { MyTrips } from '@/components/dashboard/my-trips';
import { privateMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = privateMetadata(
  'My trips',
  'Every trip you have planned, with scheduling progress for each.',
);

export default function MyTripsPage() {
  return <MyTrips />;
}
