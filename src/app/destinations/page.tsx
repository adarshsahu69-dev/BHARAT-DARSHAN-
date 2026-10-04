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
 * Prerendered to a shell, filtered in the browser.
 *
 * The browser reads its filters from the query string, which a static build
 * never sees — the site is exported with `output: 'export'` and served as files
 * by GitHub Pages, so there is no per-request rendering. The `Suspense`
 * boundary below puts the grid skeleton in the prerendered HTML; the real
 * filtered cards replace it on hydration, so a shared filtered link still lands
 * on the right content one step later.
 */

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
