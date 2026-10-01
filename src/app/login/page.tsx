import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { authLayoutMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = authLayoutMetadata('Sign in', 'Sign in to your Bharat Darshan account to see your saved places, trips and itineraries.');

/** The form reads search params, so it needs a Suspense boundary. */
export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[calc(100dvh-16rem)] items-center justify-center py-14">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
