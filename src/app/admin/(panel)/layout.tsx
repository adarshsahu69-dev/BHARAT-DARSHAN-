import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { EmptyState } from '@/components/ui/states';
import { getAdminSession } from '@/lib/auth/next-auth';
import { Role } from '@/lib/db';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  if (!session?.user) {
    redirect('/admin/login');
  }

  if (session.user.role !== Role.ADMIN) {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Administrators only"
          description="This area is restricted to accounts with the administrator role. Sign in with an administrator account to manage destination records, categories, users and reported content."
        />
      </div>
    );
  }

  return <>{children}</>;
}
