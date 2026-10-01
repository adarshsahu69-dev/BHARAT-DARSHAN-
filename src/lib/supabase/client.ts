import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from '@/lib/config';

/**
 * Browser Supabase client.
 *
 * Returns `null` when the project is not configured so callers can fall back to
 * the demo store. The anon key is safe to ship to the browser by design — it is
 * protected by Row Level Security — but it is still read from the environment
 * rather than hardcoded, and no service-role key is ever imported here.
 */
export function createClient() {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) return null;
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
