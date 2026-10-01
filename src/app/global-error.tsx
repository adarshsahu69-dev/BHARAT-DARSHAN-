'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/states';

/**
 * Last-resort boundary for the root layout.
 *
 * If the layout itself throws, this replaces the whole page including the
 * navigation, so it renders standalone HTML. Next.js requires it to be a client
 * component, which is also why it cannot use the site's fonts or the toast
 * provider — both live in the layout that just failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset(): void;
}) {
  useEffect(() => {
    console.error('Unhandled error in the root layout:', error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body style={{ margin: 0 }}>
        <main
          style={{
            display: 'flex',
            minHeight: '100dvh',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fbf7f0',
            padding: '2rem 1.5rem',
            fontFamily: 'system-ui, sans-serif',
            color: '#241d18',
          }}
        >
          <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
            <ErrorState
              title="Bharat Darshan could not start"
              description="The application failed to load. This is usually a temporary problem with the server or the database."
              onRetry={reset}
            />
            <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#6b5d52' }}>
              Error reference: <code>{error.digest ?? 'unavailable'}</code>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
