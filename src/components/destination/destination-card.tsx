'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Bookmark, Clock, MapPin } from 'lucide-react';
import { categoriesOf } from '@/data/destinations';
import { useAuth } from '@/lib/auth/session-provider';
import { recordActivity, toggleSaved } from '@/lib/store/user-data';
import { useToast } from '@/components/ui/toast';
import { cn, formatDuration } from '@/lib/utils';
import type { Destination } from '@/lib/types';

/**
 * Destination card.
 *
 * The whole card is a link for a large tap target, and the save control sits
 * above it as a sibling rather than a nested interactive element — a button
 * inside an anchor is invalid HTML and breaks keyboard behaviour.
 */
export function DestinationCard({
  destination,
  priority = false,
  className,
}: {
  destination: Destination;
  /** Above-the-fold images should not be lazy. */
  priority?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'card-interactive group relative flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-saffron-500 focus-within:ring-offset-2',
        className,
      )}
    >
      <SaveButton destinationId={destination.id} className="absolute right-3 top-3 z-10" />

      <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
        {destination.imageUrl ? (
          <Image
            src={destination.imageUrl}
            alt={`${destination.name}, ${destination.city}, ${destination.state}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            className="object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-sand-gradient text-sm text-charcoal-muted">
            Image unavailable
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-charcoal/55 to-transparent" />

        {destination.unescoYear ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-charcoal/75 px-2.5 py-0.5 text-[11px] font-semibold text-sand-50 backdrop-blur-sm">
            UNESCO · {destination.unescoYear}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
            {destination.category}
          </span>
          {categoriesOf(destination)
            .filter((c) => c !== destination.category)
            .slice(0, 1)
            .map((c) => (
              <span key={c} className="text-[11px] text-charcoal-muted">
                · {c}
              </span>
            ))}
        </div>

        <h3 className="mt-1.5 text-lg font-semibold leading-snug text-charcoal">
          {/* Stretched link makes the title the accessible name for the whole card. */}
          <Link href={`/destinations/${destination.slug}`} className="after:absolute after:inset-0">
            {destination.name}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            {destination.city}, {destination.state}
          </span>
        </p>

        <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-charcoal-soft">
          {destination.description}
        </p>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-sand-200 pt-3">
          <span className="text-[11px] font-medium text-charcoal-muted">
            {destination.historicalPeriod}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-charcoal-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDuration(destination.visitDurationMinutes)}
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * Bookmark toggle.
 *
 * Signed-out users are sent to sign-in with a return path rather than being
 * silently ignored, so the intent is not lost.
 */
export function SaveButton({
  destinationId,
  className,
  variant = 'overlay',
  label,
}: {
  destinationId: string;
  className?: string;
  variant?: 'overlay' | 'inline';
  label?: string;
}) {
  const { profile, loading } = useAuth();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  // Avoids a save indicator flashing before the user's list has been read.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!profile) {
        if (!cancelled) {
          setSaved(false);
          setReady(true);
        }
        return;
      }
      const { getSavedIds } = await import('@/lib/store/user-data');
      const ids = await getSavedIds(profile.id);
      if (cancelled) return;
      setSaved(ids.includes(destinationId));
      setReady(true);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [destinationId, profile]);

  const onClick = useCallback(async () => {
    if (!profile) {
      const { redirectToLogin } = await import('@/lib/auth/redirect');
      toast({
        variant: 'info',
        title: 'Sign in to save places',
        description: 'Saved places and trips are tied to your account.',
      });
      redirectToLogin();
      return;
    }

    setBusy(true);
    const { saved: nowSaved, error } = await toggleSaved(profile.id, destinationId);

    if (error) {
      toast({ variant: 'error', title: error });
    } else {
      setSaved(nowSaved);
      void recordActivity(profile.id, destinationId, nowSaved ? 'save' : 'unsave');
      toast({
        variant: nowSaved ? 'success' : 'info',
        title: nowSaved ? 'Saved to your places' : 'Removed from saved',
      });
    }
    setBusy(false);
  }, [destinationId, profile, toast]);

  const isOverlay = variant === 'overlay';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || loading || !ready}
      aria-pressed={ready ? saved : undefined}
      aria-label={
        ready
          ? saved
            ? `Remove ${label ?? 'this place'} from saved`
            : `Save ${label ?? 'this place'}`
          : 'Loading saved state'
      }
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-200',
        isOverlay
          ? 'h-9 w-9 border border-white/25 bg-charcoal/55 text-sand-50 backdrop-blur-sm hover:bg-charcoal/75 disabled:opacity-50'
          : 'btn-secondary',
        !ready && 'animate-pulse',
        className,
      )}
    >
      <Bookmark
        className={cn('h-4 w-4 transition-transform', saved && 'scale-110 fill-current')}
        aria-hidden="true"
      />
      {isOverlay ? null : <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
