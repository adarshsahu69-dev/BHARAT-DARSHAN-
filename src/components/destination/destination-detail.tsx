'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Building,
  CalendarRange,
  Check,
  Clock,
  ExternalLink,
  Info,
  MapPin,
  Share2,
  Sparkles,
  Trees,
} from 'lucide-react';
import { DestinationMiniMap } from '@/components/map/map-view';
import { DirectionsCard } from '@/components/map/directions-panel';
import { SaveButton } from '@/components/destination/destination-card';
import { AddToTripButton } from '@/components/trip/add-to-trip-button';
import { Badge, VerificationBadge } from '@/components/ui/states';
import { recordActivity } from '@/lib/store/user-data';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import { categoriesOf, DESTINATIONS } from '@/data/destinations';
import { shareUrlFor } from '@/lib/maps/google-maps';
import { cn, formatDuration } from '@/lib/utils';
import type { Destination } from '@/lib/types';

export function DestinationDetail({ destination }: { destination: Destination }) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState(0);

  const images = destination.images.length > 0 ? destination.images : [];
  const related = getRelated(destination, 3);

  // A view is recorded once per destination per mount, not on every re-render.
  useEffect(() => {
    if (!profile) return;
    void recordActivity(profile.id, destination.id, 'view');
  }, [destination.id, profile]);

  const onShare = async () => {
    const url = shareUrlFor(destination.slug);
    const shareData = { title: destination.name, text: destination.tagline, url };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // The user dismissed the share sheet, or the platform refused. Fall
        // through to copying the link rather than reporting a failure.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast({ variant: 'success', title: 'Link copied to clipboard' });
    } catch {
      toast({
        variant: 'error',
        title: 'Could not copy the link',
        description: url,
      });
    }
  };

  const hero = images[activeImage]?.imageUrl ?? destination.imageUrl;

  return (
    <article>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <header className="relative">
        <div className="relative h-[52vh] min-h-[340px] w-full overflow-hidden bg-charcoal lg:h-[62vh]">
          {hero ? (
            <Image
              src={hero}
              alt={
                activeImage === 0
                  ? `${destination.name}, ${destination.city}, ${destination.state}`
                  : images[activeImage]?.caption ?? destination.name
              }
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-hero-scrim" aria-hidden="true" />

          <div className="container-page absolute inset-x-0 bottom-0 pb-8">
            <nav aria-label="Breadcrumb" className="mb-3 text-xs text-sand-200/80">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-sand-50">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/destinations?state=${encodeURIComponent(destination.state)}`}
                    className="hover:text-sand-50"
                  >
                    {destination.state}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-sand-50" aria-current="page">
                  {destination.name}
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-saffron-500 px-2.5 py-0.5 text-[11px] font-semibold text-maroon-950">
                {destination.category}
              </span>
              <span className="rounded-full bg-charcoal/60 px-2.5 py-0.5 text-[11px] font-semibold text-sand-100 backdrop-blur-sm">
                {destination.historicalPeriod}
              </span>
              {destination.unescoYear ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/60 px-2.5 py-0.5 text-[11px] font-semibold text-sand-100 backdrop-blur-sm">
                  <Award className="h-3 w-3" aria-hidden="true" />
                  UNESCO {destination.unescoYear}
                </span>
              ) : null}
            </div>

            <h1 className="mt-3 text-display-md font-semibold text-sand-50">
              {destination.name}
            </h1>

            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sand-100/90">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {destination.city}, {destination.state}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                About {formatDuration(destination.visitDurationMinutes)} to visit
              </span>
            </p>
          </div>
        </div>

        {/* Gallery, when more than one image exists. */}
        {images.length > 1 ? (
          <div className="border-b border-sand-200 bg-white">
            <div className="container-page flex gap-2 overflow-x-auto py-3 scrollbar-none">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}: ${image.caption ?? destination.name}`}
                  aria-current={index === activeImage}
                  className={cn(
                    'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                    index === activeImage
                      ? 'border-saffron-500 opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-90',
                  )}
                >
                  <Image
                    src={image.imageUrl}
                    alt=""
                    fill
                    sizes="96px"
                    loading="lazy"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            {images[activeImage]?.caption ? (
              <div className="container-page pb-3">
                <p className="text-xs text-charcoal-muted">{images[activeImage].caption}</p>
                {images[activeImage]?.source ? (
                  <p className="mt-0.5 text-[11px] text-charcoal-muted">
                    Image:{' '}
                    <a
                      href={images[activeImage].source}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline underline-offset-2 hover:text-maroon-700"
                    >
                      licence and author on Wikimedia Commons
                    </a>
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Action bar */}
        <div className="sticky top-16 z-30 border-b border-sand-200 bg-ivory/95 backdrop-blur-md lg:top-[4.5rem]">
          <div className="container-page flex flex-wrap items-center gap-2 py-2.5">
            <SaveButton destinationId={destination.id} variant="inline" label={destination.name} />
            <AddToTripButton destination={destination} variant="inline" />
            <button type="button" onClick={onShare} className="btn-ghost btn-sm">
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}&zoom=15`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost btn-sm ml-auto"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Open in Maps
            </a>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Body                                                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
        <div className="min-w-0">
          {destination.verification === 'unverified' ? (
            <div
              className="mb-8 flex items-start gap-3 rounded-2xl border border-saffron-300/70 bg-saffron-50 p-4"
              role="note"
            >
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-saffron-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-saffron-900">
                  This is a draft record
                </p>
                <p className="mt-1 text-sm leading-relaxed text-saffron-900/85">
                  The historical text below has not yet been checked line by line against the
                  sources listed at the foot of this page. Dates marked{' '}
                  <span className="font-semibold">approximate</span> are scholarly estimates or
                  contested. Check the sources before relying on any claim here.
                </p>
              </div>
            </div>
          ) : null}

          {/* Overview */}
          <section aria-labelledby="overview" className="mb-12">
            <h2 id="overview" className="text-display-sm font-semibold text-charcoal">
              Overview
            </h2>
            <p className="mt-4 font-display text-xl leading-relaxed text-charcoal-soft">
              {destination.tagline}.
            </p>
            <p className="prose-heritage mt-4 text-base">{destination.description}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {categoriesOf(destination).map((category) => (
                <li key={category}>
                  <Link
                    href={`/destinations?category=${encodeURIComponent(category)}`}
                    className="chip"
                  >
                    {category}
                  </Link>
                </li>
              ))}
              {destination.tags.slice(0, 6).map((tag) => (
                <li key={tag}>
                  <Link href={`/destinations?q=${encodeURIComponent(tag)}`} className="chip">
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* History */}
          <section aria-labelledby="history" className="mb-12">
            <h2 id="history" className="text-display-sm font-semibold text-charcoal">
              History
            </h2>
            <div className="prose-heritage mt-4 text-base">
              {destination.historicalDescription.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Historical timeline */}
          <section aria-labelledby="dest-timeline" className="mb-12">
            <h2 id="dest-timeline" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
              <CalendarRange className="h-6 w-6 text-saffron-600" aria-hidden="true" />
              Historical timeline
            </h2>

            <ol className="mt-6 border-l-2 border-sand-200 pl-6">
              {destination.timeline.map((event, index) => (
                <li key={`${event.period}-${index}`} className="relative pb-8 last:pb-0">
                  <span
                    className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-maroon-700 shadow"
                    aria-hidden="true"
                  />
                  <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-saffron-700">
                    {event.period}
                    {event.approximate ? (
                      <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-charcoal-muted">
                        approximate
                      </span>
                    ) : null}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-charcoal">{event.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">{event.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Architecture & culture */}
          <section aria-labelledby="architecture" className="mb-12">
            <h2 id="architecture" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
              <Building className="h-6 w-6 text-saffron-600" aria-hidden="true" />
              Architecture &amp; culture
            </h2>

            <div className="mt-6 space-y-6">
              {destination.architecture.map((note) => (
                <div
                  key={note.heading}
                  className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card"
                >
                  <h3 className="text-base font-semibold text-charcoal">{note.heading}</h3>
                  <p className="prose-heritage mt-2">{note.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Location */}
          <section aria-labelledby="location" className="mb-12">
            <h2 id="location" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
              <MapPin className="h-6 w-6 text-saffron-600" aria-hidden="true" />
              Location
            </h2>

            <div className="mt-5 overflow-hidden rounded-2xl border border-sand-200 shadow-card">
              <DestinationMiniMap destination={destination} />
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-sand-200 bg-white p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                  Address
                </dt>
                <dd className="mt-1 text-sm text-charcoal-soft">
                  {destination.name}, {destination.city}, {destination.state}, India
                </dd>
              </div>
              <div className="rounded-xl border border-sand-200 bg-white p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                  Coordinates
                </dt>
                <dd className="mt-1 font-mono text-sm text-charcoal-soft">
                  {destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E
                </dd>
              </div>
            </dl>
          </section>

          {/* Visitor information */}
          <section aria-labelledby="visitor" className="mb-12">
            <h2 id="visitor" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
              <Sparkles className="h-6 w-6 text-saffron-600" aria-hidden="true" />
              Visitor information
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={Clock}
                title="Opening hours"
                body={destination.openingHours}
                footnote="Timings are set by the Archaeological Survey of India or the state tourism department and change. Confirm before you travel."
              />
              <InfoCard
                icon={Info}
                title="Entry"
                body={destination.entryInformation}
                footnote="Rates are revised periodically, and foreign visitors are usually charged a different rate."
              />
              <InfoCard
                icon={CalendarRange}
                title="Best time to visit"
                body={destination.bestSeason}
                footnote="Winter is the comfortable season almost everywhere; summer is punishing at sites with no shade."
              />
              <InfoCard
                icon={Clock}
                title="How long to allow"
                body={`About ${formatDuration(destination.visitDurationMinutes)} for the main circuit, at a normal pace.`}
                footnote="Add more if you are joining an archaeological guide or the site is closed to vehicles."
              />
            </div>

            {destination.nearbyAttractions.length > 0 ? (
              <div className="mt-6 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                  <Trees className="h-4 w-4 text-maroon-700" aria-hidden="true" />
                  Nearby
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {destination.nearbyAttractions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-charcoal-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          {/* Sources */}
          <SourcesSection destination={destination} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Sidebar                                                          */}
        {/* ---------------------------------------------------------------- */}
        <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start" aria-label="Destination tools">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-charcoal">At a glance</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <Row label="Category" value={destination.category} />
              <Row label="Period" value={destination.historicalPeriod} />
              <Row label="State" value={destination.state} />
              <Row label="City" value={destination.city} />
              {destination.unescoYear ? (
                <Row
                  label="UNESCO"
                  value={
                    <a
                      href={destination.sources.find((s) => s.sourceType === 'UNESCO')?.url ?? '#sources'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-maroon-800"
                    >
                      Inscribed {destination.unescoYear}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  }
                />
              ) : null}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-charcoal-muted">Record status</dt>
                <dd>
                  <VerificationBadge verification={destination.verification} />
                </dd>
              </div>
            </dl>
          </div>

          <DirectionsCard
            destination={{
              label: destination.name,
              lat: destination.latitude,
              lng: destination.longitude,
            }}
          />

          {related.length > 0 ? (
            <div className="card p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                <BookOpen className="h-4 w-4 text-maroon-700" aria-hidden="true" />
                Nearby in this collection
              </h2>
              <ul className="mt-3 space-y-2.5">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/destinations/${item.slug}`}
                      className="group flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-sand-50"
                    >
                      <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md bg-sand-200">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt=""
                            fill
                            sizes="56px"
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-charcoal">
                          {item.name}
                        </span>
                        <span className="block truncate text-[11px] text-charcoal-muted">
                          {item.city}, {item.state}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function InfoCard({
  icon: Icon,
  title,
  body,
  footnote,
}: {
  icon: typeof Clock;
  title: string;
  body: string;
  footnote?: string;
}) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
        <Icon className="h-4 w-4 text-saffron-600" aria-hidden="true" />
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{body}</p>
      {footnote ? (
        <p className="mt-2.5 border-t border-sand-200 pt-2.5 text-[11px] leading-relaxed text-charcoal-muted">
          {footnote}
        </p>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-charcoal-muted">{label}</dt>
      <dd className="text-right font-medium text-charcoal-soft">{value}</dd>
    </div>
  );
}

/**
 * Sources panel.
 *
 * Every historical record carries its provenance. Grouping by source type makes
 * the mix visible at a glance — a claim resting only on a blog post should look
 * different from one resting on an ASI record.
 */
function SourcesSection({ destination }: { destination: Destination }) {
  const grouped = destination.sources.reduce<Record<string, typeof destination.sources>>(
    (acc, source) => {
      const bucket = acc[source.sourceType] ?? [];
      bucket.push(source);
      acc[source.sourceType] = bucket;
      return acc;
    },
    {},
  );

  return (
    <section id="sources" aria-labelledby="sources-heading" className="scroll-mt-32">
      <h2 id="sources-heading" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
        <BookOpen className="h-6 w-6 text-saffron-600" aria-hidden="true" />
        Sources &amp; references
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
        The history above is drawn from these sources. Where a date or an attribution is
        debated, the record says so rather than picking a side.
      </p>

      <div className="mt-5 space-y-5">
        {Object.entries(grouped).map(([sourceType, sources]) => (
          <div key={sourceType} className="rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <Badge tone="primary">{sourceType}</Badge>
            </h3>
            <ul className="mt-3 space-y-3">
              {sources.map((source) => (
                <li key={source.id} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" aria-hidden="true" />
                  <div className="min-w-0">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-start gap-1 text-sm font-medium text-maroon-700 underline underline-offset-2 hover:text-maroon-800"
                    >
                      {source.title}
                      <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    {source.note ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-charcoal-muted">
                        {source.note}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Same state or nearest by great-circle distance, capped and de-duplicated. */
function getRelated(destination: Destination, limit: number): Destination[] {
  const scored = DESTINATIONS.filter((d) => d.id !== destination.id).map((d) => {
    const sameState = d.state === destination.state;
    const samePeriod = d.historicalPeriod === destination.historicalPeriod;
    const distance = haversineApprox(
      destination.latitude,
      destination.longitude,
      d.latitude,
      d.longitude,
    );
    // Same state dominates, then period, then proximity.
    const score =
      (sameState ? 100 : 0) + (samePeriod ? 40 : 0) - Math.min(40, distance / 40);
    return { destination: d, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.destination);
}

/** Cheap equirectangular approximation; only used for ranking, never displayed. */
function haversineApprox(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180;
  const x = (lon2 - lon1) * rad * Math.cos(((lat1 + lat2) / 2) * rad);
  const y = (lat2 - lat1) * rad;
  return Math.sqrt(x * x + y * y) * 6371;
}
