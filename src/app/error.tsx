'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw, Search } from 'lucide-react';
import { ErrorState } from '@/components/ui/states';

/**
 * Route-level error boundary.
 *
 * Next.js renders this when a segment throws. It has to be a client component,
 * so the retry handler is `reset()` — the segment is re-rendered from scratch.
 *
 * In development the underlying error is logged rather than swallowed; in
 * production no stack trace reaches the browser.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset(): void;
}) {
  useEffect(() => {
    // Server-side errors are also logged there; this catches client ones.
    console.error('Unhandled error in route segment:', error);
  }, [error]);

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="container-page py-16">
      <ErrorState
        title="This page could not be loaded"
        description={
          error.message
            ? `Something failed while preparing this page. ${error.message}`
            : 'Something failed while preparing this page. This is usually temporary.'
        }
        onRetry={reset}
      />

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-secondary">
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
        <Link href="/destinations" className="btn-secondary">
          <Search className="h-4 w-4" aria-hidden="true" />
          Browse destinations
        </Link>
        <button type="button" onClick={reset} className="btn-ghost">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>

      {isDev && error.digest ? (
        <p className="mt-8 text-center font-mono text-xs text-charcoal-muted">
          Digest: {error.digest}
        </p>
      ) : null}

      {!isDev ? (
        <p className="mt-8 flex items-start justify-center gap-2 text-center text-xs text-charcoal-muted">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          If this keeps happening, the record or service it depends on may be temporarily
          unavailable. Your saved places and trips are unaffected.
        </p>
      ) : null}
    </div>
  );
}
