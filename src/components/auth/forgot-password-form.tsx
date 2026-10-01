'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { Field } from '@/components/trip/trip-planner';
import { isValidEmail } from '@/lib/auth/types';
import { appConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

/**
 * Password reset request.
 *
 * The confirmation is deliberately identical whether or not the account exists,
 * so the form cannot be used to discover which addresses are registered.
 */
export function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setBusy(true);
    const result = await requestPasswordReset(email, `${appConfig.url}/reset-password`);
    setBusy(false);

    if (!result.ok) {
      setError(result.error ?? 'Could not send the reset link.');
      return;
    }

    setMessage(result.message ?? 'If that account exists, a reset link is on its way.');
    setSent(true);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-display-sm font-semibold text-charcoal">Reset your password</h1>
      <p className="mt-2 text-sm text-charcoal-soft">
        Enter the email address you signed up with and we will send you a reset link.
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

      {sent ? (
        <div className="mt-6 rounded-2xl border border-sand-200 bg-sand-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-charcoal">Check your inbox</p>
              <p className="mt-1 text-sm leading-relaxed text-charcoal-soft" role="status">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-sand-200 pt-4">
            <Link href="/reset-password" className="btn-secondary w-full">
              I have a reset token — set a new password
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <Field label="Email" error={error} required>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              className={cn('input', error && 'input-error')}
            />
          </Field>

          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Mail className="h-4 w-4" aria-hidden="true" />
            )}
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

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
