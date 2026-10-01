'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DESTINATIONS } from '@/data/destinations';
import { searchDestinations } from '@/lib/search/search-engine';
import { DestinationCard } from '@/components/destination/destination-card';
import { NoResultsState } from '@/components/ui/states';
import { kindLabel, suggest } from '@/lib/search/search-engine';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Full search results.
 *
 * Above a few characters the page shows ranked destination results; below that it
 * prompts, because a list of everything is not a useful answer to an empty query.
 * Non-destination entities surface as a secondary row, since a search for
 * "Mughal" should still show the places before it shows the dynasty.
 */
export function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const trimmed = query.trim();

  const results = useMemo(
    () => (trimmed ? searchDestinations(DESTINATIONS, trimmed, 60) : []),
    [trimmed],
  );

  const entities = useMemo(() => {
    if (trimmed.length < 2) return [];
    // The suggestion list mixes destinations in; keep only the non-destination
    // kinds for the secondary row.
    return suggest(DESTINATIONS, trimmed, 20).filter((s) => s.kind !== 'destination').slice(0, 8);
  }, [trimmed]);

  return (
    <div className="container-page py-10 lg:py-14">
      <header>
        <h1 className="text-display-sm font-semibold text-charcoal">Search</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
          Search across monument names, cities, states, dynasties, rulers and periods. Typing
          a dynasty or a ruler returns the places associated with them.
        </p>
      </header>

      {trimmed.length < 2 ? (
        <div className="mt-10">
          <NoResultsState
            query=""
            onClear={undefined}
            onReset={undefined}
          />
          <div className="mt-8 rounded-2xl border border-sand-200 bg-sand-50 p-5">
            <h2 className="text-sm font-semibold text-charcoal">Try searching for</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {['Mughal', 'Chalukya', 'Pallava', 'Xuanzang', 'stepwell', 'UNESCO World Heritage', 'Khajuraho'].map(
                (term) => (
                  <li key={term}>
                    <Link href={`/destinations?q=${encodeURIComponent(term)}`} className="chip">
                      {term}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-charcoal-muted" role="status" aria-live="polite">
            <span className="font-semibold text-charcoal">{results.length}</span>{' '}
            {results.length === 1 ? 'result' : 'results'} for{' '}
            <span className="font-medium text-charcoal">“{trimmed}”</span>
          </p>

          {entities.length > 0 ? (
            <section aria-labelledby="entities" className="mt-6">
              <h2 id="entities" className="text-sm font-semibold text-charcoal">
                Also matching
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {entities.map((entity) => (
                  <li key={entity.id}>
                    <Link href={entity.href} className="chip">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-muted">
                        {kindLabel(entity.kind)}
                      </span>
                      {entity.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results.length === 0 ? (
            <div className="mt-8">
              <NoResultsState query={trimmed} onClear={() => setQuery('')} />
            </div>
          ) : (
            <>
              <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.map(({ destination }, index) => (
                  <li key={destination.id}>
                    <DestinationCard destination={destination} priority={index < 3} />
                  </li>
                ))}
              </ul>

              <div className="mt-10 text-center">
                <Link
                  href={`/destinations?q=${encodeURIComponent(trimmed)}`}
                  className="btn-secondary group"
                >
                  Filter these results by state, category or period
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
