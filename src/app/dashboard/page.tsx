import type { Metadata } from 'next';
import { Dashboard } from '@/components/dashboard/dashboard';
import { privateMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = privateMetadata(
  'Dashboard',
  'Your saved places, planned trips and recently viewed destinations.',
);

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return <Dashboard />;
}
