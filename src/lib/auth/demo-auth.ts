import type { AppUser, Profile } from '@/lib/types';
import {
  INVALID_CREDENTIALS_MESSAGE,
  type AuthClient,
  type AuthResult,
  type ProfilePatch,
  type SignInInput,
  type SignUpInput,
  validateSignIn,
  validateSignUp,
} from './types';
import { createId } from '@/lib/utils';

/**
 * Browser-only authentication for when Supabase is not configured.
 *
 * This is a *demo* provider and is labelled as such throughout the UI. Its
 * properties, stated plainly:
 *
 *  - Accounts and sessions live in `localStorage` on one device. They do not
 *    sync, do not survive clearing site data, and are not shared between
 *    browsers.
 *  - Passwords are never stored in the clear: they are salted and hashed with
 *    SHA-256 via Web Crypto before being written. Web Crypto's SHA-256 is not a
 *    password KDF, so this is obfuscation rather than real protection. It exists
 *    to keep plaintext out of storage, not to resist a determined attacker.
 *  - There is no server, so there is no rate limiting, no email verification and
 *    no real password-reset email. Reset issues a new session directly.
 *  - The `role` field is client-held. It is not a security boundary.
 *
 * A production deployment configures Supabase and never loads this module; see
 * `supabase-auth.ts` for the real implementation.
 */

const USERS_KEY = 'bd.demo.users.v1';
const SESSION_KEY = 'bd.demo.session.v1';
const RESET_KEY = 'bd.demo.reset.v1';

/** A pre-seeded account so the admin panel is reachable without signing up. */
export const DEMO_ADMIN: { email: string; password: string } = {
  email: 'admin@bharatdarshan.demo',
  password: 'admin1234',
};

export const DEMO_TRAVELLER: { email: string; password: string } = {
  email: 'traveller@bharatdarshan.demo',
  password: 'traveller1234',
};

function storageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__bd_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    // Private browsing modes and hardened configurations can block storage.
    return false;
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or policy failure: the operation still succeeds in memory only.
  }
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Salted SHA-256. See the module comment on why this is not a real KDF. */
async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return toHex(bytes.buffer);
}

function toProfile(user: AppUser): Profile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

function readUsers(): AppUser[] {
  return readJson<AppUser[]>(USERS_KEY, []);
}

function writeUsers(users: AppUser[]): void {
  writeJson(USERS_KEY, users);
}

function readSessionId(): string | null {
  return storageAvailable() ? window.localStorage.getItem(SESSION_KEY) : null;
}

function writeSessionId(id: string | null): void {
  if (!storageAvailable()) return;
  if (id) window.localStorage.setItem(SESSION_KEY, id);
  else window.localStorage.removeItem(SESSION_KEY);
}

const EMAIL_VERIFICATION_NOTE =
  'Demo mode cannot send confirmation emails, so this address is treated as verified immediately.';

async function makePasswordHash(password: string): Promise<string> {
  const salt = randomSalt();
  return `${salt}$${await hashPassword(password, salt)}`;
}

/**
 * Creates the two pre-seeded demo accounts on first use so that the admin panel
 * and the traveller dashboard are both reachable out of the box.
 */
export async function ensureSeeded(): Promise<void> {
  const users = readUsers();
  if (users.length > 0) return;

  const now = new Date().toISOString();
  writeUsers([
    {
      id: 'demo_admin',
      name: 'Demo Administrator',
      email: DEMO_ADMIN.email,
      avatarUrl: null,
      role: 'admin',
      emailVerified: true,
      createdAt: now,
      password: await makePasswordHash(DEMO_ADMIN.password),
    },
    {
      id: 'demo_traveller',
      name: 'Demo Traveller',
      email: DEMO_TRAVELLER.email,
      avatarUrl: null,
      role: 'user',
      emailVerified: true,
      createdAt: now,
      password: await makePasswordHash(DEMO_TRAVELLER.password),
    },
  ]);
}

function verify(user: AppUser, password: string): Promise<boolean> {
  const [salt, storedHash] = (user.password ?? '').split('$');
  if (!salt || !storedHash) return Promise.resolve(false);
  return hashPassword(password, salt).then((hash) => hash === storedHash);
}

export function createDemoAuthClient(): AuthClient {
  const emit = () => {
    window.dispatchEvent(new CustomEvent('bd:auth-changed'));
  };

  return {
    mode: 'demo',

    async getSession() {
      await ensureSeeded();
      const id = readSessionId();
      if (!id) return null;
      const user = readUsers().find((u) => u.id === id);
      return user ? toProfile(user) : null;
    },

    onAuthStateChange(callback) {
      const handler = () => {
        void this.getSession().then(callback);
      };
      window.addEventListener('bd:auth-changed', handler);
      // Keep tabs in step when storage is mutated elsewhere.
      window.addEventListener('storage', handler);
      return () => {
        window.removeEventListener('bd:auth-changed', handler);
        window.removeEventListener('storage', handler);
      };
    },

    async signUp(input: SignUpInput): Promise<AuthResult> {
      const problems = validateSignUp(input);
      if (problems.length > 0) {
        return { ok: false, error: problems[0].message };
      }

      await ensureSeeded();
      const email = input.email.trim().toLowerCase();
      const users = readUsers();
      if (users.some((u) => u.email.toLowerCase() === email)) {
        return { ok: false, error: 'An account with this email already exists.' };
      }

      const salt = randomSalt();
      const user: AppUser = {
        id: createId('usr'),
        name: input.name.trim(),
        email,
        avatarUrl: null,
        role: 'user',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        password: `${salt}$${await hashPassword(input.password, salt)}`,
      };

      writeUsers([...users, user]);
      writeSessionId(user.id);
      emit();

      return {
        ok: true,
        message: `Account created. ${EMAIL_VERIFICATION_NOTE} You are signed in on this device.`,
      };
    },

    async signIn(input: SignInInput): Promise<AuthResult> {
      const problems = validateSignIn(input);
      if (problems.length > 0) {
        return { ok: false, error: problems[0].message };
      }

      await ensureSeeded();
      const email = input.email.trim().toLowerCase();
      const users = readUsers();
      const user = users.find((u) => u.email.toLowerCase() === email);

      // Always run a hash comparison so a missing account and a wrong password
      // take comparable time, keeping the demo consistent with the real client.
      const target: AppUser = user ?? {
        id: '',
        name: '',
        email,
        avatarUrl: null,
        role: 'user',
        emailVerified: false,
        createdAt: '',
        password: `${'0'.repeat(32)}${'0'.repeat(64)}`,
      };

      const ok = await verify(target, input.password);
      if (!user || !ok) {
        return { ok: false, error: INVALID_CREDENTIALS_MESSAGE };
      }

      writeSessionId(user.id);
      emit();
      return { ok: true };
    },

    async signInWithGoogle(): Promise<AuthResult> {
      return {
        ok: false,
        error:
          'Google sign-in is not available in demo mode. Connect Supabase to enable it — see the README.',
      };
    },

    async signOut(): Promise<AuthResult> {
      writeSessionId(null);
      writeJson(RESET_KEY, null);
      emit();
      return { ok: true };
    },

    async requestPasswordReset(email: string): Promise<AuthResult> {
      await ensureSeeded();
      const found = readUsers().some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!found) {
        return { ok: true, message: 'If that account exists, a reset link is on its way.' };
      }
      writeJson(RESET_KEY, { email: email.trim().toLowerCase(), issuedAt: new Date().toISOString() });
      return {
        ok: true,
        message:
          'Demo mode cannot send email. A reset token has been staged in this browser — continue to set a new password.',
      };
    },

    async updatePassword(password: string): Promise<AuthResult> {
      const staged = readJson<{ email: string } | null>(RESET_KEY, null);
      if (!staged) {
        return { ok: false, error: 'This reset link is no longer valid. Please request a new one.' };
      }
      if (password.length < 8) {
        return { ok: false, error: 'Password must be at least 8 characters.' };
      }

      const users = readUsers();
      const index = users.findIndex((u) => u.email.toLowerCase() === staged.email.toLowerCase());
      if (index === -1) {
        return { ok: false, error: 'This reset link is no longer valid. Please request a new one.' };
      }

      const salt = randomSalt();
      users[index] = { ...users[index], password: `${salt}$${await hashPassword(password, salt)}` };
      writeUsers(users);
      writeJson(RESET_KEY, null);
      emit();
      return { ok: true, message: 'Password updated. You can now sign in with the new password.' };
    },

    async resendVerificationEmail(): Promise<AuthResult> {
      return {
        ok: true,
        message: 'Demo mode cannot send email. This account is treated as verified immediately.',
      };
    },

    async getProfile() {
      return this.getSession();
    },

    async updateProfile(patch: ProfilePatch): Promise<AuthResult> {
      const id = readSessionId();
      if (!id) return { ok: false, error: 'You are signed out.' };

      const users = readUsers();
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) return { ok: false, error: 'You are signed out.' };

      users[index] = {
        ...users[index],
        ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
        ...(patch.avatarUrl !== undefined ? { avatarUrl: patch.avatarUrl } : {}),
      };
      writeUsers(users);
      emit();
      return { ok: true };
    },
  };
}

/** True when a staged password-reset token is present in this browser. */
export function hasStagedReset(): boolean {
  return readJson<{ email: string } | null>(RESET_KEY, null) !== null;
}

/** Wipes every demo account and session from this browser. */
export function clearDemoData(): void {
  if (!storageAvailable()) return;
  window.localStorage.removeItem(USERS_KEY);
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(RESET_KEY);
}
