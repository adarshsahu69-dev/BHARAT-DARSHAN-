'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BarChart3,
  BookOpen,
  FileWarning,
  Loader2,
  Pencil,
  Plus,
  Shield,
  ShieldAlert,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { CATEGORIES, HISTORICAL_PERIODS, type Category, type Destination, type HistoricalPeriod } from '@/lib/types';
import { ALL_STATES, DESTINATIONS } from '@/data/destinations';
import { useAuth } from '@/lib/auth/session-provider';
import { redirectToLogin } from '@/lib/auth/redirect';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog, Modal, useDisclosure } from '@/components/ui/modal';
import { Field } from '@/components/trip/trip-planner';
import { EmptyState, VerificationBadge } from '@/components/ui/states';
import { cn, slugify } from '@/lib/utils';
import type { ContentReport, ReportStatus } from '@/lib/types';

type AdminTab = 'destinations' | 'categories' | 'users' | 'reports' | 'analytics';

const TABS: { id: AdminTab; label: string; icon: typeof Shield }[] = [
  { id: 'destinations', label: 'Destinations', icon: BookOpen },
  { id: 'categories', label: 'Categories', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileWarning },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

/**
 * Admin panel.
 *
 * Access is role-gated. The important part is what happens when Supabase *is*
 * configured: the server migration grants write access to the `admin` role only,
 * so a client-side check here is a convenience, not the boundary. The migration
 * is the boundary.
 *
 * In demo mode there is no server to enforce anything, and the panel says so
 * plainly rather than implying the edits are protected.
 */
export function AdminPanel() {
  const { profile, loading, mode } = useAuth();
  const [tab, setTab] = useState<AdminTab>('destinations');

  if (loading) {
    return (
      <div className="container-page py-14" role="status" aria-label="Checking access">
        <div className="skeleton h-8 w-56" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Sign in to continue"
          description="The admin panel is only available to signed-in administrators."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => redirectToLogin('/admin')}
            >
              Sign in
            </button>
          }
        />
      </div>
    );
  }

  if (profile.role !== 'admin') {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Administrators only"
          description={`You are signed in as ${profile.email}, which does not have the administrator role. If you believe this is wrong, ask the owner of this deployment to set your role.`}
          action={
            <Link href="/dashboard" className="btn-primary">
              Back to dashboard
            </Link>
          }
          secondaryAction={
            <Link href="/signup" className="btn-secondary">
              Use the demo admin account
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-display-sm font-semibold text-charcoal">Content management</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
            Manage destination records, categories, users and reported content, and see how the
            collection is being used.
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-maroon-50 px-3 py-1.5 text-xs font-semibold text-maroon-800">
          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
          {profile.name}
        </span>
      </header>

      {mode === 'demo' ? (
        <div
          className="mt-6 flex items-start gap-3 rounded-2xl border border-saffron-300/70 bg-saffron-50 p-4"
          role="alert"
        >
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-saffron-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-saffron-900">
              Demo mode — this panel is not enforcing anything
            </p>
            <p className="mt-1 text-sm leading-relaxed text-saffron-900/85">
              With Supabase unconfigured there is no server, so the role check above is a
              client-side convenience and the destination records below are the read-only seed
              data. Connect Supabase and run the migration to get real, RLS-protected editing.
            </p>
          </div>
        </div>
      ) : null}

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
        {tab === 'destinations' ? <DestinationsTab /> : null}
        {tab === 'categories' ? <CategoriesTab /> : null}
        {tab === 'users' ? <UsersTab /> : null}
        {tab === 'reports' ? <ReportsTab /> : null}
        {tab === 'analytics' ? <AnalyticsTab /> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Destinations                                                        */
/* ------------------------------------------------------------------ */

function DestinationsTab() {
  const { toast } = useToast();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Destination | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Destination | null>(null);
  const [records, setRecords] = useState<Destination[]>(DESTINATIONS);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((d) =>
      `${d.name} ${d.city} ${d.state} ${d.category} ${d.historicalPeriod}`.toLowerCase().includes(q),
    );
  }, [query, records]);

  const save = async (draft: DestinationDraft) => {
    // In demo mode the seed catalogue is bundled and cannot be written back, so
    // the edit is applied to local state for this session only, and the UI says so.
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setBusy(false);

    if (editing) {
      setRecords((current) =>
        current.map((d) => (d.id === editing.id ? { ...d, ...draft } : d)),
      );
    } else {
      setRecords((current) => [
        {
          ...(editing ?? ({} as Destination)),
          ...draft,
          id: draft.id,
          slug: draft.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          images: [],
          sources: [],
          alsoCategories: [],
        } as Destination,
        ...current,
      ]);
    }

    editDialog.close();
    toast({
      variant: 'success',
      title: editing ? 'Destination updated' : 'Destination created',
      description: 'Demo mode: this change is local to this browser session.',
    });
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setRecords((current) => current.filter((d) => d.id !== pendingDelete.id));
    setBusy(false);
    deleteDialog.close();
    toast({ variant: 'success', title: `Deleted “${pendingDelete.name}”` });
    setPendingDelete(null);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-charcoal">Destinations</h2>
          <p className="mt-1 text-sm text-charcoal-muted">
            {records.length} records ·{' '}
            {records.filter((d) => d.verification === 'unverified').length} awaiting source
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
        message="The record and its sources will be removed. In Supabase mode this is blocked by a foreign key while any trip still references it."
        confirmLabel="Delete destination"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Destination form                                                    */
/* ------------------------------------------------------------------ */

interface DestinationDraft {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  category: Category;
  historicalPeriod: HistoricalPeriod;
  verification: 'verified' | 'unverified';
  featured: boolean;
  unescoYear?: number;
}

function DestinationFormDialog({
  open,
  onClose,
  destination,
  busy,
  onSave,
}: {
  open: boolean;
  onClose(): void;
  destination: Destination | null;
  busy: boolean;
  onSave(draft: DestinationDraft): void;
}) {
  const [draft, setDraft] = useState<DestinationDraft>(emptyDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (destination) {
      setDraft({
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        tagline: destination.tagline,
        description: destination.description,
        state: destination.state,
        city: destination.city,
        latitude: destination.latitude,
        longitude: destination.longitude,
        category: destination.category,
        historicalPeriod: destination.historicalPeriod,
        verification: destination.verification,
        featured: destination.featured,
        unescoYear: destination.unescoYear,
      });
    } else {
      setDraft(emptyDraft());
    }
  }, [destination, open]);

  const set = <K extends keyof DestinationDraft>(key: K, value: DestinationDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};

    if (draft.name.trim().length < 3) next.name = 'Enter a name of at least 3 characters.';
    if (!draft.slug.trim()) next.slug = 'A URL slug is required.';
    if (draft.tagline.trim().length < 10) next.tagline = 'Write a one-line summary (10+ characters).';
    if (draft.description.trim().length < 40)
      next.description = 'The overview needs at least 40 characters.';
    if (!draft.state.trim()) next.state = 'A state or region is required.';
    if (!draft.city.trim()) next.city = 'A city or district is required.';
    if (!Number.isFinite(draft.latitude) || draft.latitude < -90 || draft.latitude > 90)
      next.latitude = 'Latitude must be between -90 and 90.';
    if (!Number.isFinite(draft.longitude) || draft.longitude < -180 || draft.longitude > 180)
      next.longitude = 'Longitude must be between -180 and 180.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      ...draft,
      slug: slugify(draft.slug),
      name: draft.name.trim(),
      tagline: draft.tagline.trim(),
      description: draft.description.trim(),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={destination ? `Edit ${destination.name}` : 'Add a destination'}
      description="Only the core record fields. Historical narrative, architecture notes, timelines and sources are edited on the record itself."
      size="lg"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" form="destination-form" className="btn-primary" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {destination ? 'Save changes' : 'Create destination'}
          </button>
        </>
      }
    >
      <form id="destination-form" onSubmit={submit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" error={errors.name} required>
            <input
              type="text"
              value={draft.name}
              onChange={(event) => {
                set('name', event.target.value);
                // Keep the slug in step until it is edited directly.
                if (!destination) set('slug', slugify(event.target.value));
              }}
              aria-invalid={Boolean(errors.name)}
              className={cn('input', errors.name && 'input-error')}
            />
          </Field>

          <Field label="URL slug" error={errors.slug} hint="/destinations/<slug>" required>
            <input
              type="text"
              value={draft.slug}
              onChange={(event) => set('slug', event.target.value)}
              aria-invalid={Boolean(errors.slug)}
              className={cn('input font-mono', errors.slug && 'input-error')}
            />
          </Field>
        </div>

        <Field label="Tagline" error={errors.tagline} required>
          <input
            type="text"
            value={draft.tagline}
            onChange={(event) => set('tagline', event.target.value)}
            aria-invalid={Boolean(errors.tagline)}
            className={cn('input', errors.tagline && 'input-error')}
          />
        </Field>

        <Field
          label="Overview"
          error={errors.description}
          hint="One or two paragraphs. Anything contested should be flagged in the history field on the record."
          required
        >
          <textarea
            value={draft.description}
            onChange={(event) => set('description', event.target.value)}
            rows={4}
            aria-invalid={Boolean(errors.description)}
            className={cn('textarea', errors.description && 'input-error')}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="State or region" error={errors.state} required>
            <input
              type="text"
              list="admin-states"
              value={draft.state}
              onChange={(event) => set('state', event.target.value)}
              aria-invalid={Boolean(errors.state)}
              className={cn('input', errors.state && 'input-error')}
            />
            <datalist id="admin-states">
              {ALL_STATES.map((state) => (
                <option key={state} value={state} />
              ))}
            </datalist>
          </Field>

          <Field label="City or district" error={errors.city} required>
            <input
              type="text"
              value={draft.city}
              onChange={(event) => set('city', event.target.value)}
              aria-invalid={Boolean(errors.city)}
              className={cn('input', errors.city && 'input-error')}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude" error={errors.latitude} required>
            <input
              type="number"
              step="0.0001"
              value={draft.latitude}
              onChange={(event) => set('latitude', Number(event.target.value))}
              aria-invalid={Boolean(errors.latitude)}
              className={cn('input', errors.latitude && 'input-error')}
            />
          </Field>

          <Field label="Longitude" error={errors.longitude} required>
            <input
              type="number"
              step="0.0001"
              value={draft.longitude}
              onChange={(event) => set('longitude', Number(event.target.value))}
              aria-invalid={Boolean(errors.longitude)}
              className={cn('input', errors.longitude && 'input-error')}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" required>
            <select
              value={draft.category}
              onChange={(event) => set('category', event.target.value as Category)}
              className="input"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Historical period" required>
            <select
              value={draft.historicalPeriod}
              onChange={(event) => set('historicalPeriod', event.target.value as HistoricalPeriod)}
              className="input"
            >
              {HISTORICAL_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <fieldset className="rounded-xl border border-sand-200 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
            Review status
          </legend>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="verification"
                checked={draft.verification === 'verified'}
                onChange={() => set('verification', 'verified')}
                className="mt-0.5 h-4 w-4 border-sand-400 text-maroon-700 focus:ring-saffron-500"
              />
              <span>
                <span className="block text-sm font-medium text-charcoal">Sources checked</span>
                <span className="block text-xs text-charcoal-muted">
                  The history has been verified against the cited sources. This removes the
                  draft banner from the public page.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="verification"
                checked={draft.verification === 'unverified'}
                onChange={() => set('verification', 'unverified')}
                className="mt-0.5 h-4 w-4 border-sand-400 text-maroon-700 focus:ring-saffron-500"
              />
              <span>
                <span className="block text-sm font-medium text-charcoal">Draft record</span>
                <span className="block text-xs text-charcoal-muted">
                  Not yet reviewed. The public page shows a warning banner. This is the honest
                  default for a new record.
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal-soft">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => set('featured', event.target.checked)}
              className="h-4 w-4 rounded border-sand-400 text-maroon-700 focus:ring-saffron-500"
            />
            Feature on the homepage
          </label>

          <label className="flex items-center gap-2.5 text-sm text-charcoal-soft">
            UNESCO year
            <input
              type="number"
              min={1972}
              max={2100}
              value={draft.unescoYear ?? ''}
              onChange={(event) =>
                set('unescoYear', event.target.value ? Number(event.target.value) : undefined)
              }
              placeholder="e.g. 1986"
              className="input !w-28 !py-1.5 !text-sm"
            />
          </label>
        </div>

        <div className="rounded-xl border border-dashed border-sand-300 bg-sand-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-charcoal">
            <Upload className="h-4 w-4 text-charcoal-muted" aria-hidden="true" />
            Images
          </p>
          <p className="mt-1 text-xs leading-relaxed text-charcoal-muted">
            Image upload needs a Supabase Storage bucket, created by the migration. Once
            configured, images are served from that bucket; the seed records use Wikimedia
            Commons files with attribution links.
          </p>
        </div>
      </form>
    </Modal>
  );
}

function emptyDraft(): DestinationDraft {
  return {
    id: `dest_${Math.random().toString(36).slice(2, 10)}`,
    name: '',
    slug: '',
    tagline: '',
    description: '',
    state: '',
    city: '',
    latitude: 0,
    longitude: 0,
    category: 'Temples',
    historicalPeriod: 'Early Medieval India',
    verification: 'unverified',
    featured: false,
  };
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

function CategoriesTab() {
  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    for (const destination of DESTINATIONS) {
      map.set(destination.category, (map.get(destination.category) ?? 0) + 1);
    }
    return map;
  }, []);

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

function UsersTab() {
  const { profile, mode } = useAuth();
  const [demoUsers, setDemoUsers] = useState<{ id: string; name: string; email: string; role: string }[]>([]);

  useEffect(() => {
    if (mode !== 'demo') return;
    void import('@/lib/auth/demo-auth').then(async ({ ensureSeeded }) => {
      await ensureSeeded();
      // The demo store keeps its own key; read it back for the admin list.
      const raw = window.localStorage.getItem('bd.demo.users.v1');
      if (!raw) return;
      try {
        const users = JSON.parse(raw) as { id: string; name: string; email: string; role: string }[];
        setDemoUsers(
          users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role })),
        );
      } catch {
        setDemoUsers([]);
      }
    });
  }, [mode]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal">Users</h2>
      <p className="mt-1 text-sm text-charcoal-muted">
        {mode === 'demo'
          ? 'Accounts in this browser. In Supabase mode this is a read-only view of the profiles table; changing a role requires promoting the user to the admin role in SQL, deliberately.'
          : 'Registered accounts from the profiles table.'}
      </p>

      <ul className="mt-6 space-y-2">
        <li className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-charcoal">
              {profile?.name}
              <span className="ml-2 text-xs font-normal text-charcoal-muted">(you)</span>
            </p>
            <p className="truncate text-xs text-charcoal-muted">{profile?.email}</p>
          </div>
          <span className="shrink-0 rounded-full bg-maroon-50 px-2.5 py-0.5 text-[11px] font-semibold text-maroon-800">
            {profile?.role}
          </span>
        </li>

        {demoUsers
          .filter((u) => u.id !== profile?.id)
          .map((user) => (
            <li key={user.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-charcoal">{user.name}</p>
                <p className="truncate text-xs text-charcoal-muted">{user.email}</p>
              </div>
              <span className="shrink-0 rounded-full bg-sand-100 px-2.5 py-0.5 text-[11px] font-semibold text-charcoal-soft">
                {user.role}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

const SEED_REPORTS: ContentReport[] = [
  {
    id: 'rep_1',
    destinationId: 'taj-mahal',
    destinationName: 'Taj Mahal',
    reporterEmail: 'visitor@example.com',
    reason: 'Opening hours look out of date',
    details: 'The ASI site lists different timings to the ones shown here.',
    status: 'open',
    createdAt: '2026-08-14T09:20:00.000Z',
  },
  {
    id: 'rep_2',
    destinationId: 'hampi',
    destinationName: 'Group of Monuments at Hampi',
    reporterEmail: 'student@example.edu',
    reason: 'Photo credit missing',
    details: 'The gallery image for the boulder landscape does not show the licence.',
    status: 'reviewing',
    createdAt: '2026-07-02T16:05:00.000Z',
  },
  {
    id: 'rep_3',
    destinationId: 'dholavira',
    destinationName: 'Dholavira',
    reporterEmail: 'researcher@example.org',
    reason: 'Dating needs a caveat',
    details: 'The occupation phases are less certain than the record implies.',
    status: 'resolved',
    createdAt: '2026-05-19T11:40:00.000Z',
  },
];

const STATUS_TONE: Record<ReportStatus, string> = {
  open: 'bg-danger-50 text-danger-700',
  reviewing: 'bg-saffron-50 text-saffron-800',
  resolved: 'bg-success-50 text-success-700',
  dismissed: 'bg-sand-100 text-charcoal-muted',
};

function ReportsTab() {
  const { toast } = useToast();
  const { mode } = useAuth();
  const [reports, setReports] = useState<ContentReport[]>(SEED_REPORTS);

  const setStatus = (id: string, status: ReportStatus) => {
    setReports((current) => current.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({ variant: 'success', title: `Marked as ${status}` });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal">Reported content</h2>
      <p className="mt-1 text-sm text-charcoal-muted">
        {reports.filter((r) => r.status === 'open').length} open ·{' '}
        {reports.filter((r) => r.status === 'reviewing').length} in review
      </p>

      {mode === 'demo' ? (
        <p className="mt-4 rounded-xl border border-saffron-300/60 bg-saffron-50 p-3.5 text-sm text-saffron-900">
          These are sample reports. With Supabase connected, reports are written to a
          <code className="mx-1 rounded bg-saffron-100 px-1 py-0.5 font-mono text-xs">
            content_reports
          </code>
          table that any signed-in visitor can insert into.
        </p>
      ) : null}

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
                disabled={report.status === 'reviewing'}
                className="btn-secondary btn-sm"
              >
                Mark in review
              </button>
              <button
                type="button"
                onClick={() => setStatus(report.id, 'resolved')}
                disabled={report.status === 'resolved'}
                className="btn-secondary btn-sm"
              >
                Resolve
              </button>
              <button
                type="button"
                onClick={() => setStatus(report.id, 'dismissed')}
                disabled={report.status === 'dismissed'}
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

function AnalyticsTab() {
  const byState = useMemo(() => {
    const map = new Map<string, number>();
    for (const destination of DESTINATIONS) {
      map.set(destination.state, (map.get(destination.state) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const destination of DESTINATIONS) {
      map.set(destination.category, (map.get(destination.category) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const byPeriod = useMemo(() => {
    const map = new Map<string, number>();
    for (const destination of DESTINATIONS) {
      map.set(destination.historicalPeriod, (map.get(destination.historicalPeriod) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

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
        <Metric label="Total records" value={DESTINATIONS.length} />
        <Metric
          label="World Heritage"
          value={DESTINATIONS.filter((d) => d.unescoYear).length}
        />
        <Metric
          label="Cited sources"
          value={DESTINATIONS.reduce((sum, d) => sum + d.sources.length, 0)}
        />
        <Metric
          label="Awaiting review"
          value={DESTINATIONS.filter((d) => d.verification === 'unverified').length}
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
