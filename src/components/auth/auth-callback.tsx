'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Completes a Supabase OAuth / email-confirmation round trip in the browser.
 *
 * Supabase sends the visitor back here in one of two shapes:
 *
 * - PKCE (the default for `signInWithOAuth` and confirmation links): `?code=…`.
 *   The code is exchanged for a session here, in the browser, and the session
 *   lands in cookies that the rest of the app reads.
 * - Implicit flow: tokens in the URL *fragment*. `detectSessionInUrl` on the
 *   browser client handles those on its own; this component only has to carry
 *   the fragment across the redirect so it is not lost.
 *
 * `?next=` is validated before it is used. An unvalidated redirect parameter on
 * a callback route is a textbook open redirect, and this one is reached from an
 * emailed link, so it is exactly the case that gets abused.
 */
export function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // `window.location`, not `useSearchParams`: this page is statically
    // prerendered, so the query string only exists once hydrated in the browser.
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');

    const target =
      next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/dashboard';

    const fragment = window.location.hash.replace(/^#/, '');
    const onward = fragment ? `${target}#${fragment}` : target;

    const supabase = createClient();

    if (!supabase) {
      // Demo mode has no auth callback, so there is nothing to verify.
      router.replace('/login?error=auth_not_configured');
      return;
    }

    const code = params.get('code');

    if (!code) {
      // No PKCE code: either an implicit-flow link, which the browser client has
      // already consumed, or a link opened by hand. Either way the session
      // check happens on the target page.
      router.replace(onward);
      return;
    }

    let cancelled = false;

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error: exchangeError }) => {
        if (cancelled) return;
        if (exchangeError) setError(exchangeError.message);
        else router.replace(onward);
      })
      .catch(() => {
        if (!cancelled) setError('Could not complete sign-in. Please try again.');
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Sign-in could not be completed</h1>
        <p className="max-w-md text-sm text-stone-600">{error}</p>
        <Link href="/login" className="btn-primary">
          Back to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold">Signing you in…</h1>
      <p className="text-sm text-stone-600">One moment while we finish setting up your session.</p>
    </main>
  );
}