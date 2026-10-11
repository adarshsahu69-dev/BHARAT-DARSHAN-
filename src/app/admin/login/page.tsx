import type { Metadata } from 'next';
import { AdminLoginForm } from './admin-login-form';
import { privateMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = privateMetadata(
  'Admin sign in',
  'Sign in to the Bharat Darshan administrator area.',
);

export default function AdminLoginPage() {
  return (
    <div className="container-page flex min-h-[calc(100dvh-16rem)] items-center justify-center py-14">
      <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
        <h1 className="text-display-sm font-semibold text-charcoal">Administrator sign in</h1>
        <p className="mt-2 text-sm text-charcoal-soft">
          This area is for administrators. Sign in to manage destination records, categories,
          users and reported content.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
