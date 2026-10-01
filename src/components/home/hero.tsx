'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { HERO_SLIDES } from '@/data/destinations';
import { SearchBar } from '@/components/search/search-bar';
import { cn, seededIndex } from '@/lib/utils';
import { DESTINATIONS } from '@/data/destinations';

const ROTATE_MS = 7000;

export function Hero() {
  const slides = HERO_SLIDES;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index] ?? slides[0];
  // Stable per-mount picks, so the suggestion row does not reshuffle on rerender.
  const [picks] = useState(() => {
    const count = Math.min(4, DESTINATIONS.length);
    return Array.from({ length: count }, (_, i) =>
      DESTINATIONS[seededIndex(`hero-pick-${index}-${i}`, DESTINATIONS.length)]!,
    ).filter(Boolean);
  });

  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden bg-charcoal lg:min-h-[86vh]">
      {/* Crossfading background images */}
      {slides.map((item, i) => (
        <div
          key={item.credit}
          aria-hidden={i !== index}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1600ms] ease-linear',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Image
            src={item.url}
            alt={i === index ? item.alt : ''}
            fill
            priority={i === 0}
            sizes="100vw"
            quality={80}
            className={cn(
              'object-cover transition-transform duration-[9000ms] ease-linear',
              i === index && 'scale-105',
            )}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-hero-scrim" aria-hidden="true" />

      {/* Decorative heritage rule, echoing the gold motif in the brand. */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gold-rule opacity-40" aria-hidden="true" />

      <div className="container-page relative flex min-h-[78vh] flex-col justify-center py-16 lg:min-h-[86vh] lg:py-24">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-saffron-300/40 bg-saffron-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-saffron-200 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Heritage, history and travel in one place
          </p>

          <h1 className="mt-6 text-display-lg font-semibold text-sand-50">
            Discover India&rsquo;s Stories,
            <span className="block text-saffron-300">One Destination at a Time.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-sand-100/90 sm:text-lg">
            Explore India&rsquo;s history, culture, heritage and destinations. Plan your journey
            and discover the stories behind every place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/destinations"
              className="btn-accent btn-lg group w-full sm:w-auto"
            >
              Explore India
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/trip-planner"
              className="btn-lg w-full border border-sand-200/40 bg-white/10 text-sand-50 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 sm:w-auto"
            >
              Plan Your Trip
            </Link>
          </div>

          <div className="mt-10 max-w-2xl">
            <SearchBar variant="hero" />
          </div>

          {/* Rotating quick links, so the hero stays useful without scrolling. */}
          {picks.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-sand-200/80">
              <span className="font-medium">Popular:</span>
              {picks.map((destination) => (
                <Link
                  key={destination.id}
                  href={`/destinations/${destination.slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-sand-200/25 bg-white/5 px-2.5 py-1 transition-colors hover:border-saffron-300/50 hover:bg-white/10 hover:text-sand-50"
                >
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {destination.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Image credit, required by the Wikimedia licences. */}
      {slide ? (
        <p className="absolute bottom-3 right-4 z-10 max-w-[70%] text-right text-[10px] text-sand-200/60">
          Image:{' '}
          <a
            href={slide.creditUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline underline-offset-2 hover:text-sand-100"
          >
            {slide.credit}
          </a>
        </p>
      ) : null}
    </section>
  );
}
