import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DestinationBrowser } from '@/components/discovery/destination-browser';
import { DestinationGridSkeleton } from '@/components/ui/states';
import { DESTINATIONS, HISTORICAL_PERIOD_META_LOCAL } from './content';
import Link from 'next/link';
import { appConfig } from '@/lib/config';

/**
 * Prerendered to a shell, filtered in the browser.
 *
 * The destination browser reads its filters from the query string, which a
 * static build never sees — the site is exported with `output: 'export'` and
 * served as files by GitHub Pages, so there is no per-request rendering. The
 * `Suspense` boundary below means the prerendered HTML carries the hero and the
 * grid skeleton, and the real filtered cards replace it on hydration. A shared
 * filtered link still lands on the right content, one hydration step later.
 */

export const metadata: Metadata = {
  title: 'Explore India’s heritage',
  description:
    'Browse by theme — ancient India, forts and palaces, temples, UNESCO properties, Buddhist sites, archaeological sites, museums, wildlife and hidden gems across the subcontinent.',
  alternates: { canonical: `${appConfig.url}/explore` },
};

export default function ExplorePage() {
  const byState = new Map<string, number>();
  for (const destination of DESTINATIONS) {
    byState.set(destination.state, (byState.get(destination.state) ?? 0) + 1);
  }

  return (
    <>
      <section className="border-b border-sand-200 bg-sand-gradient py-14">
        <div className="container-page">
          <p className="eyebrow">Explore India</p>
          <h1 className="mt-2 text-display-sm font-semibold text-charcoal">
            Browse by theme, state or period
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
            The same {DESTINATIONS.length} destinations across{' '}
            {byState.size} states and union territories, organised by what you want to see
            rather than by where it happens to be. Jump into a period to read what is
            established about it, then open the places themselves.
          </p>

          <nav aria-label="Browse by state" className="mt-7">
            <ul className="flex flex-wrap gap-2">
              {[...byState.entries()]
                .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                .map(([state, count]) => (
                  <li key={state}>
                    <Link
                      href={`/destinations?state=${encodeURIComponent(state)}`}
                      className="chip"
                    >
                      {state}
                      <span className="text-charcoal-muted">{count}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-charcoal">Or start with a period</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {HISTORICAL_PERIOD_META_LOCAL.map((period) => (
                <li key={period.id}>
                  <Link
                    href={`/timeline/${period.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="chip"
                  >
                    {period.id}
                    <span className="text-charcoal-muted">{period.range}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Suspense fallback={<DestinationGridSkeleton count={9} />}>
        <DestinationBrowser showFilters showSavedFilter />
      </Suspense>
    </>
  );
}
