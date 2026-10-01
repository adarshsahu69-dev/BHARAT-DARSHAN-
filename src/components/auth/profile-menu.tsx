'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, Compass, LayoutDashboard, LogOut, Map, Settings, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function ProfileMenu() {
  const { profile, signOut, mode } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!profile) return null;

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/saved', label: 'Saved places', icon: Bookmark },
    { href: '/dashboard/trips', label: 'My trips', icon: Map },
    { href: '/explore', label: 'Explore', icon: Compass },
    ...(profile.role === 'admin'
      ? [{ href: '/admin', label: 'Admin panel', icon: Shield }]
      : []),
    { href: '/dashboard/profile', label: 'Profile settings', icon: Settings },
  ];

  const onSignOut = async () => {
    const result = await signOut();
    if (result.ok) {
      toast({ variant: 'success', title: 'Signed out' });
      router.push('/');
      router.refresh();
    } else {
      toast({ variant: 'error', title: result.error ?? 'Could not sign out.' });
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-700 text-xs font-semibold text-sand-50 ring-saffron-500 transition-colors hover:bg-maroon-800"
      >
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{initials || 'BD'}</span>
        )}
        <span className="sr-only">
          {open ? 'Close account menu' : `Account menu for ${profile.name}`}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 animate-scale-in overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card-hover"
        >
          <div className="border-b border-sand-200 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon-700 text-sm font-semibold text-sand-50">
                {initials || <UserIcon className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-charcoal">{profile.name}</p>
                <p className="truncate text-xs text-charcoal-muted">{profile.email}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.role === 'admin' ? (
                <span className="rounded-full bg-maroon-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-maroon-800">
                  Administrator
                </span>
              ) : null}
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  profile.emailVerified
                    ? 'bg-success-50 text-success-700'
                    : 'bg-saffron-50 text-saffron-800',
                )}
              >
                {profile.emailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>

          <ul className="p-1.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  role="menuitem"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-charcoal-soft transition-colors hover:bg-sand-100 hover:text-charcoal"
                >
                  <link.icon className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-sand-200 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={onSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-danger-700 transition-colors hover:bg-danger-50"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              Sign out
            </button>
          </div>

          {mode === 'demo' ? (
            <p className="border-t border-sand-200 bg-sand-50 px-4 py-2.5 text-[11px] leading-relaxed text-charcoal-muted">
              Demo account stored in this browser only.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
