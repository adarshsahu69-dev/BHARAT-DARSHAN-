import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfig } from '@/lib/config';

/**
 * Server Supabase client bound to the request's cookies.
 *
 * Returns `null` when Supabase is not configured. Never use the service-role key
 * here: middleware and server components must run as the signed-in user so that
 * Row Level Security is actually enforced.
 */
export async function createClient() {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Session refresh is handled by the middleware instead.
        }
      },
    },
  });
}
