import type { Profile, UserRole } from '@/lib/types';

/** Result of a mutating auth operation. `error` is a user-safe message. */
export interface AuthResult {
  ok: boolean;
  error?: string;
  /** Non-error information, e.g. "Check your inbox to confirm your address." */
  message?: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  /** Where to send the user after a successful sign-up. */
  emailRedirectTo?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface ProfilePatch {
  name?: string;
  avatarUrl?: string | null;
}

export interface AuthClient {
  readonly mode: 'supabase' | 'demo';

  /** Current session, or null when signed out. */
  getSession(): Promise<Profile | null>;

  /**
   * Subscribes to session changes. Returns an unsubscribe function.
   * Demo mode emits synchronously on the `storage` event, so a sign-in in one
   * tab signs the other tabs in.
   */
  onAuthStateChange(callback: (profile: Profile | null) => void): () => void;

  signUp(input: SignUpInput): Promise<AuthResult>;
  signIn(input: SignInInput): Promise<AuthResult>;
  signInWithGoogle(redirectTo: string): Promise<AuthResult>;
  signOut(): Promise<AuthResult>;

  requestPasswordReset(email: string, redirectTo: string): Promise<AuthResult>;
  /** Completes a reset started by `requestPasswordReset`. */
  updatePassword(password: string): Promise<AuthResult>;
  resendVerificationEmail(email: string): Promise<AuthResult>;

  getProfile(): Promise<Profile | null>;
  updateProfile(patch: ProfilePatch): Promise<AuthResult>;
}

/** Human-readable label for the storage backing the current auth mode. */
export const AUTH_MODE_LABEL: Record<'supabase' | 'demo', string> = {
  supabase: 'Supabase Auth',
  demo: 'Browser-only demo accounts',
};

export function isAdmin(profile: Profile | null | undefined): boolean {
  return profile?.role === ('admin' satisfies UserRole);
}

/* ------------------------------------------------------------------ */
/* Shared validation                                                   */
/* ------------------------------------------------------------------ */

export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export interface CredentialsProblem {
  field: 'name' | 'email' | 'password' | 'confirmPassword' | string;
  message: string;
}

/**
 * Server-shaped validation applied identically on both the client and the API
 * routes, so the two can never disagree about what is acceptable.
 */
export function validateSignUp(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}): CredentialsProblem[] {
  const problems: CredentialsProblem[] = [];

  if (!input.name || input.name.trim().length < 2) {
    problems.push({ field: 'name', message: 'Please enter your name.' });
  }
  if (!isValidEmail(input.email)) {
    problems.push({ field: 'email', message: 'Please enter a valid email address.' });
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    problems.push({
      field: 'password',
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  } else if (!/[a-zA-Z]/.test(input.password) || !/\d/.test(input.password)) {
    problems.push({
      field: 'password',
      message: 'Password must include at least one letter and one number.',
    });
  }
  if (input.confirmPassword !== undefined && input.confirmPassword !== input.password) {
    problems.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
  }

  return problems;
}

export function validateSignIn(input: SignInInput): CredentialsProblem[] {
  const problems: CredentialsProblem[] = [];
  if (!isValidEmail(input.email)) {
    problems.push({ field: 'email', message: 'Please enter a valid email address.' });
  }
  if (!input.password) {
    problems.push({ field: 'password', message: 'Please enter your password.' });
  }
  return problems;
}

/** Neutral, non-enumerating message for failed sign-in. */
export const INVALID_CREDENTIALS_MESSAGE = 'Email or password is incorrect.';
