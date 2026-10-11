'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';

export function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setBusy(true);

    const result = await signIn('credentials', { redirect: false, email, password });
    setBusy(false);

    if (result?.error) {
      setFormError('Email or password is incorrect.');
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <form onSubmit={submit} noValidate className="mt-6 space-y-4">
      {formError ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-danger-500/30 bg-danger-50 p-3.5"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" aria-hidden="true" />
          <p className="text-sm font-medium text-danger-700">{formError}</p>
        </div>
      ) : null}

      <div className="fieldset">
        <label className="label" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          autoFocus
          placeholder="you@example.com"
          className="input"
        />
      </div>

      <div className="fieldset">
        <label className="label" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="••••••••"
          className="input"
        />
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
  );
}
