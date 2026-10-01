'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import { Field } from '@/components/trip/trip-planner';
import { safeNextPath } from '@/lib/auth/redirect';
import { MIN_PASSWORD_LENGTH, validateSignUp } from '@/lib/auth/types';
import { appConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { GoogleSignInButton } from './google-sign-in-button';

/** A visible strength hint; the server enforces the same rules regardless. */
function passwordChecks(password: string) {
  return [
    { ok: password.length >= MIN_PASSWORD_LENGTH, label: `At least ${MIN_PASSWORD_LENGTH} characters` },
    { ok: /[a-zA-Z]/.test(password), label: 'Contains a letter' },
    { ok: /\d/.test(password), label: 'Contains a number' },
  ];
}

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signInWithGoogle, mode } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const next = safeNextPath(searchParams.get('next'), '/dashboard');
  const checks = passwordChecks(password);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setNotice('');

    const problems = validateSignUp({ name, email, password, confirmPassword });
    if (problems.length > 0) {
      setErrors(Object.fromEntries(problems.map((p) => [p.field, p.message])));
      return;
    }

    setErrors({});
    setBusy(true);
    const result = await signUp({
      name,
      email,
      password,
      emailRedirectTo: `${appConfig.url}/auth/callback`,
    });
    setBusy(false);

    if (!result.ok) {
      setFormError(result.error ?? 'Could not create the account.');
      return;
    }

    toast({ variant: 'success', title: 'Account created' });
    if (result.message) setNotice(result.message);

    // In Supabase mode with email confirmation on, there is no session yet, so
    // the user lands on sign-in rather than a dashboard they cannot load.
    if (mode === 'supabase') {
      router.push('/login?next=' + encodeURIComponent(next));
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-display-sm font-semibold text-charcoal">Create your account</h1>
      <p className="mt-2 text-sm text-charcoal-soft">
        Save destinations, build itineraries and keep your routes in one place.
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

      {notice ? (
        <div
          role="status"
          className="mt-5 rounded-xl border border-info-500/30 bg-info-50 p-3.5"
        >
          <p className="text-sm text-info-700">{notice}</p>
        </div>
      ) : null}

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <Field label="Name" error={errors.name} required>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            autoFocus
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            className={cn('input', errors.name && 'input-error')}
          />
        </Field>

        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={cn('input', errors.email && 'input-error')}
          />
        </Field>

        <Field
          label="Password"
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters, with a letter and a number.`}
          required
        >
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-strength"
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

          {password ? (
            <ul id="password-strength" className="mt-2 space-y-1" aria-label="Password requirements">
              {checks.map((check) => (
                <li
                  key={check.label}
                  className={cn(
                    'flex items-center gap-1.5 text-xs',
                    check.ok ? 'text-success-700' : 'text-charcoal-muted',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      check.ok ? 'bg-success-500' : 'bg-sand-300',
                    )}
                    aria-hidden="true"
                  />
                  {check.label}
                  <span className="sr-only">{check.ok ? '(met)' : '(not met)'}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword} required>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.confirmPassword)}
            className={cn('input', errors.confirmPassword && 'input-error')}
          />
        </Field>

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          )}
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-sand-200" />
        <span className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">or</span>
        <span className="h-px flex-1 bg-sand-200" />
      </div>

      <GoogleSignInButton
        label="Sign up with Google"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const result = await signInWithGoogle(`${appConfig.url}/auth/callback`);
          setBusy(false);
          if (!result.ok) setFormError(result.error ?? 'Google sign-up failed.');
        }}
      />

      <p className="mt-6 text-center text-sm text-charcoal-soft">
        Already have an account?{' '}
        <Link
          href={`/login${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`}
          className="font-semibold text-maroon-700 underline underline-offset-2 hover:text-maroon-800"
        >
          Sign in
        </Link>
      </p>

      {mode === 'demo' ? (
        <p className="mt-6 rounded-xl border border-saffron-300/60 bg-saffron-50 p-3.5 text-xs leading-relaxed text-saffron-900">
          Demo mode: this account is created in your browser and does not sync anywhere. To get
          real accounts, connect Supabase — see the README.
        </p>
      ) : null}
    </div>
  );
}
