import { CATEGORIES, HISTORICAL_PERIODS, type Category, type Destination, type HistoricalPeriod } from '@/lib/types';
import { categoriesOf } from '@/data/destinations';
import { HISTORICAL_PERIOD_META, SEARCH_ENTITIES } from '@/data/timeline';
import { fuzzyScore, normalizeText, unique } from '@/lib/utils';
import type { SearchSuggestion } from '@/lib/types';

/**
 * Global search.
 *
 * Destinations are the unit of search: every match resolves to a place the user
 * can open, save, route to or add to a trip. Dynasties, rulers, concepts and
 * cities are indexed as *aliases* onto those destinations, so searching
 * "Mughal" or "Xuanzang" returns places rather than a dead-end entity page.
 *
 * Matching is scored rather than boolean, and the scores are combined across
 * fields with weights, so a name match always outranks a body-text match.
 */

/** Relative importance of each searchable field. */
const FIELD_WEIGHTS = {
  name: 1,
  tags: 0.62,
  city: 0.5,
  state: 0.44,
  category: 0.42,
  period: 0.42,
  tagline: 0.34,
  description: 0.2,
  history: 0.14,
} as const;

type Field = keyof typeof FIELD_WEIGHTS;

const ALL_CATEGORY_LABELS: Category[] = [...CATEGORIES];

interface IndexedDestination {
  destination: Destination;
  /** Pre-normalised fields, so each keystroke does not re-normalise the corpus. */
  fields: Record<Field, string>;
  /** Dynasties, rulers and concepts this destination is indexed under. */
  entities: string[];
}

/**
 * The search corpus.
 *
 * Built once and memoised. The dataset is small enough to hold in memory, and
 * pre-normalising avoids redoing Unicode folding and punctuation stripping on
 * every keystroke of a debounced query.
 */
let index: IndexedDestination[] | null = null;

function entityAliases(): { alias: string; slugs: string[] }[] {
  return SEARCH_ENTITIES.map((entity) => ({
    alias: entity.label,
    slugs: entity.relatedSlugs,
  }));
}

function buildIndex(destinations: Destination[]): IndexedDestination[] {
  const entities = entityAliases();
  const byEntitySlug = new Map<string, string[]>();
  for (const { alias, slugs } of entities) {
    for (const slug of slugs) {
      const list = byEntitySlug.get(slug) ?? [];
      list.push(alias);
      byEntitySlug.set(slug, list);
    }
  }

  return destinations.map((destination) => {
    const entityText = (byEntitySlug.get(destination.slug) ?? []).join(' ');
    return {
      destination,
      entities: byEntitySlug.get(destination.slug) ?? [],
      fields: {
        name: normalizeText(`${destination.name} ${destination.tagline}`),
        tags: normalizeText([...destination.tags, entityText].join(' ')),
        city: normalizeText(`${destination.city} ${destination.state}`),
        state: normalizeText(destination.state),
        category: normalizeText(categoriesOf(destination).join(' ')),
        period: normalizeText(
          [
            destination.historicalPeriod,
            HISTORICAL_PERIOD_META.find((p) => p.id === destination.historicalPeriod)?.range ?? '',
          ].join(' '),
        ),
        tagline: normalizeText(destination.tagline),
        description: normalizeText(destination.description),
        history: normalizeText(destination.historicalDescription),
      },
    };
  });
}

export function primeSearchIndex(destinations: Destination[]): void {
  index = buildIndex(destinations);
}

/** Ensures the index exists, priming it from the supplied list if needed. */
function getIndex(destinations: Destination[]): IndexedDestination[] {
  if (!index || index.length !== destinations.length) {
    index = buildIndex(destinations);
  }
  return index;
}

export interface ScoredDestination {
  destination: Destination;
  score: number;
  /** Field that produced the strongest signal, for result explanations. */
  matchedField: Field;
}

/**
 * Scores one destination against a query.
 *
 * Every token in the query must match something, so adding words narrows
 * results rather than widening them. A destination scoring zero is excluded.
 */
export function scoreDestination(entry: IndexedDestination, rawQuery: string): ScoredDestination | null {
  const query = normalizeText(rawQuery);
  if (!query) return { destination: entry.destination, score: 1, matchedField: 'name' };

  const tokens = query.split(' ').filter(Boolean);
  let total = 0;
  let bestField: Field = 'name';
  let bestScore = 0;

  for (const token of tokens) {
    let tokenBest = 0;
    let tokenField: Field = 'name';

    for (const field of Object.keys(FIELD_WEIGHTS) as Field[]) {
      const score = fuzzyScore(token, entry.fields[field]) * FIELD_WEIGHTS[field];
      if (score > tokenBest) {
        tokenBest = score;
        tokenField = field;
      }
    }

    // A weak match on a low-weight field is noise, not a result.
    if (tokenBest < 0.18) return null;

    if (tokenBest > bestScore) {
      bestScore = tokenBest;
      bestField = tokenField;
    }
    total += tokenBest;
  }

  // Normalise by token count so a longer query is not penalised, then give a
  // small bonus for matching in more than one place.
  const distinctFields = (Object.keys(FIELD_WEIGHTS) as Field[]).filter(
    (field) => fuzzyScore(tokens[0] ?? '', entry.fields[field]) > 0.3,
  ).length;

  const score = total / tokens.length + Math.min(0.12, distinctFields * 0.04);
  return { destination: entry.destination, score, matchedField: bestField };
}

export function searchDestinations(
  destinations: Destination[],
  query: string,
  limit = 24,
): ScoredDestination[] {
  const entries = getIndex(destinations);
  const results: ScoredDestination[] = [];

  for (const entry of entries) {
    const scored = scoreDestination(entry, query);
    if (scored) results.push(scored);
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Suggestions                                                         */
/* ------------------------------------------------------------------ */

const KIND_LABELS: Record<SearchSuggestion['kind'], string> = {
  destination: 'Destination',
  city: 'City',
  state: 'State',
  period: 'Period',
  person: 'Ruler',
  dynasty: 'Dynasty',
  category: 'Category',
};

/**
 * Instant suggestions shown while typing.
 *
 * Deliberately narrower than full search: only strong matches, capped per kind
 * so one prolific category cannot crowd out everything else.
 */
export function suggest(
  destinations: Destination[],
  query: string,
  limit = 8,
): SearchSuggestion[] {
  const normalized = normalizeText(query);
  if (normalized.length < 2) return [];

  const suggestions: { suggestion: SearchSuggestion; score: number }[] = [];

  for (const { destination, score } of searchDestinations(destinations, query, 30)) {
    if (score < 0.35) continue;
    suggestions.push({
      score: score + 0.25,
      suggestion: {
        id: `d_${destination.id}`,
        kind: 'destination',
        label: destination.name,
        sublabel: `${destination.city}, ${destination.state} · ${destination.historicalPeriod}`,
        href: `/destinations/${destination.slug}`,
        destinationId: destination.id,
      },
    });
  }

  for (const category of ALL_CATEGORY_LABELS) {
    const score = fuzzyScore(normalized, category);
    if (score < 0.55) continue;
    suggestions.push({
      score,
      suggestion: {
        id: `c_${category}`,
        kind: 'category',
        label: category,
        sublabel: 'Category',
        href: `/destinations?category=${encodeURIComponent(category)}`,
      },
    });
  }

  for (const period of HISTORICAL_PERIOD_META) {
    const score = Math.max(
      fuzzyScore(normalized, period.id),
      fuzzyScore(normalized, period.figures.join(' ')) * 0.8,
    );
    if (score < 0.55) continue;
    suggestions.push({
      score,
      suggestion: {
        id: `p_${period.id}`,
        kind: 'period',
        label: period.id,
        sublabel: `${period.range} · ${period.figures.slice(0, 2).join(', ')}`,
        href: `/timeline/${slugifyPeriod(period.id)}`,
      },
    });
  }

  for (const entity of SEARCH_ENTITIES) {
    const score = fuzzyScore(normalized, entity.label);
    if (score < 0.5) continue;
    suggestions.push({
      score: score + 0.1,
      suggestion: {
        id: `e_${entity.label}`,
        kind: entity.kind === 'person' ? 'person' : entity.kind === 'dynasty' ? 'dynasty' : 'category',
        label: entity.label,
        sublabel: entity.detail,
        href: entity.href,
      },
    });
  }

  for (const state of unique(destinations.map((d) => d.state))) {
    const score = fuzzyScore(normalized, state);
    if (score < 0.6) continue;
    suggestions.push({
      score,
      suggestion: {
        id: `s_${state}`,
        kind: 'state',
        label: state,
        sublabel: 'State',
        href: `/destinations?state=${encodeURIComponent(state)}`,
      },
    });
  }

  for (const city of unique(destinations.map((d) => d.city))) {
    const score = fuzzyScore(normalized, city);
    if (score < 0.6) continue;
    suggestions.push({
      score,
      suggestion: {
        id: `ct_${city}`,
        kind: 'city',
        label: city,
        sublabel: 'City or district',
        href: `/destinations?q=${encodeURIComponent(city)}`,
      },
    });
  }

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.suggestion);
}

export function kindLabel(kind: SearchSuggestion['kind']): string {
  return KIND_LABELS[kind];
}

export function slugifyPeriod(period: HistoricalPeriod | string): string {
  return period.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Facet counts for the filter panel, computed over the full dataset. */
export function facetCounts(destinations: Destination[]) {
  const byCategory = new Map<Category, number>();
  const byState = new Map<string, number>();
  const byPeriod = new Map<HistoricalPeriod, number>();

  for (const destination of destinations) {
    for (const category of categoriesOf(destination)) {
      byCategory.set(category, (byCategory.get(category) ?? 0) + 1);
    }
    byState.set(destination.state, (byState.get(destination.state) ?? 0) + 1);
    byPeriod.set(
      destination.historicalPeriod,
      (byPeriod.get(destination.historicalPeriod) ?? 0) + 1,
    );
  }

  return {
    categories: ALL_CATEGORY_LABELS.map((name) => ({ name, count: byCategory.get(name) ?? 0 })),
    states: [...byState.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    periods: HISTORICAL_PERIODS.map((id) => ({ name: id, count: byPeriod.get(id) ?? 0 })),
  };
}
