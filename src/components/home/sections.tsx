'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Award, Clock } from 'lucide-react';
import { HISTORICAL_PERIOD_META } from '@/data/timeline';
import { CATEGORY_META, DESTINATIONS, UNESCO_DESTINATIONS } from '@/data/destinations';
import { DestinationCard } from '@/components/destination/destination-card';
import { VerificationBadge } from '@/components/ui/states';
import { cn, seededIndex } from '@/lib/utils';
import type { Category, HistoricalPeriod } from '@/lib/types';

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-2 text-display-sm font-semibold text-charcoal">{title}</h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-charcoal-soft sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Explore India — state grid                                       */
/* ------------------------------------------------------------------ */

const STATE_BLURBS: Record<string, string> = {
  'Madhya Pradesh': 'Bhakti-era temples, Buddhist stupas and hill forts across the Narmada basin.',
  Delhi: 'Five centuries of imperial capital, from the Delhi Sultanate to the Mughal court.',
  'Uttar Pradesh': 'The Mughal heartland, and the Ganga plain it was built across.',
  Rajasthan: 'Rajput hill forts, stepwells and the planned Pink City of Jaipur.',
  Gujarat: 'Harappan cities, Solanki stepwells and a coastline of temple towns.',
  Maharashtra: 'Rock-cut caves at Ajanta and Ellora, and the Deccan Sultanate capitals.',
  Karnataka: 'The Vijayanagara capital at Hampi and the Chalukya temples at Pattadakal.',
  'Tamil Nadu': 'Pallava shore temples and the living temple city of Madurai.',
  Odisha: 'Kalinga temple architecture, from Mukteshwar to the chariot at Konark.',
  Bihar: 'The monastic university at Nalanda and the place of awakening at Bodh Gaya.',
};

export function ExploreIndiaSection() {
  const byState = useMemo(() => {
    const map = new Map<string, { state: string; count: number; lead: (typeof DESTINATIONS)[number] }>();
    for (const destination of DESTINATIONS) {
      const existing = map.get(destination.state);
      if (!existing || destination.significanceScore > existing.lead.significanceScore) {
        map.set(destination.state, {
          state: destination.state,
          count: (existing?.count ?? 0) + (existing ? 0 : 1),
          lead: existing?.lead ?? destination,
        });
      } else {
        existing.count += 1;
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count || a.state.localeCompare(b.state));
  }, []);

  return (
    <section className="container-page py-16 lg:py-24" aria-labelledby="explore-india">
      <SectionHeading
        eyebrow="Explore India"
        title="Every state has a story worth the journey"
        description="Start with a state, or browse everything at once. Each entry links straight to the places, dates and sources behind it."
        action={
          <Link href="/map" className="btn-secondary group shrink-0">
            Open the map
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        }
      />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {byState.map(({ state, count, lead }) => (
          <li key={state}>
            <Link
              href={`/destinations?state=${encodeURIComponent(state)}`}
              title={STATE_BLURBS[state]}
              className="card-interactive group relative flex h-32 flex-col justify-end overflow-hidden p-4"
            >
              {lead.imageUrl ? (
                <Image
                  src={lead.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
                />
              ) : null}
              <div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-charcoal/10"
                aria-hidden="true"
              />
              <div className="relative">
                <p className="text-sm font-semibold text-sand-50">{state}</p>
                <p className="mt-0.5 text-[11px] text-sand-200/80">
                  {count} {count === 1 ? 'place' : 'places'}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="sr-only" id="explore-india">
        {byState.length} Indian states and union territories with heritage records.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Popular destinations                                             */
/* ------------------------------------------------------------------ */

export function PopularDestinationsSection() {
  const popular = useMemo(
    () =>
      [...DESTINATIONS]
        .sort((a, b) => b.significanceScore - a.significanceScore)
        .slice(0, 6),
    [],
  );

  return (
    <section className="paper-texture border-y border-sand-200 py-16 lg:py-24" aria-labelledby="popular">
      <div className="container-page">
        <SectionHeading
          eyebrow="Popular destinations"
          title="Where most journeys begin"
          description="The records with the widest reach: World Heritage properties, sites with several centuries of continuous history, and monuments that reward a whole day."
          action={
            <Link href="/destinations?sort=significance" className="btn-secondary group shrink-0">
              See all destinations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((destination, i) => (
            <DestinationCard key={destination.id} destination={destination} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Categories                                                       */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS: Record<string, string> = {
  Landmark: 'M12 3 4 9v12h16V9z',
  Castle: 'M4 21V9l8-6 8 6v12M9 21v-6h6v6',
  Sparkles: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3',
  Award: 'M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10M8 13l-1 8 5-3 5 3-1-8',
  Building2: 'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h4v12M8 7h4M8 11h4M8 15h4',
  Flower2: 'M12 12c0-3 2-5 5-5s3 4 0 6-5 1-5-1 2-5-1-5-4 3-2 5 1 4-1 4-5-1-5-4 2-3 4 0Z',
  Home: 'M4 11 12 4l8 7v9H4zM10 20v-6h4v6',
  Layers: 'M12 3 3 8l9 5 9-5zM3 13l9 5 9-5',
  Trees: 'M12 3 6 12h3l-4 6h14l-4-6h3z',
  PartyPopper: 'M4 20 16 8M9 15l-3 3M18 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1z',
  Waves: 'M3 8c3 0 3 2 6 2s3-2 6-2 3 2 6 2M3 14c3 0 3 2 6 2s3-2 6-2 3 2 6 2',
  Mountain: 'M3 20 10 6l4 7 2-3 5 10z',
  PawPrint: 'M8 14c-2 0-3 1.5-3 3s1.5 2 3 2 3-.5 3-2-1-3-3-3M6 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M16 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3',
  Compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M15 9l-2 4-4 2 2-4z',
};

export function CategorySection() {
  // Categories with no records yet are shown honestly as "coming soon"
  // rather than being hidden, so the taxonomy is visible and testable.
  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    for (const destination of DESTINATIONS) {
      for (const category of [destination.category, ...destination.alsoCategories]) {
        map.set(category, (map.get(category) ?? 0) + 1);
      }
    }
    return map;
  }, []);

  return (
    <section className="container-page py-16 lg:py-24" aria-labelledby="categories">
      <SectionHeading
        eyebrow="Explore by category"
        title="Fourteen ways into India&rsquo;s heritage"
        description="Browse by what you want to see — monuments, monasteries, UNESCO properties, landscapes — or by the kind of trip you have in mind."
      />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORY_META.map((category) => {
          const count = counts.get(category.name) ?? 0;
          const path = CATEGORY_ICONS[category.icon] ?? CATEGORY_ICONS.Landmark!;
          return (
            <li key={category.name}>
              <Link
                href={
                  count > 0
                    ? `/destinations?category=${encodeURIComponent(category.name)}`
                    : `/explore?category=${encodeURIComponent(category.name)}`
                }
                className="card-interactive group flex h-full flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-sand-gradient">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-charcoal/85 to-charcoal/20"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-sand-50/95 text-maroon-700 shadow-card"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {count > 0 ? (
                    <span className="absolute bottom-2.5 left-3 text-[11px] font-semibold text-sand-100">
                      {count} {count === 1 ? 'place' : 'places'}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-3.5">
                  <h3 className="text-sm font-semibold leading-snug text-charcoal">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-charcoal-muted">
                    {category.description}
                  </p>
                  {count === 0 ? (
                    <span className="mt-2 inline-flex w-fit rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal-muted">
                      No records yet
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Historical timeline                                              */
/* ------------------------------------------------------------------ */

export function TimelineSection() {
  const [active, setActive] = useState<HistoricalPeriod>('Mughal Period');

  const meta = HISTORICAL_PERIOD_META.find((p) => p.id === active)!;
  const related = useMemo(
    () =>
      DESTINATIONS.filter((d) => d.historicalPeriod === active)
        .sort((a, b) => b.significanceScore - a.significanceScore)
        .slice(0, 4),
    [active],
  );

  return (
    <section className="border-y border-sand-200 bg-sand-gradient py-16 lg:py-24" aria-labelledby="timeline">
      <div className="container-page">
        <SectionHeading
          eyebrow="Historical timeline"
          title="Twenty-five centuries, period by period"
          description="Select a period to see the places in this collection that belong to it, and read what is established about that era — and where the dating is still debated."
          action={
            <Link href="/timeline" className="btn-secondary group shrink-0">
              Full timeline
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />

        {/* Period selector. A tablist, because it switches a panel below it. */}
        <div
          role="tablist"
          aria-label="Historical period"
          className="mt-10 flex snap-x gap-2 overflow-x-auto pb-2 scrollbar-none"
        >
          {HISTORICAL_PERIOD_META.map((period) => {
            const selected = period.id === active;
            return (
              <button
                key={period.id}
                role="tab"
                type="button"
                id={`tab-${period.id.replace(/\s+/g, '-')}`}
                aria-selected={selected}
                aria-controls={`panel-${period.id.replace(/\s+/g, '-')}`}
                onClick={() => setActive(period.id)}
                className={cn(
                  'shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                  selected
                    ? 'border-maroon-700 bg-maroon-700 text-sand-50 shadow-card'
                    : 'border-sand-300 bg-white/70 text-charcoal-soft hover:border-maroon-300 hover:bg-white hover:text-maroon-800',
                )}
              >
                {period.id}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${meta.id.replace(/\s+/g, '-')}`}
          aria-labelledby={`tab-${meta.id.replace(/\s+/g, '-')}`}
          className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]"
        >
          <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
            <p className="flex items-center gap-2 font-display text-2xl font-semibold text-maroon-800">
              <Clock className="h-5 w-5 text-saffron-600" aria-hidden="true" />
              {meta.range}
            </p>
            <p className="prose-heritage mt-4">{meta.summary}</p>

            <div className="mt-5 border-t border-sand-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                Associated with
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {meta.figures.map((figure) => (
                  <li key={figure}>
                    <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-[11px] font-medium text-charcoal-soft">
                      {figure}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/*
              The caveat is shown by default, not hidden behind a disclosure.
              Period boundaries are scholarly conventions and a reader planning
              a trip deserves to know that before, not after.
            */}
            <div className="mt-5 rounded-xl border-l-4 border-saffron-400 bg-saffron-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-saffron-800">
                How firm is this dating?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{meta.caveat}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-charcoal">
              {related.length > 0
                ? `Places in this collection from the ${meta.id}`
                : `No ${meta.id} records yet`}
            </h3>

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
                            <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-semibold text-charcoal-soft">
                              <Award className="h-2.5 w-2.5" aria-hidden="true" />
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
              <p className="mt-4 rounded-xl border border-dashed border-sand-300 bg-white/60 p-5 text-sm text-charcoal-muted">
                This collection does not yet have records from the {meta.id}. The period is
                described above so you have the context; records are added as they are
                researched and sourced.
              </p>
            )}

            {related.length > 0 ? (
              <Link
                href={`/destinations?period=${encodeURIComponent(meta.id)}`}
                className="btn-secondary group mt-4"
              >
                Browse all {meta.id} places
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Map preview                                                      */
/* ------------------------------------------------------------------ */

export function MapPreviewSection() {
  const unescoCount = UNESCO_DESTINATIONS.length;

  return (
    <section className="container-page py-16 lg:py-24" aria-labelledby="map-preview">
      <div className="overflow-hidden rounded-3xl border border-sand-200 bg-charcoal shadow-card-hover">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 lg:p-12">
            <p className="eyebrow">Interactive India map</p>
            <h2 id="map-preview" className="mt-2 text-display-sm font-semibold text-sand-50">
              Every place, on one map
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-sand-200/85 sm:text-base">
              Zoom, pan and search across India. Select a state to narrow the view, tap a
              marker to open the record, then get directions or add the place to a trip
              without leaving the map.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-sand-300/70">
                  Places
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-sand-50">
                  {DESTINATIONS.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-sand-300/70">
                  States
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-sand-50">
                  {new Set(DESTINATIONS.map((d) => d.state)).size}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-sand-300/70">
                  UNESCO
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-sand-50">
                  {unescoCount}
                </dd>
              </div>
            </dl>

            <Link href="/map" className="btn-accent btn-lg group mt-8">
              Explore the map
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          {/*
            A static preview rather than a live map instance: the real map is
            loaded on /map only, which keeps this section's JS payload small.
          */}
          <div className="relative min-h-[280px] bg-sand-900 lg:min-h-full">
            <MapPreviewArt />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Decorative schematic of India with plotted markers. */
function MapPreviewArt() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <svg
        viewBox="0 0 300 380"
        className="h-full w-auto max-w-full"
        role="img"
        aria-label="Schematic map of India with heritage locations marked"
      >
        <defs>
          <linearGradient id="bd-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a683e" />
            <stop offset="100%" stopColor="#4c3823" />
          </linearGradient>
        </defs>

        <path
          d="M150 18c14 10 24 6 34 14 12 10 10 24 22 30 14 8 30 4 40 18 8 12 2 26 10 38 8 12 24 14 28 30 4 14-8 26-6 40 2 16 16 26 12 42-4 14-20 18-30 28-10 10-12 26-24 34-12 8-26 4-36 12-12 10-14 28-28 36-14 8-30 2-42-8-12-10-14-26-22-38-8-12-22-18-28-32-6-14 2-28-4-42-6-14-22-22-24-38-2-14 8-26 14-38 6-12 2-28 12-38 10-10 24-10 34-20 10-10 10-26 20-34 8-6 20-4 28-10 6-4 6-14 10-20 4-6 12-10 20-12Z"
          fill="url(#bd-land)"
          stroke="#d1b585"
          strokeWidth="1.2"
          opacity="0.92"
        />

        {DESTINATIONS.map((destination, i) => {
          // Deterministic scatter, so the diagram is stable between renders.
          const x = 60 + seededIndex(`x-${destination.slug}`, 180);
          const y = 60 + seededIndex(`y-${destination.slug}`, 250);
          return (
            <circle
              key={destination.id}
              cx={x}
              cy={y}
              r={i % 5 === 0 ? 4.5 : 3}
              fill={i % 4 === 0 ? '#ffb020' : '#f8f2e8'}
              opacity={i % 4 === 0 ? 1 : 0.75}
            >
              <title>{`${destination.name}, ${destination.state}`}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
