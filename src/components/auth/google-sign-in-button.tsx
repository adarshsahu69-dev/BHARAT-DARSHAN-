'use client';

import { cn } from '@/lib/utils';

/**
 * Google sign-in button.
 *
 * The mark is inlined rather than pulled from a CDN so the button renders even
 * with third-party requests blocked, and so no request to Google is made until
 * the user actually clicks.
 */
export function GoogleSignInButton({
  onClick,
  disabled = false,
  label = 'Continue with Google',
}: {
  onClick(): void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'btn-secondary w-full border-sand-300 bg-white',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.89Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3.02c-1.07.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.11A11.99 11.99 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.11Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.11C6.22 6.87 8.87 4.75 12 4.75Z"
        />
      </svg>
      {label}
    </button>
  );
}
