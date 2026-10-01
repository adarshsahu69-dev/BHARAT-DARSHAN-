'use client';

/**
 * Sign-in redirect helper.
 *
 * Centralised so every "you need an account" path preserves where the user was
 * trying to go, and so the `next` parameter is validated before it is used in a
 * redirect — an unchecked `next` is an open-redirect vector.
 */
export function safeNextPath(next: string | null | undefined, fallback = '/dashboard'): string {
  if (!next) return fallback;
  // Only same-origin, absolute-path destinations are accepted.
  if (!next.startsWith('/') || next.startsWith('//')) return fallback;
  if (next.includes('\\')) return fallback;
  return next;
}

export function redirectToLogin(next?: string): void {
  const target = safeNextPath(next);
  const params = new URLSearchParams({ next: target });
  window.location.assign(`/login?${params.toString()}`);
}
