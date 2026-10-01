import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '@/components/search/search-results';
import { appConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search monuments, forts, temples, cities, states, dynasties, rulers and historical periods across the Bharat Darshan collection.',
  alternates: { canonical: `${appConfig.url}/search` },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
