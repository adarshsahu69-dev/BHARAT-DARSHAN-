'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Check, Loader2, LogOut, Save, Trash2, User } from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { redirectToLogin } from '@/lib/auth/redirect';
import { useToast } from '@/components/ui/toast';
import { Field } from '@/components/trip/trip-planner';
import { EmptyState } from '@/components/ui/states';
import { cn, formatDate, relativeTime } from '@/lib/utils';

export function ProfileSettings() {
  const { profile, loading, updateProfile, signOut, mode, refresh } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setAvatarUrl(profile.avatarUrl ?? '');
  }, [profile]);

  if (!loading && !profile) {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Sign in to manage your profile"
          description="Your name, avatar and account details live here."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => redirectToLogin('/dashboard/profile')}
            >
              Sign in
            </button>
          }
        />
      </div>
    );
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    if (name.trim().length < 2) {
      setErrors({ name: 'Please enter your name.' });
      return;
    }
    if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
      setErrors({ avatarUrl: 'Enter a full http:// or https:// URL.' });
      return;
    }

    setBusy(true);
    const result = await updateProfile({
      name: name.trim(),
      avatarUrl: avatarUrl.trim() || null,
    });
    setBusy(false);

    if (result.ok) {
      toast({ variant: 'success', title: 'Profile updated' });
      return;
    }
    toast({ variant: 'error', title: result.error ?? 'Could not save your profile.' });
  };

  const wipe = async () => {
    setWiping(true);
    if (mode === 'demo') {
      const { clearDemoData } = await import('@/lib/auth/demo-auth');
      clearDemoData();
      const { clearAllUserData } = await import('@/lib/store/user-data');
      clearAllUserData();
      setWiping(false);
      await signOut();
      toast({ variant: 'success', title: 'Demo data cleared from this browser' });
      return;
    }
    // In Supabase mode this is a server-side operation and is not wired up here.
    setWiping(false);
    toast({
      variant: 'info',
      title: 'Account deletion is not available here',
      description: 'Delete your account through Supabase Auth settings.',
    });
  };

  return (
    <div className="container-page py-10 lg:py-14">
      <header>
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-2 text-display-sm font-semibold text-charcoal">Profile</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
          Your account details and where your data is stored.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          {/* Account summary */}
          <section className="card p-5" aria-labelledby="profile-account">
            <h2 id="profile-account" className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <User className="h-4 w-4 text-maroon-700" aria-hidden="true" />
              Account
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-charcoal-muted">Email</dt>
                <dd className="font-medium text-charcoal-soft">{profile?.email}</dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-charcoal-muted">Email verified</dt>
                <dd>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                      profile?.emailVerified
                        ? 'bg-success-50 text-success-700'
                        : 'bg-saffron-50 text-saffron-800',
                    )}
                  >
                    {profile?.emailVerified ? 'Verified' : 'Not verified'}
                  </span>
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-charcoal-muted">Role</dt>
                <dd>
                  <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-[11px] font-semibold text-charcoal-soft">
                    {profile?.role === 'admin' ? 'Administrator' : 'Traveller'}
                  </span>
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-charcoal-muted">Member since</dt>
                <dd className="font-medium text-charcoal-soft">
                  {formatDate(profile?.createdAt)}{' '}
                  <span className="text-xs text-charcoal-muted">
                    ({relativeTime(profile?.createdAt ?? '')})
                  </span>
                </dd>
              </div>
            </dl>

            {profile?.role === 'admin' ? (
              <Link href="/admin" className="btn-secondary btn-sm mt-4">
                Open the admin panel
              </Link>
            ) : null}
          </section>

          {/* Editable details */}
          <section className="card p-5" aria-labelledby="profile-edit">
            <h2 id="profile-edit" className="text-sm font-semibold text-charcoal">
              Edit details
            </h2>

            <form onSubmit={save} noValidate className="mt-4 space-y-4">
              <Field label="Display name" error={errors.name} required>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  className={cn('input', errors.name && 'input-error')}
                />
              </Field>

              <Field
                label="Profile image URL"
                error={errors.avatarUrl}
                hint="Optional. Paste a link to an image. In Supabase mode this can be an upload from Supabase Storage."
              >
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  placeholder="https://…"
                  autoComplete="photo"
                  aria-invalid={Boolean(errors.avatarUrl)}
                  className={cn('input', errors.avatarUrl && 'input-error')}
                />
              </Field>

              {avatarUrl && !errors.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Preview of the profile image"
                  className="h-16 w-16 rounded-full border border-sand-200 object-cover"
                />
              ) : null}

              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="h-4 w-4" aria-hidden="true" />
                )}
                {busy ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </section>

          {/* Storage location, stated honestly */}
          <section className="card p-5" aria-labelledby="profile-data">
            <h2 id="profile-data" className="text-sm font-semibold text-charcoal">
              Where your data is stored
            </h2>
            {mode === 'supabase' ? (
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-charcoal-soft">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" aria-hidden="true" />
                Supabase, with Row Level Security on every table. Your saved places and trips
                are visible only to you, and to administrators of this site.
              </p>
            ) : (
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-charcoal-soft">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-saffron-600" aria-hidden="true" />
                This browser&rsquo;s local storage, because Supabase is not configured. Clearing
                site data, or opening the site in another browser, will lose this account and
                everything saved with it.
              </p>
            )}
          </section>

          {/* Destructive actions */}
          <section className="card border-danger-500/25 p-5" aria-labelledby="profile-danger">
            <h2 id="profile-danger" className="text-sm font-semibold text-charcoal">
              Sign out and data
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={async () => {
                  const result = await signOut();
                  if (result.ok) {
                    toast({ variant: 'success', title: 'Signed out' });
                    await refresh();
                    window.location.assign('/');
                  } else {
                    toast({ variant: 'error', title: result.error ?? 'Could not sign out.' });
                  }
                }}
                className="btn-secondary"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>

              {mode === 'demo' ? (
                <button
                  type="button"
                  onClick={wipe}
                  disabled={wiping}
                  className="btn-danger"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {wiping ? 'Clearing…' : 'Delete all demo data'}
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-charcoal-muted">
              {mode === 'demo'
                ? 'This removes the demo account, saved places, trips and activity from this browser. It cannot be undone.'
                : 'Account deletion is handled by Supabase Auth. Contact an administrator of this deployment to remove an account.'}
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <aside aria-label="Profile summary">
          <div className="card p-5 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-maroon-700 text-xl font-semibold text-sand-50">
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                (profile?.name ?? 'BD')
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? '')
                  .join('')
              )}
            </span>
            <p className="mt-3 text-base font-semibold text-charcoal">{profile?.name}</p>
            <p className="mt-0.5 break-all text-xs text-charcoal-muted">{profile?.email}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
