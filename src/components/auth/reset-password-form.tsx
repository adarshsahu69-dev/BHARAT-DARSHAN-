'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { Field } from '@/components/trip/trip-planner';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/types';

/**
 * Sets a new password from a reset link.
 *
 * Supabase redirects here with the recovery token in the URL hash, which
 * `onAuthStateChange` picks up and exchanges for a session. The form itself only
 * calls `updatePassword`, which fails cleanly if there is no such session.
 */
export function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  // Give Supabase a moment to exchange the recovery token before deciding
  // whether to show the form or the "link expired" notice.
  useEffect(() => {
    const timer = setTimeout(() => setHasSession(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    const result = await updatePassword(password);
    setBusy(false);

    if (!result.ok) {
      setError(result.error ?? 'Could not update the password.');
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push('/login');
      router.refresh();
    }, 2500);
  };

  if (done) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-success-500/30 bg-success-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-charcoal">Password updated</p>
              <p className="mt-1 text-sm text-charcoal-soft" role="status">
                Taking you to sign in…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-display-sm font-semibold text-charcoal">Choose a new password</h1>
      <p className="mt-2 text-sm text-charcoal-soft">
        This link works once. After you set the new password you will be signed out and asked
        to sign in again.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-danger-500/30 bg-danger-50 p-3.5"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" aria-hidden="true" />
          <p className="text-sm font-medium text-danger-700">{error}</p>
        </div>
      ) : null}

      {hasSession === true ? null : (
        <p className="mt-4 text-xs text-charcoal-muted" role="status">
          Checking your reset link…
        </p>
      )}

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <Field
          label="New password"
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
              autoFocus
              className="input pr-11"
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

        <Field label="Confirm new password" required>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            className="input"
          />
        </Field>

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {busy ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal-soft">
        <Link
          href="/login"
          className="font-semibold text-maroon-700 underline underline-offset-2 hover:text-maroon-800"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
