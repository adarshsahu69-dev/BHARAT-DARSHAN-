import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Stable, URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const CURRENCY_STEPS = [
  { value: 100_000_00, suffix: 'Cr' },
  { value: 10_000_00, suffix: 'L' },
];

/** Formats an integer rupee amount using Indian numbering conventions. */
export function formatINR(amount: number): string {
  for (const step of CURRENCY_STEPS) {
    if (amount >= step.value) {
      const scaled = amount / step.value;
      return `₹${scaled.toFixed(scaled >= 10 ? 0 : 1).replace(/\.0$/, '')}${step.suffix}`;
    }
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN');
}

/** `90` -> `1h 30m`, `45` -> `45m`. */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** Distance in km to a human string. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString('en-IN')} km`;
}

const DATE_FMT = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const DATE_FMT_SHORT = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
});

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return DATE_FMT.format(date);
}

export function formatDateShort(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return DATE_FMT_SHORT.format(date);
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return '—';

  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  if (sameMonth) {
    return `${s.getDate()}–${DATE_FMT.format(e)}`;
  }
  if (sameYear) {
    return `${DATE_FMT_SHORT.format(s)} – ${DATE_FMT.format(e)}`;
  }
  return `${DATE_FMT.format(s)} – ${DATE_FMT.format(e)}`;
}

/** ISO date (yyyy-mm-dd) for `<input type="date">` values. */
export function toISODate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return 0;
  return Math.max(1, Math.round((e - s) / 86_400_000) + 1);
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function isPastDate(isoDate: string | null | undefined): boolean {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

export function relativeTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = date.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000_000],
    ['month', 2_592_000_000],
    ['week', 604_800_000],
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ];

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, ms] of units) {
    if (abs >= ms) {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return 'just now';
}

/** `2024-03-05` -> `12h 30m`; returns '' for malformed input. */
export function parseHHMM(value: string | null | undefined): string {
  if (!value) return '';
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return '';
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return '';
  return `${`${hours}`.padStart(2, '0')}:${`${minutes}`.padStart(2, '0')}`;
}

export function parseISOToHHMM(value: string | null | undefined): string {
  if (!value) return '';
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(value);
  return match ? match[2] : '';
}

/* ------------------------------------------------------------------ */
/* Geo                                                                */
/* ------------------------------------------------------------------ */

const EARTH_RADIUS_KM = 6371;

export interface LatLng {
  latitude: number;
  longitude: number;
}

/** Great-circle distance in km (haversine). */
export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface RouteLeg {
  fromName: string;
  toName: string;
  distanceKm: number;
  /** Estimated drive duration including a road-winding factor. */
  durationMinutes: number;
}

/**
 * Estimates a road route between ordered points.
 *
 * This is a straight-line heuristic — explicitly a demo estimate, not a
 * routed result. When `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is configured the UI
 * links out to Google Maps for the authoritative route.
 */
export function estimateRouteLegs(points: { name: string }[] & LatLng[]): RouteLeg[] {
  const legs: RouteLeg[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i];
    const to = points[i + 1];
    const straight = haversineDistanceKm(from, to);
    // Roads in India deviate meaningfully from the great circle; 1.3x is a
    // deliberately conservative corridor factor for intercity travel.
    const distanceKm = straight * 1.3;
    legs.push({
      fromName: from.name,
      toName: to.name,
      distanceKm: Math.round(distanceKm * 10) / 10,
      durationMinutes: Math.round((distanceKm / 45) * 60),
    });
  }
  return legs;
}

export function sumRoute(legs: RouteLeg[]): { distanceKm: number; durationMinutes: number } {
  return legs.reduce(
    (acc, leg) => ({
      distanceKm: acc.distanceKm + leg.distanceKm,
      durationMinutes: acc.durationMinutes + leg.durationMinutes,
    }),
    { distanceKm: 0, durationMinutes: 0 },
  );
}

/* ------------------------------------------------------------------ */
/* Text search                                                        */
/* ------------------------------------------------------------------ */

/** Normalises text for matching: lowercase, strip diacritics/punctuation. */
export function normalizeText(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Subsequence fuzzy match ("khjrao" -> "khajuraho").
 * Returns a score in [0,1] or 0 when the query is not a subsequence.
 * Higher is better; exact prefix matches score highest.
 */
export function fuzzyScore(query: string, target: string): number {
  const q = normalizeText(query);
  const t = normalizeText(target);
  if (!q) return 0;
  if (!t) return 0;
  if (t === q) return 1;
  if (t.startsWith(q)) return 0.95 - Math.min(0.2, (t.length - q.length) / 200);

  const targetIdx = t.indexOf(q);
  if (targetIdx >= 0) {
    // Contiguous match not at the start, scaled by how far in it occurs.
    return 0.8 - Math.min(0.25, targetIdx / 200);
  }

  // Word-boundary prefix of any token.
  if (t.split(' ').some((word) => word.startsWith(q))) return 0.75;

  // Subsequence walk with a contiguity bonus.
  let ti = 0;
  let gaps = 0;
  let matched = 0;
  for (const char of q) {
    if (char === ' ') continue;
    const found = t.indexOf(char, ti);
    if (found === -1) return 0;
    if (found > ti) gaps += 1;
    ti = found + 1;
    matched += 1;
  }

  if (matched === 0) return 0;
  const gapPenalty = Math.min(0.5, gaps / (q.length * 2));
  return Math.max(0.05, 0.6 * (1 - gapPenalty) * (q.length / Math.max(q.length, t.length) + 0.5));
}

export function highlight(text: string, query: string): { text: string; match: boolean }[] {
  const q = normalizeText(query);
  if (!q) return [{ text, match: false }];

  const tokens = text.split(/(\s+)/);
  return tokens.map((token) => {
    const normalized = normalizeText(token);
    return { text: token, match: normalized === q || normalized.startsWith(q) };
  });
}

/* ------------------------------------------------------------------ */
/* Misc                                                               */
/* ------------------------------------------------------------------ */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function groupBy<T, K extends string | number>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = map.get(k);
    if (bucket) bucket.push(item);
    else map.set(k, [item]);
  }
  return map;
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Deterministic pseudo-random integer in [0, max) from a string seed. */
export function seededIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return max === 0 ? 0 : hash % max;
}

/** Non-cryptographic unique id for client-side records. */
export function createId(prefix = 'id'): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}
