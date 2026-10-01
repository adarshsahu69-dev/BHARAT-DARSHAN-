import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/lib/config';

/**
 * The service role key is read *here* rather than from the shared config module,
 * so that `config.ts` stays safe to import from client components. Combined with
 * `server-only`, this means the name never appears in the client bundle at all.
 */
function readServiceRoleKey(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) return null;
  // The quickstart placeholders are not real credentials.
  if (['your-service-role-key', 'changeme'].includes(key.toLowerCase())) return null;
  return key;
}

/**
 * Service-role Supabase client. **Server modules only.**
 *
 * The `server-only` import makes this an error at build time if any client
 * component ever imports it, rather than a mistake that ships a key to the
 * browser. This is the reason that package exists, and the reason the service
 * key is not read anywhere else.
 *
 * The service role bypasses Row Level Security entirely. Every call made through
 * this client must therefore carry its own authorisation check — there is no
 * policy protecting you here. Prefer the user-scoped client in
 * `lib/supabase/server.ts` unless you genuinely need to bypass RLS.
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const key = readServiceRoleKey();
  if (!supabaseConfig.url || !key) return null;

  return createClient(supabaseConfig.url, key, {
    auth: {
      // Never persist or refresh a session for a service-role client.
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

/** True when a service-role key is configured. Safe to call from the server. */
export function hasServiceRole(): boolean {
  return Boolean(supabaseConfig.url && readServiceRoleKey());
}
