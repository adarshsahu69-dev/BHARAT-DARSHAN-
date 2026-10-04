import type { Metadata } from 'next';
import { SavedPlaces } from '@/components/dashboard/saved-places';
import { privateMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = privateMetadata(
  'Saved places',
  'The heritage destinations you have bookmarked.',
);

export default function SavedPlacesPage() {
  return <SavedPlaces />;
}
