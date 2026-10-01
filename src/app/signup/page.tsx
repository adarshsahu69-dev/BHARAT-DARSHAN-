import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignupForm } from '@/components/auth/signup-form';
import { authLayoutMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = authLayoutMetadata(
  'Create an account',
  'Create a Bharat Darshan account to save destinations and plan heritage itineraries across India.',
);

export default function SignupPage() {
  return (
    <div className="container-page flex min-h-[calc(100dvh-16rem)] items-center justify-center py-14">
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
