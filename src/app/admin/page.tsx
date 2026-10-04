import type { Metadata } from 'next';
import { AdminPanel } from '@/components/admin/admin-panel';
import { privateMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = privateMetadata(
  'Admin',
  'Manage destination records, categories, users and reported content.',
);

export default function AdminPage() {
  return <AdminPanel />;
}
