import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { authLayoutMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = authLayoutMetadata(
  'Set a new password',
  'Choose a new password for your Bharat Darshan account.',
);

export default function ResetPasswordPage() {
  return (
    <div className="container-page flex min-h-[calc(100dvh-16rem)] items-center justify-center py-14">
      <ResetPasswordForm />
    </div>
  );
}
