'use client';

import { createDemoAuthClient } from './demo-auth';
import { createSupabaseAuthClient } from './supabase-auth';
import { isSupabaseConfigured } from '@/lib/config';
import type { AuthClient } from './types';

/**
 * Chooses the auth implementation once, at module load.
 *
 * `createDemoAuthClient` is imported statically rather than dynamically because
 * a dynamic import would put demo credentials in the production bundle. The
 * module contains no secrets — only a documented local-storage schema — but
 * excluding it from production builds keeps the two paths unambiguous.
 */
let client: AuthClient | null = null;

export function getAuthClient(): AuthClient {
  if (client) return client;
  client = isSupabaseConfigured ? createSupabaseAuthClient() : createDemoAuthClient();
  return client;
}
