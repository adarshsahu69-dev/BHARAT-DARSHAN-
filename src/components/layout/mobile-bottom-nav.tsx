'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Map, Luggage, User } from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { cn } from '@/lib/utils';

/**
 * Mobile bottom navigation.
 *
 * Hidden from desktop and from the accessibility tree there, since the primary
 * navbar already covers those links. `env(safe-area-inset-bottom)` keeps the bar
 * clear of the iOS home indicator.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();

  // The map page fills the viewport; a fixed bottom bar would sit over the map.
  if (pathname === '/map') return null;

  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/map', label: 'Map', icon: Map },
    { href: '/trip-planner', label: 'Trips', icon: Luggage },
    {
      href: profile ? '/dashboard' : '/login',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-ivory/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-[4.25rem] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                  active ? 'text-maroon-800' : 'text-charcoal-muted hover:text-charcoal',
                )}
              >
                <span className="relative flex h-7 w-12 items-center justify-center">
                  {active ? (
                    <span
                      className="absolute inset-0 rounded-full bg-maroon-50"
                      aria-hidden="true"
                    />
                  ) : null}
                  <item.icon
                    className="relative h-5 w-5"
                    strokeWidth={active ? 2.4 : 1.9}
                    aria-hidden="true"
                  />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
