import { createClient as createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import {
  INVALID_CREDENTIALS_MESSAGE,
  validateSignIn,
  validateSignUp,
  type AuthClient,
  type AuthResult,
  type ProfilePatch,
  type SignInInput,
  type SignUpInput,
} from './types';

/**
 * Supabase-backed authentication.
 *
 * Loaded only when the project is configured, so the rest of the app can treat
 * Supabase and demo mode interchangeably through the `AuthClient` interface.
 */

/**
 * Maps Supabase auth errors onto messages that are safe and useful to show a
 * visitor, without leaking whether an account exists.
 */
function mapAuthError(error: { message: string; status?: number } | null): string {
  if (!error) return 'Something went wrong. Please try again.';

  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) return INVALID_CREDENTIALS_MESSAGE;
  if (message.includes('email not confirmed')) {
    return 'This email address is not confirmed yet. Check your inbox for the confirmation link.';
  }
  if (message.includes('user already registered')) {
    return 'An account with this email already exists.';
  }
  if (message.includes('password should be at least')) {
    return 'Password must be at least 8 characters.';
  }
  if (message.includes('rate limit') || error.status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (message.includes('fetch') || message.includes('network')) {
    return 'Could not reach the authentication service. Check your connection and try again.';
  }
  if (message.includes('new password should be different')) {
    return 'The new password must be different from the current one.';
  }

  return 'Something went wrong. Please try again.';
}

const PROFILE_COLUMNS = 'id, name, email, avatar_url, role, email_verified, created_at';

interface ProfileRow {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
  email_verified: boolean | null;
  created_at: string | null;
}

function rowToProfile(row: ProfileRow | null, fallbackId?: string, fallbackEmail?: string): Profile | null {
  if (!row && !fallbackId) return null;

  const id = row?.id ?? fallbackId ?? '';
  if (!id) return null;

  return {
    id,
    name: row?.name?.trim() || (fallbackEmail ? fallbackEmail.split('@')[0] : 'Traveller'),
    email: row?.email ?? fallbackEmail ?? '',
    avatarUrl: row?.avatar_url ?? null,
    role: row?.role === 'admin' ? 'admin' : 'user',
    emailVerified: row?.email_verified ?? false,
    createdAt: row?.created_at ?? new Date().toISOString(),
  };
}

export function createSupabaseAuthClient(): AuthClient {
  /**
   * Reads the public `profiles` row for a user.
   *
   * The `profiles` table is created by the migration with a trigger that mirrors
   * `auth.users`, so a missing row means the trigger has not run yet; the caller
   * falls back to the auth metadata rather than failing.
   */
  async function fetchProfile(userId: string): Promise<Profile | null> {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', userId)
      .maybeSingle();

    if (error) return null;
    return rowToProfile(data as ProfileRow | null, userId);
  }

  return {
    mode: 'supabase',

    async getSession() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return null;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const profile = await fetchProfile(user.id);
      return (
        profile ??
        rowToProfile(null, user.id, user.email ?? undefined)
      );
    },

    onAuthStateChange(callback) {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return () => undefined;

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          callback(null);
          return;
        }
        if (event === 'TOKEN_REFRESHED') {
          // Keep the existing profile; nothing about the user changed.
          return;
        }
        const profile = await fetchProfile(session.user.id);
        callback(profile ?? rowToProfile(null, session.user.id, session.user.email ?? undefined));
      });

      return () => subscription.unsubscribe();
    },

    async signUp(input: SignUpInput): Promise<AuthResult> {
      const problems = validateSignUp(input);
      if (problems.length > 0) return { ok: false, error: problems[0].message };

      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: false, error: 'Authentication is not configured.' };

      const { data, error } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: { name: input.name.trim() },
          emailRedirectTo: input.emailRedirectTo,
        },
      });

      if (error) return { ok: false, error: mapAuthError(error) };

      const user = data.user;
      if (!user) {
        return { ok: true, message: 'Account created. Check your inbox to confirm your email address, then sign in.' };
      }

      // `session` is null when email confirmation is required.
      if (data.session) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: user.id, name: input.name.trim(), email: input.email.trim() });

        if (profileError) {
          // The account exists but the profile row did not insert. Report it
          // rather than pretending sign-up fully succeeded.
          return {
            ok: false,
            error: 'Account created, but your profile could not be set up. Please sign in and try again.',
          };
        }
        return { ok: true, message: 'Account created. You are signed in.' };
      }

      return {
        ok: true,
        message: 'Account created. Check your inbox to confirm your email address, then sign in.',
      };
    },

    async signIn(input: SignInInput): Promise<AuthResult> {
      const problems = validateSignIn(input);
      if (problems.length > 0) return { ok: false, error: problems[0].message };

      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: false, error: 'Authentication is not configured.' };

      const { error } = await supabase.auth.signInWithPassword({
        email: input.email.trim(),
        password: input.password,
      });

      if (error) return { ok: false, error: mapAuthError(error) };
      return { ok: true };
    },

    async signInWithGoogle(redirectTo: string): Promise<AuthResult> {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: false, error: 'Authentication is not configured.' };

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, queryParams: { access_type: 'offline', prompt: 'consent' } },
      });

      if (error) return { ok: false, error: mapAuthError(error) };
      // On success the browser navigates away, so nothing is returned.
      return { ok: true };
    },

    async signOut(): Promise<AuthResult> {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: true };
      const { error } = await supabase.auth.signOut();
      if (error) return { ok: false, error: mapAuthError(error) };
      return { ok: true };
    },

    async requestPasswordReset(email: string, redirectTo: string): Promise<AuthResult> {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: false, error: 'Authentication is not configured.' };

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) return { ok: false, error: mapAuthError(error) };
      return {
        ok: true,
        message: 'If that account exists, a password reset link is on its way to your inbox.',
      };
    },

    async updatePassword(password: string): Promise<AuthResult> {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: false, error: 'Authentication is not configured.' };

      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { ok: false, error: mapAuthError(error) };
      return { ok: true, message: 'Password updated.' };
    },

    async resendVerificationEmail(email: string): Promise<AuthResult> {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: false, error: 'Authentication is not configured.' };

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });

      if (error) return { ok: false, error: mapAuthError(error) };
      return { ok: true, message: 'Confirmation email sent. Please check your inbox.' };
    },

    async getProfile() {
      return this.getSession();
    },

    async updateProfile(patch: ProfilePatch): Promise<AuthResult> {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: false, error: 'Authentication is not configured.' };

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { ok: false, error: 'You are signed out.' };

      const payload: Record<string, unknown> = {};
      if (patch.name !== undefined) payload.name = patch.name.trim();
      if (patch.avatarUrl !== undefined) payload.avatar_url = patch.avatarUrl;

      if (Object.keys(payload).length === 0) return { ok: true };

      // Split the write so that auth metadata and the profile row stay in step:
      // the name lives in both places because it is shown in the nav bar.
      if (patch.name !== undefined) {
        const { error: metaError } = await supabase.auth.updateUser({
          data: { name: patch.name.trim() },
        });
        if (metaError) return { ok: false, error: mapAuthError(metaError) };
      }

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (error) return { ok: false, error: 'Could not save your profile. Please try again.' };
      return { ok: true };
    },
  };
}
