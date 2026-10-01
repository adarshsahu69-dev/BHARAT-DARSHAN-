'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { DESTINATIONS, getDestinationById } from '@/data/destinations';
import { discover, EMPTY_FILTERS, hasActiveFilters } from '@/lib/discovery/discovery';
import { DestinationCard } from '@/components/destination/destination-card';
import { FilterPanel, ActiveFilterChips, SortSelect } from '@/components/discovery/filter-panel';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import { redirectToLogin } from '@/lib/auth/redirect';
import { getSavedIds } from '@/lib/store/user-data';
import { EmptyState, DestinationGridSkeleton } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { Destination, DestinationFilters } from '@/lib/types';

/**
 * Saved places.
 *
 * Filters apply to the saved set rather than the whole collection, so the counts
 * shown next to each facet reflect what the visitor has actually saved. The
 * filter state is held locally: this page is a personal view, not a linkable
 * search.
 */
export function SavedPlaces() {
  const { profile, loading } = useAuth();
  const [saved, setSaved] = useState<Destination[] | null>(null);
  const [filters, setFilters] = useState<DestinationFilters>({ ...EMPTY_FILTERS, savedOnly: true });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      setSaved([]);
      return;
    }
    void getSavedIds(profile.id).then((ids) =>
      setSaved(ids.map(getDestinationById).filter((d): d is Destination => Boolean(d))),
    );
  }, [loading, profile]);

  const result = useMemo(() => {
    if (!saved) {
      return { results: [], total: 0, page: 1, pageCount: 1, pageSize: 12, empty: false };
    }
    // `savedOnly` is redundant here since the input is already the saved set.
    return discover(saved, { ...filters, savedOnly: false }, { pageSize: 60 });
  }, [filters, saved]);

  if (!loading && !profile) {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Sign in to see your saved places"
          description="Bookmarks are tied to your account, so they follow you between devices once you are signed in."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => redirectToLogin('/dashboard/saved')}
            >
              Sign in
            </button>
          }
          secondaryAction={
            <Link href="/signup" className="btn-secondary">
              Create an account
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-2 text-display-sm font-semibold text-charcoal">Saved places</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
            The destinations you have bookmarked. Add one to a trip from here, or open it to
            read the history and check the sources.
          </p>
        </div>
        <button type="button" className="btn-primary shrink-0" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add places
        </button>
      </header>

      {saved === null ? (
        <div className="mt-10">
          <DestinationGridSkeleton count={6} />
        </div>
      ) : saved.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No saved places yet"
            description="Tap the bookmark on any destination — on a card, a detail page or the map — to keep it here."
            action={
              <Link href="/destinations" className="btn-primary">
                Browse destinations
              </Link>
            }
            secondaryAction={
              <Link href="/explore" className="btn-secondary">
                Explore by theme
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-charcoal-muted" role="status" aria-live="polite">
              <span className="font-semibold text-charcoal">{result.total}</span> of{' '}
              {saved.length} saved{' '}
              {hasActiveFilters(filters) ? 'matching your filters' : 'places'}
            </p>
            <SortSelect
              value={filters.sort}
              onChange={(sort) => setFilters((f) => ({ ...f, sort }))}
            />
          </div>

          {hasActiveFilters(filters) ? (
            <ActiveFilterChips
              filters={filters}
              onChange={setFilters}
              className="mt-4"
            />
          ) : null}

          <div className="mt-8 gap-10 lg:grid lg:grid-cols-[16rem_1fr]">
            <aside className="hidden lg:block" aria-label="Filter saved places">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-sand-200 bg-white p-4 shadow-card">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters({ ...EMPTY_FILTERS, savedOnly: true })}
                  destinations={saved}
                  showSavedFilter={false}
                />
              </div>
            </aside>

            <div>
              {result.empty ? (
                <EmptyState
                  title="No saved places match these filters"
                  description="Try removing a category, state or period filter."
                  action={
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setFilters({ ...EMPTY_FILTERS, savedOnly: true })}
                    >
                      Clear filters
                    </button>
                  }
                />
              ) : (
                <ul className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3')}>
                  {result.results.map(({ destination }) => (
                    <li key={destination.id}>
                      <DestinationCard destination={destination} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      {adding ? (
        <AddSavedPlacesDialog
          existing={new Set((saved ?? []).map((d) => d.id))}
          onClose={() => setAdding(false)}
          onSaved={(ids) => {
            setSaved(ids.map(getDestinationById).filter((d): d is Destination => Boolean(d)));
            setAdding(false);
          }}
        />
      ) : null}
    </div>
  );
}

/** Bulk picker: bookmark several places at once from the whole collection. */
function AddSavedPlacesDialog({
  existing,
  onClose,
  onSaved,
}: {
  existing: Set<string>;
  onClose(): void;
  onSaved(ids: string[]): void;
}) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');

  const candidates = useMemo(() => {
    const pool = DESTINATIONS.filter((d) => !existing.has(d.id));
    if (!query.trim()) return pool.slice(0, 24);
    const q = query.toLowerCase();
    return pool
      .filter((d) =>
        `${d.name} ${d.city} ${d.state} ${d.tags.join(' ')}`.toLowerCase().includes(q),
      )
      .slice(0, 24);
  }, [existing, query]);

  const toggle = (id: string) => {
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const save = async () => {
    if (!profile || chosen.size === 0) {
      onClose();
      return;
    }
    const { toggleSaved } = await import('@/lib/store/user-data');
    await Promise.all([...chosen].map((id) => toggleSaved(profile.id, id)));
    toast({
      variant: 'success',
      title: `Saved ${chosen.size} ${chosen.size === 1 ? 'place' : 'places'}`,
    });
    onSaved([...chosen, ...existing]);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-charcoal/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add saved places"
        className="relative z-10 max-h-[85vh] w-full max-w-2xl animate-scale-in overflow-hidden rounded-t-2xl bg-white shadow-card-hover sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-sand-200 p-5">
          <h2 className="text-lg font-semibold text-charcoal">Add saved places</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-charcoal-muted hover:bg-sand-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">
          <label htmlFor="saved-picker-search" className="sr-only">
            Search the collection
          </label>
          <input
            id="saved-picker-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the collection…"
            className="input"
          />

          <ul className="mt-4 max-h-80 space-y-1.5 overflow-y-auto">
            {candidates.map((destination) => {
              const checked = chosen.has(destination.id);
              return (
                <li key={destination.id}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-colors',
                      checked ? 'border-maroon-300 bg-maroon-50' : 'border-sand-200 hover:bg-sand-50',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(destination.id)}
                      className="h-4 w-4 rounded border-sand-400 text-maroon-700 focus:ring-saffron-500"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-charcoal">
                        {destination.name}
                      </span>
                      <span className="block truncate text-xs text-charcoal-muted">
                        {destination.city}, {destination.state}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-sand-200 bg-sand-50 p-5">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={save}
            disabled={chosen.size === 0}
          >
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            {chosen.size > 0 ? `Save ${chosen.size} ${chosen.size === 1 ? 'place' : 'places'}` : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
