'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, User, X } from 'lucide-react';
import { BrandMark } from '@/components/brand/brand-mark';
import { SearchBar } from '@/components/search/search-bar';
import { ProfileMenu } from '@/components/auth/profile-menu';
import { useAuth } from '@/lib/auth/session-provider';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  /** Longer label shown in the desktop bar. */
  desktopLabel?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: '/explore', label: 'Explore', desktopLabel: 'Explore' },
  { href: '/destinations', label: 'Destinations', desktopLabel: 'Destinations' },
  { href: '/historical-places', label: 'Historical Places', desktopLabel: 'Historical Places' },
  { href: '/map', label: 'Map', desktopLabel: 'Map' },
  { href: '/trip-planner', label: 'Trip Planner', desktopLabel: 'Trip Planner' },
  { href: '/about', label: 'About', desktopLabel: 'About' },
];

export const MOBILE_NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/map', label: 'Map' },
  { href: '/trip-planner', label: 'Trips' },
  { href: '/dashboard', label: 'Profile' },
];

/** True when `href` is the current page or an ancestor of it. */
function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { profile, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // A solid background once the hero is behind us, so nav text stays legible.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route changes must always close the mobile sheet.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // While the sheet is open, the page behind it must not scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-sand-200 bg-ivory/90 shadow-header backdrop-blur-md'
            : 'border-transparent bg-ivory/70 backdrop-blur-sm',
        )}
      >
        <div className="container-page flex h-16 items-center gap-3 lg:h-[4.5rem]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Bharat Darshan — home"
          >
            <BrandMark className="h-9 w-9" />
            <span className="hidden font-display text-lg font-semibold tracking-tight text-maroon-800 sm:block">
              Bharat<span className="text-saffron-600"> Darshan</span>
            </span>
          </Link>

          {/* Desktop primary navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {PRIMARY_NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-maroon-50 text-maroon-800'
                          : 'text-charcoal-soft hover:bg-sand-100 hover:text-charcoal',
                      )}
                    >
                      {item.desktopLabel ?? item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <SearchBar className="hidden md:flex" variant="navbar" />

            <Link
              href="/search"
              className="btn-ghost h-10 w-10 !px-0 md:hidden"
              aria-label="Search"
            >
              <SearchBar className="md:hidden" variant="icon" />
            </Link>

            {loading ? (
              <div className="skeleton h-9 w-9 rounded-full" aria-hidden="true" />
            ) : profile ? (
              <ProfileMenu />
            ) : (
              <Link href="/login" className="btn-primary btn-sm hidden sm:inline-flex">
                <User className="h-4 w-4" aria-hidden="true" />
                Sign in
              </Link>
            )}

            <button
              type="button"
              className="btn-ghost h-10 w-10 !px-0 lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className={cn(
          'fixed inset-x-0 bottom-0 top-16 z-40 lg:hidden',
          menuOpen && 'animate-fade-in',
        )}
      >
        <div
          className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        <nav
          aria-label="Mobile"
          className="absolute inset-x-0 top-0 max-h-full overflow-y-auto border-b border-sand-200 bg-ivory p-5 shadow-card-hover"
        >
          <SearchBar className="mb-5 flex md:hidden" autoFocus onNavigate={() => setMenuOpen(false)} />

          <ul className="space-y-1">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors',
                      active
                        ? 'bg-maroon-50 text-maroon-800'
                        : 'text-charcoal-soft hover:bg-sand-100 hover:text-charcoal',
                    )}
                  >
                    {item.label}
                    {active ? <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 border-t border-sand-200 pt-5">
            {profile ? (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-charcoal">{profile.name}</p>
                  <p className="truncate text-xs text-charcoal-muted">{profile.email}</p>
                </div>
                <Link href="/dashboard" className="btn-primary btn-sm">
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" className="btn-primary">
                  Sign in
                </Link>
                <Link href="/signup" className="btn-secondary">
                  Create an account
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
