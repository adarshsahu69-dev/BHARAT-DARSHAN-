import Link from 'next/link';

/**
 * Link styled as a button.
 *
 * Kept as its own module because the error and not-found boundaries must not
 * import client components — an `error.tsx` is a client component by necessity,
 * and importing anything with state into `not-found.tsx` would pull the client
 * bundle into a server-rendered page.
 */
export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
}: {
  href: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
}) {
  const base = 'btn';
  const styles =
    variant === 'primary'
      ? 'bg-maroon-700 text-sand-50 hover:bg-maroon-800'
      : 'border border-sand-300 bg-white/80 text-charcoal hover:border-sand-400 hover:bg-white';

  return (
    <Link href={href} className={`${base} ${styles} ${className ?? ''}`}>
      {children}
    </Link>
  );
}
