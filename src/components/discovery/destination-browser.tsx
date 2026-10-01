'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import {
  DEFAULT_PAGE_SIZE,
  EMPTY_FILTERS,
  activeFilterCount,
  describeFilters,
  discover,
  filtersFromParams,
  filtersToParams,
  hasActiveFilters,
} from '@/lib/discovery/discovery';
import { DestinationCard } from '@/components/destination/destination-card';
import {
  ActiveFilterChips,
  FilterPanel,
  SortSelect,
  sanitiseFilters,
} from '@/components/discovery/filter-panel';
import { NoResultsState } from '@/components/ui/states';
import { Modal } from '@/components/ui/modal';
import { SearchBar } from '@/components/search/search-bar';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import type { DestinationFilters } from '@/lib/types';

/**
 * Destination browser: search, filter, sort and paginate.
 *
 * All state lives in the URL. That makes every filtered view linkable, keeps the
 * back button meaningful, and lets the server render the first page of results
 * for a shared link.
 */
export function DestinationBrowser({
  showFilters = true,
  heading,
  description,
  showSavedFilter = true,
  emptyHint,
}: {
  showFilters?: boolean;
  heading?: string;
  description?: string;
  showSavedFilter?: boolean;
  emptyHint?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const { toast } = useToast();

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Filters are read from the URL on every render, so there is one source of truth.
  const filters = useMemo(
    () => sanitiseFilters(filtersFromParams(new URLSearchParams(searchParams.toString()))),
    [searchParams],
  );

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);

  useEffect(() => {
    if (!profile) {
      setSavedIds([]);
      return;
    }
    let cancelled = false;
    setSavedLoading(true);
    void import('@/lib/store/user-data').then(({ getSavedIds: load }) =>
      load(profile.id).then((ids) => {
        if (cancelled) return;
        setSavedIds(ids);
        setSavedLoading(false);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, [profile]);

  // Warn once if a signed-in visitor filters to saved places with none saved.
  const warnedEmptySaved = useRef(false);
  useEffect(() => {
    if (!filters.savedOnly || savedLoading || !profile) return;
    if (savedIds.length === 0 && !warnedEmptySaved.current) {
      warnedEmptySaved.current = true;
      toast({
        variant: 'info',
        title: 'You have not saved any places yet',
        description: 'Tap the bookmark on any destination to add it here.',
      });
    }
  }, [filters.savedOnly, profile, savedIds.length, savedLoading, toast]);

  const discovery = useMemo(
    () =>
      discover(DESTINATIONS, filters, {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        savedIds,
      }),
    [filters, page, savedIds],
  );

  const push = (next: DestinationFilters, nextPage = 1) => {
    const params = filtersToParams(next);
    if (nextPage > 1) params.set('page', String(nextPage));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete('page');
    else params.set('page', String(nextPage));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const active = hasActiveFilters(filters);
  const chips = describeFilters(filters);

  return (
    <div className="container-page py-10 lg:py-14">
      {heading ? (
        <header className="max-w-3xl">
          <h1 className="text-display-sm font-semibold text-charcoal">{heading}</h1>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-charcoal-soft sm:text-base">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}

      <div className="mt-8">
        <SearchBar
          variant="page"
          initialValue={filters.query}
          placeholder="Search places, monuments, cities, forts, temples, dynasties…"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-charcoal-muted" role="status" aria-live="polite">
          {savedLoading && filters.savedOnly ? (
            'Loading your saved places…'
          ) : (
            <>
              <span className="font-semibold text-charcoal">{discovery.total}</span>{' '}
              {discovery.total === 1 ? 'destination' : 'destinations'}
              {active ? ' match your filters' : ' in the collection'}
            </>
          )}
        </p>

        <div className="flex items-center gap-3">
          <SortSelect value={filters.sort} onChange={(sort) => push({ ...filters, sort })} />
          {showFilters ? (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="btn-secondary btn-sm lg:hidden"
              aria-haspopup="dialog"
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
              {activeFilterCount(filters) > 0 ? (
                <span className="rounded-full bg-maroon-700 px-1.5 text-[10px] font-bold text-sand-50">
                  {activeFilterCount(filters)}
                </span>
              ) : null}
            </button>
          ) : null}
        </div>
      </div>

      {chips.length > 0 ? (
        <ActiveFilterChips filters={filters} onChange={(next) => push(next)} className="mt-4" />
      ) : null}

      <div className="mt-8 gap-10 lg:grid lg:grid-cols-[16rem_1fr]">
        {showFilters ? (
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-sand-200 bg-white p-4 shadow-card">
              <FilterPanel
                filters={filters}
                onChange={(next) => push(next)}
                onReset={() => push(EMPTY_FILTERS)}
                destinations={DESTINATIONS}
                savedCount={profile ? savedIds.length : undefined}
                showSavedFilter={showSavedFilter}
              />
            </div>
          </aside>
        ) : null}

        <div>
          {discovery.empty ? (
            <NoResultsState
              query={filters.query}
              onClear={filters.query ? () => push({ ...filters, query: '' }) : undefined}
              onReset={active ? () => push(EMPTY_FILTERS) : undefined}
            />
          ) : (
            <>
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {discovery.results.map(({ destination }, index) => (
                  <li key={destination.id}>
                    <DestinationCard
                      destination={destination}
                      priority={index < 3 && page === 1}
                    />
                  </li>
                ))}
              </ul>

              {emptyHint ? (
                <p className="mt-6 text-sm text-charcoal-muted">{emptyHint}</p>
              ) : null}

              {discovery.pageCount > 1 ? (
                <nav
                  aria-label="Pagination"
                  className="mt-10 flex items-center justify-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setPage(discovery.page - 1)}
                    disabled={discovery.page <= 1}
                    className="btn-secondary btn-sm"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    Previous
                  </button>

                  <ul className="flex items-center gap-1">
                    {Array.from({ length: discovery.pageCount }).map((_, i) => {
                      const pageNumber = i + 1;
                      const isCurrent = pageNumber === discovery.page;
                      return (
                        <li key={pageNumber}>
                          <button
                            type="button"
                            onClick={() => setPage(pageNumber)}
                            aria-current={isCurrent ? 'page' : undefined}
                            aria-label={`Page ${pageNumber}`}
                            className={
                              isCurrent
                                ? 'h-9 min-w-9 rounded-lg bg-maroon-700 px-3 text-sm font-semibold text-sand-50'
                                : 'h-9 min-w-9 rounded-lg px-3 text-sm font-medium text-charcoal-soft transition-colors hover:bg-sand-100'
                            }
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setPage(discovery.page + 1)}
                    disabled={discovery.page >= discovery.pageCount}
                    className="btn-secondary btn-sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Filter sheet for small screens */}
      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        description={`${discovery.total} ${discovery.total === 1 ? 'destination' : 'destinations'} match`}
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                push(EMPTY_FILTERS);
                setSheetOpen(false);
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setSheetOpen(false)}
            >
              Show {discovery.total} results
            </button>
          </>
        }
      >
        <FilterPanel
          filters={filters}
          onChange={(next) => push(next)}
          onReset={() => push(EMPTY_FILTERS)}
          destinations={DESTINATIONS}
          savedCount={profile ? savedIds.length : undefined}
          showSavedFilter={showSavedFilter}
        />
      </Modal>
    </div>
  );
}
