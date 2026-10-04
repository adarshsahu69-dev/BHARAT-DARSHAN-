import type { Metadata } from 'next';
import { AuthCallback } from '@/components/auth/auth-callback';

export const metadata: Metadata = {
  title: 'Signing in',
  robots: { index: false, follow: false },
};

/**
 * OAuth and email-confirmation landing route.
 *
 * This is a client component rather than a Route Handler because the site is
 * statically exported to GitHub Pages (`output: 'export'`), where nothing can
 * run on a server. The exchange therefore happens in the visitor's browser,
 * where it works exactly the same: the browser Supabase client writes the
 * session to cookies and `detectSessionInUrl` picks up the implicit-flow
 * fragment. See `@/components/auth/auth-callback`.
 */
export default function AuthCallbackPage() {
  return <AuthCallback />;
}