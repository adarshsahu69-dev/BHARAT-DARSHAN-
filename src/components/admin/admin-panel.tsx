'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import {
  BarChart3,
  BookOpen,
  FileWarning,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';
import {
  CATEGORIES,
  type Category,
  type ContentReport,
  type Destination,
  type ReportStatus,
} from '@/lib/types';
import { createDestination, deleteDestination, updateDestination } from '@/lib/admin/destinations';
import type { DestinationDraft } from '@/lib/admin/destinations';
import { updateReportStatus } from '@/lib/admin/reports';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog, useDisclosure } from '@/components/ui/modal';
import { EmptyState, VerificationBadge } from '@/components/ui/states';
import { cn, formatDate } from '@/lib/utils';
import { DestinationFormDialog } from './destination-form-dialog';

type AdminTab = 'destinations' | 'categories' | 'users' | 'reports' | 'analytics';

const TABS: { id: AdminTab; label: string; icon: typeof Shield }[] = [
  { id: 'destinations', label: 'Destinations', icon: BookOpen },
  { id: 'categories', label: 'Categories', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileWarning },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AdminPanelProps {
  destinations: Destination[];
  users: AdminUserSummary[];
  reports: ContentReport[];
}

/**
 * Admin panel.
 *
 * Access is role-gated by the layout with a server session, and every write
 * goes through a server action that re-checks the admin role. This component
 * is convenience, not the boundary.
 */
export function AdminPanel({ destinations, users, reports }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>('destinations');

  return (
    <div className="container-page py-10 lg:py-14">
      <SessionProvider>
        <AdminHeader />
      </SessionProvider>

      {/* Tabs */}
      <div className="mt-8 border-b border-sand-200">
        <nav role="tablist" aria-label="Admin sections" className="-mb-px flex gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((item) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                tab === item.id
                  ? 'border-maroon-700 text-maroon-800'
                  : 'border-transparent text-charcoal-muted hover:border-sand-300 hover:text-charcoal',
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div role="tabpanel" className="mt-8">
        {tab === 'destinations' ? <DestinationsTab destinations={destinations} /> : null}
        {tab === 'categories' ? <CategoriesTab destinations={destinations} /> : null}
        {tab === 'users' ? <UsersTab users={users} /> : null}
        {tab === 'reports' ? <ReportsTab reports={reports} /> : null}
        {tab === 'analytics' ? <AnalyticsTab destinations={destinations} /> : null}
      </div>
    </div>
  );
}

function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 text-display-sm font-semibold text-charcoal">Content management</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
          Manage destination records, categories, users and reported content, and see how the
          collection is being used.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex items-center gap-2 rounded-full bg-maroon-50 px-3 py-1.5 text-xs font-semibold text-maroon-800">
          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
          {session?.user?.email ?? 'Admin'}
        </span>
        <button
          type="button"
          className="btn-secondary btn-sm shrink-0"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Destinations                                                        */
/* ------------------------------------------------------------------ */

function DestinationsTab({ destinations }: { destinations: Destination[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Destination | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Destination | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) =>
      `${d.name} ${d.city} ${d.state} ${d.category} ${d.historicalPeriod}`.toLowerCase().includes(q),
    );
  }, [query, destinations]);

  const save = async (draft: DestinationDraft) => {
    setBusy(true);
    try {
      const result = editing
        ? await updateDestination(editing.id, draft)
        : await createDestination(draft);

      if (!result.ok) {
        toast({
          variant: 'error',
          title: editing ? 'Could not update the destination' : 'Could not create the destination',
          description: result.error,
        });
        return;
      }

      editDialog.close();
      toast({
        variant: 'success',
        title: editing ? 'Destination updated' : 'Destination created',
      });
      router.refresh();
    } catch {
      toast({
        variant: 'error',
        title: 'Could not save the record',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      const result = await deleteDestination(pendingDelete.id);

      if (!result.ok) {
        toast({
          variant: 'error',
          title: 'Could not delete the record',
          description: result.error,
        });
        return;
      }

      deleteDialog.close();
      toast({ variant: 'success', title: `Deleted “${pendingDelete.name}”` });
      setPendingDelete(null);
      router.refresh();
    } catch {
      toast({
        variant: 'error',
        title: 'Could not delete the record',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-charcoal">Destinations</h2>
          <p className="mt-1 text-sm text-charcoal-muted">
            {destinations.length} records ·{' '}
            {destinations.filter((d) => d.verification === 'unverified').length} awaiting source
            review
          </p>
        </div>
        <div className="flex gap-2">
          <label htmlFor="admin-dest-search" className="sr-only">
            Search destinations
          </label>
          <input
            id="admin-dest-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search records…"
            className="input !py-2 sm:w-56"
          />
          <button
            type="button"
            className="btn-primary shrink-0"
            onClick={() => {
              setEditing(null);
              editDialog.open();
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No records match"
            description="Try a different name, city, state, category or period."
            action={
              <button type="button" className="btn-primary" onClick={() => setQuery('')}>
                Clear search
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <caption className="sr-only">Destination records, with edit and delete actions</caption>
            <thead className="border-b border-sand-200 bg-sand-50 text-xs uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Destination</th>
                <th scope="col" className="px-4 py-3 font-semibold">Location</th>
                <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                <th scope="col" className="px-4 py-3 font-semibold">Period</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Sources</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {filtered.map((destination) => (
                <tr key={destination.id} className="hover:bg-sand-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded bg-sand-200">
                        {destination.imageUrl ? (
                          <Image
                            src={destination.imageUrl}
                            alt=""
                            fill
                            sizes="48px"
                            loading="lazy"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/destinations/${destination.slug}`}
                          className="block truncate font-semibold text-charcoal hover:text-maroon-800"
                        >
                          {destination.name}
                        </Link>
                        <span className="block truncate text-xs text-charcoal-muted">
                          /{destination.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal-soft">
                    {destination.city}, {destination.state}
                  </td>
                  <td className="px-4 py-3 text-charcoal-soft">{destination.category}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{destination.historicalPeriod}</td>
                  <td className="px-4 py-3">
                    <VerificationBadge verification={destination.verification} />
                  </td>
                  <td className="px-4 py-3 tabular-nums text-charcoal-soft">
                    {destination.sources.length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(destination);
                          editDialog.open();
                        }}
                        aria-label={`Edit ${destination.name}`}
                        className="rounded-lg p-2 text-charcoal-muted transition-colors hover:bg-sand-100 hover:text-charcoal"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPendingDelete(destination);
                          deleteDialog.open();
                        }}
                        aria-label={`Delete ${destination.name}`}
                        className="rounded-lg p-2 text-charcoal-muted transition-colors hover:bg-danger-50 hover:text-danger-700"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DestinationFormDialog
        open={editDialog.isOpen}
        onClose={editDialog.close}
        destination={editing}
        busy={busy}
        onSave={save}
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={remove}
        busy={busy}
        title={`Delete “${pendingDelete?.name ?? ''}”?`}
        message="The record, its sources and its images will be removed permanently. This cannot be undone."
        confirmLabel="Delete destination"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

function CategoriesTab({ destinations }: { destinations: Destination[] }) {
  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    for (const destination of destinations) {
      map.set(destination.category, (map.get(destination.category) ?? 0) + 1);
    }
    return map;
  }, [destinations]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal">Categories</h2>
      <p className="mt-1 text-sm text-charcoal-muted">
        The discovery taxonomy. A category with no records still appears in the browse grid,
        marked as having no records yet, rather than being hidden.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const count = counts.get(category) ?? 0;
          return (
            <li key={category} className="card flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-charcoal">{category}</p>
                <p className="mt-0.5 text-xs text-charcoal-muted">
                  {count} {count === 1 ? 'record' : 'records'}
                </p>
              </div>
              <Link
                href={`/destinations?category=${encodeURIComponent(category)}`}
                className="btn-secondary btn-sm shrink-0"
              >
                View
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

function UsersTab({ users }: { users: AdminUserSummary[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal">Users</h2>
      <p className="mt-1 text-sm text-charcoal-muted">
        Registered accounts. Changing a role means promoting the account in the database,
        deliberately — there is no button for it here.
      </p>

      {users.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No accounts yet"
            description="Accounts appear here as soon as someone registers."
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Registered accounts</caption>
            <thead className="border-b border-sand-200 bg-sand-50 text-xs uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                <th scope="col" className="px-4 py-3 font-semibold">Role</th>
                <th scope="col" className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-sand-50">
                  <td className="px-4 py-3 font-semibold text-charcoal">{user.name || '—'}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                        user.role === 'admin'
                          ? 'bg-maroon-50 text-maroon-800'
                          : 'bg-sand-100 text-charcoal-soft',
                      )}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-soft">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<ReportStatus, string> = {
  open: 'bg-danger-50 text-danger-700',
  reviewing: 'bg-saffron-50 text-saffron-800',
  resolved: 'bg-success-50 text-success-700',
  dismissed: 'bg-sand-100 text-charcoal-muted',
};

function ReportsTab({ reports }: { reports: ContentReport[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const setStatus = async (id: string, status: ReportStatus) => {
    setBusyId(id);
    try {
      const result = await updateReportStatus(id, status);

      if (!result.ok) {
        toast({ variant: 'error', title: 'Could not update the report', description: result.error });
        return;
      }

      toast({ variant: 'success', title: `Marked as ${status}` });
      router.refresh();
    } catch {
      toast({
        variant: 'error',
        title: 'Could not update the report',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal">Reported content</h2>
      <p className="mt-1 text-sm text-charcoal-muted">
        {reports.filter((r) => r.status === 'open').length} open ·{' '}
        {reports.filter((r) => r.status === 'reviewing').length} in review
      </p>

      {reports.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No reports"
            description="Nothing has been reported. Visitor reports about a record land here."
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {reports.map((report) => (
            <li key={report.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-charcoal">{report.reason}</p>
                  <p className="mt-0.5 text-xs text-charcoal-muted">
                    {report.destinationName} · reported by {report.reporterEmail}
                  </p>
                  {report.details ? (
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                      {report.details}
                    </p>
                  ) : null}
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize',
                    STATUS_TONE[report.status],
                  )}
                >
                  {report.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-sand-200 pt-3">
                <button
                  type="button"
                  onClick={() => setStatus(report.id, 'reviewing')}
                  disabled={report.status === 'reviewing' || busyId === report.id}
                  className="btn-secondary btn-sm"
                >
                  Mark in review
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(report.id, 'resolved')}
                  disabled={report.status === 'resolved' || busyId === report.id}
                  className="btn-secondary btn-sm"
                >
                  Resolve
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(report.id, 'dismissed')}
                  disabled={report.status === 'dismissed' || busyId === report.id}
                  className="btn-secondary btn-sm"
                >
                  Dismiss
                </button>
                {report.destinationId ? (
                  <Link
                    href={`/destinations/${report.destinationId}`}
                    className="btn-ghost btn-sm ml-auto"
                  >
                    Open record
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

function AnalyticsTab({ destinations }: { destinations: Destination[] }) {
  const byState = useMemo(() => {
    const map = new Map<string, number>();
    for (const destination of destinations) {
      map.set(destination.state, (map.get(destination.state) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [destinations]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const destination of destinations) {
      map.set(destination.category, (map.get(destination.category) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [destinations]);

  const byPeriod = useMemo(() => {
    const map = new Map<string, number>();
    for (const destination of destinations) {
      map.set(destination.historicalPeriod, (map.get(destination.historicalPeriod) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [destinations]);

  const max = Math.max(...byState.map(([, n]) => n), 1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-charcoal">Content coverage</h2>
        <p className="mt-1 text-sm text-charcoal-muted">
          A census of the collection, not usage telemetry. Page views need a real analytics
          service, which is not configured.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total records" value={destinations.length} />
        <Metric
          label="World Heritage"
          value={destinations.filter((d) => d.unescoYear).length}
        />
        <Metric
          label="Cited sources"
          value={destinations.reduce((sum, d) => sum + d.sources.length, 0)}
        />
        <Metric
          label="Awaiting review"
          value={destinations.filter((d) => d.verification === 'unverified').length}
        />
      </div>

      <BarChart title="Records by state" rows={byState} max={max} />
      <BarChart title="Records by category" rows={byCategory} max={Math.max(...byCategory.map(([, n]) => n), 1)} />
      <BarChart title="Records by historical period" rows={byPeriod} max={Math.max(...byPeriod.map(([, n]) => n), 1)} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="font-display text-3xl font-semibold text-charcoal">{value}</p>
      <p className="mt-0.5 text-xs text-charcoal-muted">{label}</p>
    </div>
  );
}

function BarChart({
  title,
  rows,
  max,
}: {
  title: string;
  rows: [string, number][];
  max: number;
}) {
  return (
    <section aria-labelledby={`chart-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <h3
        id={`chart-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-sm font-semibold text-charcoal"
      >
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {rows.map(([label, count]) => (
          <li key={label} className="flex items-center gap-3">
            <span className="w-40 shrink-0 truncate text-xs text-charcoal-soft">{label}</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand-200">
              <span
                className="block h-full rounded-full bg-maroon-600"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right text-xs tabular-nums text-charcoal-muted">
              {count}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
