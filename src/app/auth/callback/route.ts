import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth and email-confirmation landing route.
 *
 * Supabase puts the recovery or auth tokens in the URL *fragment*, which never
 * reaches the server. The code therefore hands control to the browser, where
 * `detectSessionInUrl` picks the tokens up, and then routes onward.
 *
 * The `next` target is validated here: an unvalidated redirect parameter on a
 * callback route is a textbook open redirect.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next');

  const target = next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')
    ? next
    : '/dashboard';

  const supabase = await createClient();

  if (!supabase) {
    // Demo mode has no server-side auth callback, so there is nothing to verify.
    return NextResponse.redirect(new URL('/login?error=auth_not_configured', url.origin));
  }

  // With PKCE, Supabase also returns `?code=`; exchange it here so a
  // server-rendered page can see the session.
  const code = url.searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(target, url.origin));
  }

  const fragment = url.hash.replace(/^#/, '');
  if (fragment) {
    // Preserve the hash so the browser client can complete the exchange.
    return NextResponse.redirect(new URL(`${target}#${fragment}`, url.origin));
  }

  return NextResponse.redirect(new URL(target, url.origin));
}
