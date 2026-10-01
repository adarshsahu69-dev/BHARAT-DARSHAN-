import { authMode, isSupabaseConfigured } from '@/lib/config';
import { cn } from '@/lib/utils';

/**
 * Integration status strip.
 *
 * Shown only when Supabase is not configured. It states plainly which
 * integrations are live and which are in demo mode, so a visitor is never left
 * guessing whether an account they just created will exist tomorrow. Supabase
 * mode renders nothing at all.
 */
export function DemoModeBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div
      className="border-b border-saffron-300/60 bg-saffron-50"
      role="status"
      aria-label="Integration status"
    >
      <div className="container-page flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-xs text-saffron-900">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <span
            className={cn('h-1.5 w-1.5 rounded-full', 'bg-saffron-500')}
            aria-hidden="true"
          />
          Demo mode
        </span>
        <span className="text-saffron-800/90">
          Supabase is not configured, so accounts, saved places and trips are stored in
          this browser only and do not sync between devices. Navigation and directions open
          real Google Maps.
        </span>
        <span className="sr-only">
          Authentication mode: {authMode}. Configure the Supabase environment variables to
          switch to real accounts and a Postgres database.
        </span>
      </div>
    </div>
  );
}
