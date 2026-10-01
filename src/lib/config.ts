/**
 * Central runtime configuration.
 *
 * Every third-party integration is resolved here so the rest of the app never
 * touches `process.env` directly. When credentials are missing the app runs in
 * a clearly-labelled demo mode rather than crashing — and the UI surfaces that
 * state rather than pretending the integration works.
 */

const trim = (value: string | undefined): string => {
  const next = value?.trim();
  return next && next.length > 0 ? next : '';
};

const rawSupabaseUrl = trim(process.env.NEXT_PUBLIC_SUPABASE_URL);
const rawSupabaseKey = trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Placeholder values that Supabase's quickstart docs use; treated as unset. */
const PLACEHOLDERS = new Set([
  'your-project-url',
  'your-anon-key',
  'your-project-ref',
  'changeme',
]);

const isReal = (value: string) => value.length > 0 && !PLACEHOLDERS.has(value.toLowerCase());

export const supabaseConfig = {
  url: isReal(rawSupabaseUrl) ? rawSupabaseUrl : null,
  anonKey: isReal(rawSupabaseKey) ? rawSupabaseKey : null,
} as const;

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

/**
 * Auth is "live" when Supabase is configured, otherwise the app falls back to
 * the local demo auth provider (clearly labelled in the UI).
 */
export const authMode: 'supabase' | 'demo' = isSupabaseConfigured ? 'supabase' : 'demo';

/** Default location used for route/distance estimates when origin is unknown. */
export const DEFAULT_TRIP_ORIGIN = {
  label: 'New Delhi Railway Station, New Delhi',
  latitude: 28.6431,
  longitude: 77.2197,
} as const;

export const appConfig = {
  name: 'BHARAT DARSHAN',
  tagline: "Discover India's Stories, One Destination at a Time.",
  description:
    "Explore India's history, culture, heritage and destinations. Plan your journey and discover the stories behind every place.",
  url: (trim(process.env.NEXT_PUBLIC_SITE_URL) || 'https://bharat-darshan.vercel.app').replace(/\/$/, ''),
  locale: 'en_IN',
} as const;

/** Simple, deterministic in-memory rate limiter for auth + write endpoints. */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit = 10, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, retryAfterSeconds: 0 };
}

/** Test seam: clears limiter state. */
export function resetRateLimits(): void {
  rateLimitStore.clear();
}
