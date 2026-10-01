'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, Plus, Search } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { searchDestinations } from '@/lib/search/search-engine';
import { addStop, recordActivity } from '@/lib/store/user-data';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import { Modal } from '@/components/ui/modal';
import { NoResultsState } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { Destination } from '@/lib/types';

/**
 * Destination picker for a trip.
 *
 * Search is fuzzy and debounced through the same engine the site search uses, so
 * "khjrao" and "chldb" both work here. Places already in the trip are shown but
 * disabled, rather than hidden, so the user can see why a result is unavailable.
 */
export function AddDestinationDialog({
  open,
  onClose,
  tripId,
  existingIds,
  onAdded,
}: {
  open: boolean;
  onClose(): void;
  tripId: string;
  existingIds: string[];
  onAdded(): void;
}) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setDebounced('');
      setAdded(new Set());
    }
  }, [open]);

  const results = useMemo<Destination[]>(() => {
    if (!debounced.trim()) return [...DESTINATIONS].slice(0, 12);
    return searchDestinations(DESTINATIONS, debounced, 24).map((r) => r.destination);
  }, [debounced]);

  const inTrip = useMemo(() => new Set(existingIds), [existingIds]);

  const add = async (destination: Destination) => {
    if (!profile) return;
    setBusyId(destination.id);
    const result = await addStop(profile.id, tripId, {
      destinationId: destination.id,
    });
    setBusyId(null);

    if (!result.ok) {
      toast({ variant: 'error', title: result.error ?? 'Could not add that place.' });
      return;
    }

    void recordActivity(profile.id, destination.id, 'trip_add');
    setAdded((prev) => new Set(prev).add(destination.id));
    toast({ variant: 'success', title: `Added ${destination.name}` });
    onAdded();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a destination"
      description="Search the collection and add the places you want to visit."
      size="lg"
      footer={
        <button type="button" className="btn-primary" onClick={onClose}>
          Done
        </button>
      }
    >
      <div className="relative">
        <label htmlFor="add-destination-search" className="sr-only">
          Search destinations
        </label>
        <div className="flex items-center gap-2.5 rounded-xl border border-sand-300 bg-white px-3.5 py-2.5 focus-within:border-saffron-500 focus-within:ring-2 focus-within:ring-saffron-500/25">
          <Search className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
          <input
            id="add-destination-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search places, cities, dynasties, rulers…"
            autoComplete="off"
            className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal-muted/80 focus:outline-none"
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-5">
          <NoResultsState query={debounced} onClear={() => setQuery('')} />
        </div>
      ) : (
        <ul className="mt-4 max-h-[26rem] space-y-1.5 overflow-y-auto pr-1">
          {results.map((destination) => {
            const already = inTrip.has(destination.id);
            const justAdded = added.has(destination.id);
            const busy = busyId === destination.id;

            return (
              <li key={destination.id}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-2.5 transition-colors',
                    already
                      ? 'border-sand-200 bg-sand-50'
                      : 'border-sand-200 bg-white hover:border-saffron-400',
                  )}
                >
                  <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-sand-200">
                    {destination.imageUrl ? (
                      <Image
                        src={destination.imageUrl}
                        alt=""
                        fill
                        sizes="64px"
                        loading="lazy"
                        className="object-cover"
                      />
                    ) : null}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-charcoal">
                      {destination.name}
                    </span>
                    <span className="block truncate text-xs text-charcoal-muted">
                      {destination.city}, {destination.state} · {destination.historicalPeriod}
                    </span>
                  </span>

                  {already ? (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-success-700">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      {justAdded ? 'Added' : 'In trip'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => add(destination)}
                      disabled={busy}
                      aria-label={`Add ${destination.name} to the trip`}
                      className="btn-secondary btn-sm shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      {busy ? 'Adding…' : 'Add'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
