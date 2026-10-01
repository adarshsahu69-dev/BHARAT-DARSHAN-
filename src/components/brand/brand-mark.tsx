import { cn } from '@/lib/utils';

/**
 * Brand mark: a stupa-like silhouette over a rising sun, drawn in SVG so it
 * stays crisp at any size and needs no image request.
 *
 * `title` is omitted deliberately — the mark is always paired with the wordmark
 * or an `aria-label` on the link, so a redundant accessible name would cause a
 * double announcement.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn('shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="bd-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffdd88" />
          <stop offset="100%" stopColor="#ff9933" />
        </linearGradient>
        <linearGradient id="bd-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d99b85" />
          <stop offset="100%" stopColor="#7a2d18" />
        </linearGradient>
      </defs>

      <circle cx="24" cy="20" r="15" fill="url(#bd-sun)" opacity="0.16" />

      {/* Stupa dome and harmika */}
      <path d="M24 8.5c-5.2 0-9.2 3.7-9.9 8.4h19.8c-.7-4.7-4.7-8.4-9.9-8.4Z" fill="url(#bd-dome)" />
      <rect x="20.4" y="16.2" width="7.2" height="3" rx="0.8" fill="#7a2d18" />
      <rect x="16.2" y="19.2" width="15.6" height="2.6" rx="1.1" fill="#5c2113" />
      <rect x="13.4" y="21.8" width="21.2" height="2.8" rx="1.3" fill="#7a2d18" />
      <rect x="11" y="24.6" width="26" height="3" rx="1.4" fill="#5c2113" />

      {/* Mast and chattra */}
      <rect x="23.2" y="4.2" width="1.6" height="4.6" fill="#5c2113" />
      <circle cx="24" cy="3.4" r="1.7" fill="#f99307" />

      {/* Plinth */}
      <path d="M8.5 30.5h31l-2.4 8.4a2 2 0 0 1-1.9 1.5H12.8a2 2 0 0 1-1.9-1.5Z" fill="#963a1e" />
      <path d="M6.4 27.7h35.2v3.2H6.4z" fill="#7a2d18" />
    </svg>
  );
}
