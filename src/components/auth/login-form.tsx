'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import { Field } from '@/components/trip/trip-planner';
import { safeNextPath } from '@/lib/auth/redirect';
import { validateSignIn } from '@/lib/auth/types';
import { appConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { GoogleSignInButton } from './google-sign-in-button';
import { DEMO_ADMIN, DEMO_TRAVELLER } from '@/lib/auth/demo-auth';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, mode } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  // `next` is validated before use: an unchecked parameter is an open-redirect.
  const next = safeNextPath(searchParams.get('next'), '/dashboard');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const problems = validateSignIn({ email, password });
    if (problems.length > 0) {
      setErrors(Object.fromEntries(problems.map((p) => [p.field, p.message])));
      return;
    }

    setErrors({});
    setBusy(true);
    const result = await signIn({ email, password });
    setBusy(false);

    if (!result.ok) {
      setFormError(result.error ?? 'Could not sign in.');
      return;
    }

    toast({ variant: 'success', title: 'Welcome back' });
    router.push(next);
    router.refresh();
  };

  const fillDemo = (which: 'admin' | 'traveller') => {
    const account = which === 'admin' ? DEMO_ADMIN : DEMO_TRAVELLER;
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
    setFormError('');
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-display-sm font-semibold text-charcoal">Sign in</h1>
      <p className="mt-2 text-sm text-charcoal-soft">
        Saved places, trips and itineraries are tied to your account.
      </p>

      {formError ? (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-danger-500/30 bg-danger-50 p-3.5"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" aria-hidden="true" />
          <p className="text-sm font-medium text-danger-700">{formError}</p>
        </div>
      ) : null}

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            autoFocus
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={cn('input', errors.email && 'input-error')}
          />
        </Field>

        <Field label="Password" error={errors.password} required>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              className={cn('input pr-11', errors.password && 'input-error')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-charcoal-muted hover:bg-sand-100 hover:text-charcoal"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between gap-3">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-maroon-700 underline underline-offset-2 hover:text-maroon-800"
          >
            Forgot your password?
          </Link>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          )}
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-sand-200" />
        <span className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">or</span>
        <span className="h-px flex-1 bg-sand-200" />
      </div>

      <GoogleSignInButton
        onClick={async () => {
          setBusy(true);
          const result = await signInWithGoogle(`${appConfig.url}/auth/callback`);
          setBusy(false);
          if (!result.ok) {
            setFormError(result.error ?? 'Google sign-in failed.');
          }
        }}
        disabled={busy}
      />

      <p className="mt-6 text-center text-sm text-charcoal-soft">
        New to Bharat Darshan?{' '}
        <Link
          href={`/signup${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`}
          className="font-semibold text-maroon-700 underline underline-offset-2 hover:text-maroon-800"
        >
          Create an account
        </Link>
      </p>

      {mode === 'demo' ? (
        <div className="mt-7 rounded-2xl border border-sand-200 bg-sand-50 p-4">
          <p className="text-sm font-semibold text-charcoal">Demo accounts</p>
          <p className="mt-1 text-xs leading-relaxed text-charcoal-muted">
            Supabase is not configured, so accounts are stored in this browser only. These two
            are pre-seeded so you can look at the traveller dashboard and the admin panel.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary btn-sm" onClick={() => fillDemo('traveller')}>
              Fill traveller account
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={() => fillDemo('admin')}>
              Fill admin account
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
