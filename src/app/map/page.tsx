import type { Metadata } from 'next';
import Link from 'next/link';
import { IndiaMap } from '@/components/map/india-map';
import { appConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Explore India map',
  description:
    'An interactive map of India’s heritage destinations. Zoom, pan and search, filter by state and category, open a record, get directions or add the place to a trip.',
  alternates: { canonical: `${appConfig.url}/map` },
};

/** Leaflet touches `window`, so the map page is client-rendered only. */

export default function MapPage() {
  return (
    <>
      <IndiaMap />
      <noscript>
        <p className="container-page py-6 text-sm text-charcoal-soft">
          The interactive map needs JavaScript. Every destination is also listed on the{' '}
          <Link href="/destinations" className="underline">
            destinations page
          </Link>
          .
        </p>
      </noscript>
    </>
  );
}
