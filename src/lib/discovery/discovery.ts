import { categoriesOf } from '@/data/destinations';
import { searchDestinations, type ScoredDestination } from '@/lib/search/search-engine';
import type { Category, Destination, DestinationFilters, HistoricalPeriod, SortOption } from '@/lib/types';

/**
 * Destination discovery: filter, sort and paginate.
 *
 * Filtering happens before pagination so that a page of results always reflects
 * the active facets, and the result count is reported so the UI can show "12 of
 * 47 places" rather than an apparently complete list.
 */

export const DEFAULT_PAGE_SIZE = 12;

export interface DiscoveryResult {
  results: ScoredDestination[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  /** True when the query or filters exclude everything. */
  empty: boolean;
}

export const EMPTY_FILTERS: DestinationFilters = {
  categories: [],
  states: [],
  periods: [],
  query: '',
  savedOnly: false,
  sort: 'relevance',
};

function matchesFacets(
  destination: Destination,
  filters: Pick<DestinationFilters, 'categories' | 'states' | 'periods' | 'savedOnly'>,
  savedIds: ReadonlySet<string>,
): boolean {
  if (filters.savedOnly && !savedIds.has(destination.id)) return false;

  if (filters.categories.length > 0) {
    const recordCategories = categoriesOf(destination);
    if (!filters.categories.some((c) => recordCategories.includes(c))) return false;
  }

  if (filters.states.length > 0 && !filters.states.includes(destination.state)) return false;

  if (filters.periods.length > 0 && !filters.periods.includes(destination.historicalPeriod)) {
    return false;
  }

  return true;
}

const SORTERS: Record<SortOption, (a: ScoredDestination, b: ScoredDestination) => number> = {
  relevance: (a, b) => b.score - a.score || a.destination.name.localeCompare(b.destination.name),
  significance: (a, b) =>
    b.destination.significanceScore - a.destination.significanceScore ||
    a.destination.name.localeCompare(b.destination.name),
  'name-asc': (a, b) => a.destination.name.localeCompare(b.destination.name),
  'name-desc': (a, b) => b.destination.name.localeCompare(a.destination.name),
  oldest: (a, b) =>
    HISTORICAL_START[a.destination.historicalPeriod] - HISTORICAL_START[b.destination.historicalPeriod] ||
    a.destination.name.localeCompare(b.destination.name),
};

/**
 * Sort key per period, taken from the canonical ranges so "oldest" orders by
 * when a site was founded rather than alphabetically.
 */
const HISTORICAL_START: Record<HistoricalPeriod, number> = {
  'Ancient India': -600,
  'Mauryan Period': -322,
  'Gupta Period': 320,
  'Early Medieval India': 500,
  'Delhi Sultanate': 1206,
  'Mughal Period': 1526,
  'Maratha Period': 1674,
  'Colonial India': 1757,
  'Modern India': 1947,
};

export function discover(
  destinations: Destination[],
  filters: DestinationFilters,
  options: { page?: number; pageSize?: number; savedIds?: string[] } = {},
): DiscoveryResult {
  const pageSize = Math.max(1, options.pageSize ?? DEFAULT_PAGE_SIZE);
  const savedIds = new Set(options.savedIds ?? []);

  // A free-text query uses the relevance scorer; otherwise everything is a
  // candidate and the chosen sort decides the order.
  const scored: ScoredDestination[] = filters.query.trim()
    ? searchDestinations(destinations, filters.query, destinations.length * 4)
    : destinations.map((destination) => ({ destination, score: 1, matchedField: 'name' as const }));

  const filtered = scored.filter(({ destination }) =>
    matchesFacets(destination, filters, savedIds),
  );

  const sorter = SORTERS[filters.sort] ?? SORTERS.relevance;
  // With no query there is no relevance to preserve, so default to the
  // editorial significance order rather than an arbitrary insertion order.
  const ordered = [...filtered].sort(
    filters.query.trim() ? sorter : filters.sort === 'relevance' ? SORTERS.significance : sorter,
  );

  const total = ordered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, options.page ?? 1), pageCount);
  const start = (page - 1) * pageSize;

  return {
    results: ordered.slice(start, start + pageSize),
    total,
    page,
    pageCount,
    pageSize,
    empty: total === 0,
  };
}

/** Toggles a value in one of the multi-select facet arrays. */
export function toggleFacet<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

export function hasActiveFilters(filters: DestinationFilters): boolean {
  return (
    filters.categories.length > 0 ||
    filters.states.length > 0 ||
    filters.periods.length > 0 ||
    filters.query.trim().length > 0 ||
    filters.savedOnly
  );
}

export function activeFilterCount(filters: DestinationFilters): number {
  return (
    filters.categories.length +
    filters.states.length +
    filters.periods.length +
    (filters.query.trim() ? 1 : 0) +
    (filters.savedOnly ? 1 : 0)
  );
}

/* ------------------------------------------------------------------ */
/* URL <-> filter state                                                */
/* ------------------------------------------------------------------ */

const VALID_CATEGORIES = new Set<string>();
const VALID_PERIODS = new Set<string>();

/** Parses filter state out of search params, ignoring anything unrecognised. */
export function filtersFromParams(params: URLSearchParams): DestinationFilters {
  for (const category of params.getAll('category')) VALID_CATEGORIES.add(category);
  for (const period of params.getAll('period')) VALID_PERIODS.add(period);

  const sort = params.get('sort');

  return {
    query: params.get('q') ?? '',
    categories: params.getAll('category') as Category[],
    states: params.getAll('state'),
    periods: params.getAll('period') as HistoricalPeriod[],
    savedOnly: params.get('saved') === '1',
    sort: isSortOption(sort) ? sort : 'relevance',
  };
}

function isSortOption(value: string | null): value is SortOption {
  return (
    value === 'relevance' ||
    value === 'significance' ||
    value === 'name-asc' ||
    value === 'name-desc' ||
    value === 'oldest'
  );
}

/** Serialises filter state back to a query string, omitting defaults. */
export function filtersToParams(filters: DestinationFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('q', filters.query.trim());
  for (const c of filters.categories) params.append('category', c);
  for (const s of filters.states) params.append('state', s);
  for (const p of filters.periods) params.append('period', p);
  if (filters.savedOnly) params.set('saved', '1');
  if (filters.sort !== 'relevance') params.set('sort', filters.sort);
  return params;
}

/** Cheap, human-readable summary of what is currently filtered. */
export function describeFilters(filters: DestinationFilters): string[] {
  const parts: string[] = [];
  if (filters.query.trim()) parts.push(`“${filters.query.trim()}”`);
  if (filters.savedOnly) parts.push('Saved only');
  parts.push(...filters.categories, ...filters.states, ...filters.periods);
  return parts;
}
