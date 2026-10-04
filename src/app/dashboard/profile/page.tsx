import type { Metadata } from 'next';
import { ProfileSettings } from '@/components/dashboard/profile-settings';
import { privateMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = privateMetadata(
  'Profile',
  'Manage your account details and see where your data is stored.',
);

export default function ProfilePage() {
  return <ProfileSettings />;
}
