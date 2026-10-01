'use client';

import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, HISTORICAL_PERIODS, type Category, type DestinationFilters, type HistoricalPeriod, type SortOption } from '@/lib/types';
import { facetCounts } from '@/lib/search/search-engine';
import { cn } from '@/lib/utils';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'significance', label: 'Historical significance' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

interface FacetGroup {
  key: 'categories' | 'states' | 'periods';
  title: string;
  options: { name: string; count: number }[];
  selected: string[];
}

/**
 * Filter panel.
 *
 * Rendered inline on wide screens and inside a modal sheet on small ones, so the
 * same component serves both without duplicating the filter logic. Counts are
 * computed over the whole dataset rather than the current page, which is what
 * makes them useful for deciding whether a facet is worth applying.
 */
export function FilterPanel({
  filters,
  onChange,
  onReset,
  destinations,
  savedCount,
  className,
  showSavedFilter = true,
}: {
  filters: DestinationFilters;
  onChange(next: DestinationFilters): void;
  onReset(): void;
  destinations: Parameters<typeof facetCounts>[0];
  savedCount?: number;
  className?: string;
  /** Hidden on the saved-places page, where everything is already saved. */
  showSavedFilter?: boolean;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    categories: true,
    states: false,
    periods: false,
  });

  const counts = useMemo(() => facetCounts(destinations), [destinations]);

  const groups: FacetGroup[] = [
    {
      key: 'categories',
      title: 'Category',
      options: counts.categories,
      selected: filters.categories,
    },
    { key: 'states', title: 'State or region', options: counts.states, selected: filters.states },
    { key: 'periods', title: 'Historical period', options: counts.periods, selected: filters.periods },
  ];

  const toggle = (key: FacetGroup['key'], value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next } as DestinationFilters);
  };

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between gap-3 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
          <SlidersHorizontal className="h-4 w-4 text-maroon-700" aria-hidden="true" />
          Filters
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-maroon-700 underline underline-offset-2 hover:text-maroon-800"
        >
          Reset all
        </button>
      </div>

      {showSavedFilter ? (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-sand-100">
          <input
            type="checkbox"
            checked={filters.savedOnly}
            onChange={(event) => onChange({ ...filters, savedOnly: event.target.checked })}
            className="h-4 w-4 rounded border-sand-400 text-maroon-700 focus:ring-saffron-500"
          />
          <span className="flex-1 font-medium text-charcoal-soft">Saved places only</span>
          {typeof savedCount === 'number' ? (
            <span className="text-xs text-charcoal-muted">({savedCount})</span>
          ) : null}
        </label>
      ) : null}

      {groups.map((group) => {
        const isOpen = expanded[group.key];
        const selectedCount = group.selected.length;

        return (
          <div key={group.key} className="border-t border-sand-200 pt-1">
            <h3>
              <button
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-sand-100"
              >
                <span>
                  {group.title}
                  {selectedCount > 0 ? (
                    <span className="ml-2 rounded-full bg-maroon-700 px-1.5 py-0.5 text-[10px] font-bold text-sand-50">
                      {selectedCount}
                    </span>
                  ) : null}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  className={cn(
                    'h-4 w-4 text-charcoal-muted transition-transform',
                    isOpen ? 'rotate-180' : '',
                  )}
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </h3>

            {isOpen ? (
              <ul className="max-h-72 space-y-0.5 overflow-y-auto pb-2 pr-1">
                {group.options.map((option) => {
                  const checked = group.selected.includes(option.name);
                  // Zero-count options stay visible but disabled, so the
                  // taxonomy is discoverable without offering a dead end.
                  const disabled = option.count === 0 && !checked;
                  return (
                    <li key={option.name}>
                      <label
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors',
                          disabled ? 'cursor-not-allowed opacity-45' : 'hover:bg-sand-100',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggle(group.key, option.name)}
                          className="h-4 w-4 shrink-0 rounded border-sand-400 text-maroon-700 focus:ring-saffron-500"
                        />
                        <span className="min-w-0 flex-1 text-charcoal-soft">{option.name}</span>
                        <span className="shrink-0 text-xs tabular-nums text-charcoal-muted">
                          {option.count}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Chips summarising the active filters, each individually removable. */
export function ActiveFilterChips({
  filters,
  onChange,
  className,
}: {
  filters: DestinationFilters;
  onChange(next: DestinationFilters): void;
  className?: string;
}) {
  const chips: { key: 'categories' | 'states' | 'periods'; value: string; label: string }[] = [
    ...filters.categories.map((value) => ({
      key: 'categories' as const,
      value,
      label: value,
    })),
    ...filters.states.map((value) => ({ key: 'states' as const, value, label: value })),
    ...filters.periods.map((value) => ({ key: 'periods' as const, value, label: value })),
  ];

  if (filters.savedOnly) {
    chips.push({ key: 'states', value: '__saved__', label: 'Saved places only' });
  }

  if (chips.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)} aria-label="Active filters">
      {chips.map((chip) => (
        <li key={`${chip.key}-${chip.value}`}>
          <button
            type="button"
            onClick={() => {
              if (chip.value === '__saved__') {
                onChange({ ...filters, savedOnly: false });
                return;
              }
              const current = filters[chip.key] as string[];
              onChange({
                ...filters,
                [chip.key]: current.filter((v) => v !== chip.value),
              } as DestinationFilters);
            }}
            className="group inline-flex items-center gap-1.5 rounded-full border border-maroon-200 bg-maroon-50 py-1 pl-3 pr-2 text-xs font-medium text-maroon-800 transition-colors hover:border-maroon-300 hover:bg-maroon-100"
          >
            {chip.label}
            <X className="h-3 w-3 opacity-60 group-hover:opacity-100" aria-hidden="true" />
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Sort control. A native select, because it behaves correctly on mobile. */
export function SortSelect({
  value,
  onChange,
  className,
}: {
  value: SortOption;
  onChange(value: SortOption): void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label htmlFor="sort-destinations" className="whitespace-nowrap text-sm text-charcoal-muted">
        Sort by
      </label>
      <select
        id="sort-destinations"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="input !w-auto !py-1.5 !text-sm"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Validates facet values coming from the URL, discarding unknown ones. */
export function sanitiseFilters(input: DestinationFilters): DestinationFilters {
  const categorySet = new Set<string>(CATEGORIES);
  const periodSet = new Set<string>(HISTORICAL_PERIODS);

  return {
    ...input,
    categories: input.categories.filter((c): c is Category => categorySet.has(c)),
    periods: input.periods.filter((p): p is HistoricalPeriod => periodSet.has(p)),
  };
}

/** Re-runs when the query string changes, so filters stay in sync with the URL. */
export function useSyncedFilters(filters: DestinationFilters) {
  const [state, setState] = useState(filters);
  useEffect(() => setState(filters), [filters]);
  return [state, setState] as const;
}
