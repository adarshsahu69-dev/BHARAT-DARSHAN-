import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';
import { ButtonLink } from './button-link';

/**
 * Global 404.
 *
 * Renders real navigation rather than a dead end: a search entry point, the
 * browsable collection, and the map. The message names what was not found,
 * because "not found" on its own does not tell a visitor whether their link is
 * broken or the site is.
 */
export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sand-100 text-maroon-700">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>

      <p className="font-display text-6xl font-semibold text-sand-300">404</p>
      <h1 className="mt-3 text-display-sm font-semibold text-charcoal">
        We could not find that page
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-charcoal-soft sm:text-base">
        The link may be out of date, or the destination may not be in the collection yet. The
        whole collection is browsable, and search covers dynasties and rulers as well as
        monument names.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/" variant="primary">
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to home
        </ButtonLink>
        <ButtonLink href="/destinations" variant="secondary">
          <Compass className="h-4 w-4" aria-hidden="true" />
          Browse destinations
        </ButtonLink>
        <ButtonLink href="/search" variant="secondary">
          <Search className="h-4 w-4" aria-hidden="true" />
          Search the collection
        </ButtonLink>
      </div>

      <p className="mt-10 max-w-md text-xs leading-relaxed text-charcoal-muted">
        Looking for a specific monument? Try the{' '}
        <Link href="/historical-places" className="underline underline-offset-2">
          historical places index
        </Link>{' '}
        by period, or the{' '}
        <Link href="/map" className="underline underline-offset-2">
          interactive map
        </Link>
        .
      </p>
    </div>
  );
}
