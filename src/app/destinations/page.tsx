import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DestinationBrowser } from '@/components/discovery/destination-browser';
import { DestinationGridSkeleton } from '@/components/ui/states';
import { appConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'All destinations',
  description:
    'Browse every monument, fort, temple, cave, museum and landscape in the Bharat Darshan collection, filtered by category, state and historical period.',
  alternates: { canonical: `${appConfig.url}/destinations` },
  openGraph: {
    title: 'All destinations | Bharat Darshan',
    description:
      'Browse every monument, fort, temple, cave, museum and landscape in the collection, filtered by category, state and historical period.',
    url: `${appConfig.url}/destinations`,
  },
};

/**
 * Rendered per request rather than prerendered.
 *
 * The browser reads its filters from the query string, and a statically
 * prerendered page has no query string at build time — which would leave the
 * first paint as nothing but skeletons. Rendering per request means the
 * server already knows the filters and emits the real result cards, so a shared
 * filtered link lands on content rather than a loading state.
 */
export const dynamic = 'force-dynamic';

export default function DestinationsPage() {
  return (
    <Suspense fallback={<DestinationGridSkeleton count={9} />}>
      <DestinationBrowser
        heading="All destinations"
        description="Filter by category, state or historical period, or search across names, cities, dynasties and rulers. Every record links to the sources its history is drawn from."
      />
    </Suspense>
  );
}
