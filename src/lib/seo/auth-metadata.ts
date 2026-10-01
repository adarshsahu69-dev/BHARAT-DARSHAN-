import type { Metadata } from 'next';
import { appConfig } from '@/lib/config';

/**
 * Shared metadata for the auth pages.
 *
 * None of these pages are indexed: they are thin wrappers around a form, and
 * indexing them adds nothing to a search result.
 */
export function authLayoutMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: appConfig.url },
  };
}

/**
 * Metadata for per-user pages.
 *
 * These are never indexed and never cached across requests: the content is
 * specific to whoever is signed in.
 */
export function privateMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false, nocache: true },
  };
}
