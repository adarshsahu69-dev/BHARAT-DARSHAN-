import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { authLayoutMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = authLayoutMetadata(
  'Reset your password',
  'Request a password reset link for your Bharat Darshan account.',
);

export default function ForgotPasswordPage() {
  return (
    <div className="container-page flex min-h-[calc(100dvh-16rem)] items-center justify-center py-14">
      <ForgotPasswordForm />
    </div>
  );
}
