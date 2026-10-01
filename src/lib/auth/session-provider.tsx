'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getAuthClient } from '@/lib/auth/client';
import type { AuthResult, ProfilePatch, SignInInput, SignUpInput } from '@/lib/auth/types';
import type { Profile } from '@/lib/types';

interface AuthContextValue {
  profile: Profile | null;
  /** True until the initial session check has completed. */
  loading: boolean;
  mode: 'supabase' | 'demo';
  signUp(input: SignUpInput): Promise<AuthResult>;
  signIn(input: SignInInput): Promise<AuthResult>;
  signInWithGoogle(redirectTo: string): Promise<AuthResult>;
  signOut(): Promise<AuthResult>;
  requestPasswordReset(email: string, redirectTo: string): Promise<AuthResult>;
  updatePassword(password: string): Promise<AuthResult>;
  resendVerificationEmail(email: string): Promise<AuthResult>;
  updateProfile(patch: ProfilePatch): Promise<AuthResult>;
  refresh(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => getAuthClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Guards against a state update after unmount during the async first read.
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    const next = await client.getSession();
    if (!mounted.current) return;
    setProfile(next);
    setLoading(false);
  }, [client]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = client.onAuthStateChange((next) => {
      if (!mounted.current) return;
      setProfile(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [client]);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      loading,
      mode: client.mode,
      refresh,
      async signUp(input) {
        const result = await client.signUp(input);
        if (result.ok) await refresh();
        return result;
      },
      async signIn(input) {
        const result = await client.signIn(input);
        if (result.ok) await refresh();
        return result;
      },
      signInWithGoogle: (redirectTo) => client.signInWithGoogle(redirectTo),
      requestPasswordReset: (email, redirectTo) => client.requestPasswordReset(email, redirectTo),
      updatePassword: (password) => client.updatePassword(password),
      resendVerificationEmail: (email) => client.resendVerificationEmail(email),
      async signOut() {
        const result = await client.signOut();
        if (result.ok) await refresh();
        return result;
      },
      async updateProfile(patch) {
        const result = await client.updateProfile(patch);
        if (result.ok) await refresh();
        return result;
      },
    }),
    [client, loading, profile, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}

/** Convenience: the signed-in profile, or null. */
export function useProfile(): Profile | null {
  return useAuth().profile;
}
