import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, ListChecks, MapPinned, Route } from 'lucide-react';
import { DESTINATIONS, UNESCO_DESTINATIONS } from '@/data/destinations';
import { DestinationCard } from '@/components/destination/destination-card';
import { SectionHeading } from '@/components/home/sections';
import { VerificationBadge } from '@/components/ui/states';

/* ------------------------------------------------------------------ */
/* 8. Plan your journey                                                */
/* ------------------------------------------------------------------ */

const PLANNER_STEPS = [
  {
    icon: CalendarDays,
    title: 'Name the trip',
    body: 'Set the dates, the number of travellers and where you are starting from. You can change all of it later.',
  },
  {
    icon: ListChecks,
    title: 'Add the places',
    body: 'Search the collection, or add straight from a destination page or the map. Order them as you would walk the route.',
  },
  {
    icon: Route,
    title: 'Set the itinerary',
    body: 'Give each stop a day and a time. The panel reorders as you edit and flags days that are overloaded.',
  },
  {
    icon: MapPinned,
    title: 'Hand it to Google Maps',
    body: 'The whole route opens in Google Maps with every stop in order, ready for turn-by-turn navigation.',
  },
];

export function PlanJourneySection() {
  return (
    <section className="paper-texture border-y border-sand-200 py-16 lg:py-24" aria-labelledby="plan">
      <div className="container-page">
        <SectionHeading
          eyebrow="Plan your journey"
          title="From a list of places to a route you can actually walk"
          description="The trip planner keeps the historical detail and the logistics in the same place, so an itinerary is built from places you have read about — not just places you found on a map."
          action={
            <Link href="/trip-planner" className="btn-primary group shrink-0">
              Start planning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANNER_STEPS.map((step, index) => (
            <li key={step.title} className="card relative p-5">
              <span
                className="absolute right-4 top-4 font-display text-3xl font-semibold text-sand-200"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-semibold text-charcoal">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Featured heritage sites                                          */
/* ------------------------------------------------------------------ */

export function FeaturedHeritageSection() {
  const featured = UNESCO_DESTINATIONS.slice(0, 4);

  return (
    <section className="container-page py-16 lg:py-24" aria-labelledby="heritage">
      <SectionHeading
        eyebrow="Featured heritage sites"
        title="On the UNESCO World Heritage List"
        description="India has one of the largest World Heritage inventories of any country. These are the records in this collection that carry an inscription, with the year and criteria taken from the official listing."
        action={
          <Link href="/destinations?category=UNESCO+Heritage" className="btn-secondary group shrink-0">
            All World Heritage places
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        }
      />

      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {featured.map((destination) => (
          <li key={destination.id}>
            <Link
              href={`/destinations/${destination.slug}`}
              className="card-interactive group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden p-6"
            >
              {destination.imageUrl ? (
                <Image
                  src={destination.imageUrl}
                  alt={`${destination.name}, ${destination.state}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                />
              ) : null}
              <div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/92 via-charcoal/45 to-transparent"
                aria-hidden="true"
              />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-saffron-500 px-2.5 py-0.5 text-[11px] font-semibold text-maroon-950">
                    Inscribed {destination.unescoYear}
                  </span>
                  <VerificationBadge verification={destination.verification} />
                </div>
                <h3 className="mt-2.5 text-xl font-semibold text-sand-50">
                  {destination.name}
                </h3>
                <p className="mt-1 text-xs text-sand-200/80">
                  {destination.city}, {destination.state} · {destination.historicalPeriod}
                </p>
                <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-sand-100/90">
                  {destination.tagline}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Cultural discoveries                                            */
/* ------------------------------------------------------------------ */

export function CulturalDiscoveriesSection() {
  // A cross-section across regions and categories, chosen to avoid repeating
  // the same four states the other sections lead with.
  const picks = [
    ...DESTINATIONS.filter((d) => d.category === 'Natural Heritage'),
    ...DESTINATIONS.filter((d) => d.category === 'Cultural Festivals'),
    ...DESTINATIONS.filter((d) => d.tags.includes('festival')),
    ...DESTINATIONS.filter((d) => d.state === 'Odisha'),
    ...DESTINATIONS.filter((d) => d.state === 'Bihar'),
  ]
    .filter((destination, index, list) => list.findIndex((d) => d.id === destination.id) === index)
    .slice(0, 8);

  const cards = picks.length >= 4 ? picks : DESTINATIONS.slice(0, 8);

  return (
    <section className="border-y border-sand-200 bg-sand-gradient py-16 lg:py-24" aria-labelledby="culture">
      <div className="container-page">
        <SectionHeading
          eyebrow="Cultural discoveries"
          title="Beyond the monument: what people still do"
          description="A temple in the record is one thing; the festival that fills it each year, the stepwell that cools a whole town, the stupa that a village has kept alight for two thousand years — that is the other half."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-charcoal-muted">
          Festival dates follow the lunar and lunisolar calendars and change year to year, and
          several festivals are specific to one temple or one community rather than to a
          region. Every visitor-information panel here says so, and points to the official
          source, rather than publishing a date that will be wrong by next season.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Call to action                                                  */
/* ------------------------------------------------------------------ */

export function CallToAction() {
  return (
    <section className="relative isolate overflow-hidden py-20 lg:py-28" aria-labelledby="cta">
      <div className="absolute inset-0 bg-maroon-gradient" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,214,140,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 45%)',
        }}
        aria-hidden="true"
      />
      <div className="rule-ornament absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="container-reading relative text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-200">
          Ready when you are
        </p>
        <h2 id="cta" className="mt-4 text-display-md font-semibold text-sand-50">
          Start with one place.
          <span className="block text-saffron-200">The rest of India follows.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-sand-100/90">
          Pick a destination, read where the history comes from, then save it and drop it into
          an itinerary. That is the whole loop: discover, learn, locate, save, plan, travel.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/destinations" className="btn-accent btn-lg w-full sm:w-auto">
            Browse all destinations
          </Link>
          <Link
            href="/signup"
            className="btn-lg w-full border border-sand-100/40 bg-white/10 text-sand-50 backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
          >
            Create an account
          </Link>
        </div>

        <p className="mt-6 text-xs text-sand-200/70">
          No account needed to browse. Sign in to save places and keep your itineraries.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 11b. Stats strip                                                    */
/* ------------------------------------------------------------------ */

export function StatsStrip() {
  const stats = [
    { value: DESTINATIONS.length, label: 'Destinations with sourced history' },
    { value: UNESCO_DESTINATIONS.length, label: 'UNESCO World Heritage records' },
    { value: new Set(DESTINATIONS.map((d) => d.state)).size, label: 'States and union territories' },
    {
      value: DESTINATIONS.reduce((sum, d) => sum + d.sources.length, 0),
      label: 'Cited sources',
    },
  ];

  return (
    <section className="border-b border-sand-200 bg-white py-10" aria-label="Collection at a glance">
      <dl className="container-page grid grid-cols-2 gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-display text-3xl font-semibold text-maroon-800">
                {stat.value}
              </span>
              <span className="mt-1 block text-xs text-charcoal-muted">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
