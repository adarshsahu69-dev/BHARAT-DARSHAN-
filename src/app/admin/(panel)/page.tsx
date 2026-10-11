import type { Metadata } from 'next';
import { AdminPanel } from '@/components/admin/admin-panel';
import { toAdminUser, toDestination, toReport } from '@/lib/admin/map';
import { prisma } from '@/lib/db';
import { privateMetadata } from '@/lib/seo/auth-metadata';

export const metadata: Metadata = privateMetadata(
  'Admin',
  'Manage destination records, categories, users and reported content.',
);

// The panel is per-session content: caching it would serve one editor's
// backlog (reports, review queue) to the next.
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [destinationRows, userRows, reportRows] = await Promise.all([
    prisma.destination.findMany({
      orderBy: { createdAt: 'desc' },
      include: { sources: true, images: true },
    }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.contentReport.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <AdminPanel
      destinations={destinationRows.map(toDestination)}
      users={userRows.map(toAdminUser)}
      reports={reportRows.map(toReport)}
    />
  );
}
