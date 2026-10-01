import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { DestinationBrowser } from '@/components/discovery/destination-browser';
import { DestinationGridSkeleton } from '@/components/ui/states';
import { appConfig } from '@/lib/config';
import { HISTORICAL_PERIOD_META } from '@/data/timeline';

/**
 * Rendered per request, not prerendered: the destination browser reads its
 * filters from the query string, and a static build has no query string at
 * build time. Per-request rendering lets the server emit the real, filtered
 * cards so a shared link lands on content instead of loading skeletons.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Historical places',
  description:
    'Heritage sites organised by the period they belong to — ancient India, the Mauryas, the Guptas, early medieval India, the Delhi Sultanate, the Mughals, the Marathas, colonial India and modern India.',
  alternates: { canonical: `${appConfig.url}/historical-places` },
};

export default function HistoricalPlacesPage() {
  return (
    <>
      <section className="border-b border-sand-200 bg-sand-gradient py-14">
        <div className="container-page">
          <p className="eyebrow">Historical places</p>
          <h1 className="mt-2 text-display-sm font-semibold text-charcoal">
            Places, ordered by the period that made them
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
            Period boundaries in Indian history are scholarly conventions rather than exact
            dates, and different regions were in different phases at the same time. Each
            record shows which period it is filed under and flags the parts of its dating
            that are still debated.
          </p>

          <nav aria-label="Historical periods" className="mt-7">
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {HISTORICAL_PERIOD_META.map((period) => (
                <li key={period.id}>
                  <Link
                    href={`/destinations?period=${encodeURIComponent(period.id)}`}
                    className="card-interactive flex h-full flex-col p-4"
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-charcoal">{period.id}</span>
                      <span className="shrink-0 text-[11px] text-charcoal-muted">{period.range}</span>
                    </span>
                    <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal-soft">
                      {period.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <Suspense fallback={<DestinationGridSkeleton count={9} />}>
        <DestinationBrowser
          heading="Every historical place"
          description="Filter by period to narrow the collection, or search across dynasties and rulers — try “Mughal”, “Chalukya”, “Pallava” or “Xuanzang”."
        />
      </Suspense>
    </>
  );
}
