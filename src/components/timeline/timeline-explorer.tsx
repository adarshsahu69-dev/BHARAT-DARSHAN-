'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { HISTORICAL_PERIOD_META } from '@/data/timeline';
import { DESTINATIONS } from '@/data/destinations';
import { VerificationBadge } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { HistoricalPeriod } from '@/lib/types';

/**
 * Interactive historical timeline.
 *
 * Drawn to a linear scale from 600 BCE to the present, so the relative length of
 * each period is honest — the Mauryan empire really is a sliver next to the
 * Sultanate. Ranges are conventional and may overlap; the caveat panel says so.
 */
export function TimelineExplorer({
  initialPeriod,
}: {
  initialPeriod?: HistoricalPeriod;
}) {
  const [active, setActive] = useState<HistoricalPeriod>(
    initialPeriod ?? 'Mughal Period',
  );

  const meta = HISTORICAL_PERIOD_META.find((p) => p.id === active)!;

  // Scale: -700 BCE to 2026 CE.
  const START = -700;
  const END = 2030;
  const span = END - START;
  const left = (year: number) => ((year - START) / span) * 100;

  const related = useMemo(
    () =>
      DESTINATIONS.filter((d) => d.historicalPeriod === active)
        .sort((a, b) => b.significanceScore - a.significanceScore),
    [active],
  );

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="max-w-3xl">
        <p className="eyebrow">Historical timeline</p>
        <h1 className="mt-2 text-display-sm font-semibold text-charcoal">
          Twenty-five centuries, on one axis
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal-soft sm:text-base">
          Periods are shown to scale. These boundaries are scholarly conventions rather than
          exact dates, and different parts of the subcontinent were in different phases at the
          same time — the notes under the axis say what is firm and what is not.
        </p>
      </header>

      {/* The axis */}
      <div className="mt-10 overflow-x-auto pb-2">
        <div className="min-w-[46rem]">
          <div className="relative h-2 rounded-full bg-sand-200">
            {HISTORICAL_PERIOD_META.map((period) => {
              const isActive = period.id === active;
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setActive(period.id)}
                  aria-pressed={isActive}
                  title={`${period.id} — ${period.range}`}
                  className={cn(
                    'absolute top-0 h-2 rounded-full bg-gradient-to-r transition-all duration-200',
                    period.accent,
                    isActive ? 'opacity-100 ring-2 ring-saffron-500 ring-offset-2' : 'opacity-55 hover:opacity-85',
                  )}
                  style={{
                    left: `${left(period.startYear)}%`,
                    width: `${((period.endYear - period.startYear) / span) * 100}%`,
                  }}
                >
                  <span className="sr-only">
                    {period.id}, {period.range}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Century ticks */}
          <div className="relative mt-2 h-4" aria-hidden="true">
            {[-500, 0, 500, 1000, 1500, 2000].map((year) => (
              <span
                key={year}
                className="absolute -translate-x-1/2 text-[10px] tabular-nums text-charcoal-muted"
                style={{ left: `${left(year)}%` }}
              >
                {year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selectors */}
      <ul
        className="mt-6 flex flex-wrap gap-2"
        aria-label="Select a historical period"
      >
        {HISTORICAL_PERIOD_META.map((period) => {
          const isActive = period.id === active;
          const count = DESTINATIONS.filter((d) => d.historicalPeriod === period.id).length;
          return (
            <li key={period.id}>
              <button
                type="button"
                onClick={() => setActive(period.id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'border-maroon-700 bg-maroon-700 text-sand-50 shadow-card'
                    : 'border-sand-300 bg-white text-charcoal-soft hover:border-maroon-300 hover:bg-sand-50',
                )}
              >
                {period.id}
                <span className={cn('ml-1.5 text-[10px]', isActive ? 'text-sand-200' : 'text-charcoal-muted')}>
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Detail */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
          <p className="font-display text-2xl font-semibold text-maroon-800">{meta.range}</p>
          <p className="prose-heritage mt-4">{meta.summary}</p>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              Associated with
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {meta.figures.map((figure) => (
                <li key={figure}>
                  <Link
                    href={`/destinations?q=${encodeURIComponent(figure)}`}
                    className="rounded-full bg-sand-100 px-2.5 py-0.5 text-[11px] font-medium text-charcoal-soft transition-colors hover:bg-sand-200"
                  >
                    {figure}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-xl border-l-4 border-saffron-400 bg-saffron-50/70 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron-800">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              How firm is this?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{meta.caveat}</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-charcoal">
            {related.length > 0
              ? `${related.length} ${related.length === 1 ? 'place' : 'places'} in this collection`
              : 'No records yet'}
          </h2>

          {related.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {related.map((destination) => (
                <li key={destination.id}>
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-sand-200 bg-white p-3 shadow-card transition-all duration-200 hover:border-sand-300 hover:shadow-card-hover"
                  >
                    <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-sand-200">
                      {destination.imageUrl ? (
                        <Image
                          src={destination.imageUrl}
                          alt=""
                          fill
                          sizes="80px"
                          loading="lazy"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-charcoal">
                        {destination.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-charcoal-muted">
                        {destination.city}, {destination.state}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <VerificationBadge verification={destination.verification} />
                        {destination.unescoYear ? (
                          <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-semibold text-charcoal-soft">
                            UNESCO {destination.unescoYear}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-sand-300 bg-white/60 p-5 text-sm leading-relaxed text-charcoal-muted">
              This collection has no records from the {meta.id} yet. The period itself is
              described alongside so you have the context; records are added as they are
              researched and sourced.
            </p>
          )}

          <Link
            href={`/destinations?period=${encodeURIComponent(meta.id)}`}
            className="btn-secondary group mt-4"
          >
            Browse all {meta.id} places
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
