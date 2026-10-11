'use client';

import { useEffect, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { CATEGORIES, HISTORICAL_PERIODS, type Category, type Destination, type HistoricalPeriod } from '@/lib/types';
import type { DestinationDraft } from '@/lib/admin/destinations';
import { ALL_STATES } from '@/data/destinations';
import { Modal } from '@/components/ui/modal';
import { Field } from '@/components/trip/trip-planner';
import { cn, slugify } from '@/lib/utils';

/**
 * Create/edit dialog for the core destination record.
 *
 * Validation lives here so an editor gets field-level feedback without a
 * round trip; the server action repeats the same checks, because a client-side
 * check is a convenience and never the boundary.
 */
export function DestinationFormDialog({
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
            The gallery is attached to the record in the database. The current records use
            Wikimedia Commons files with attribution links.
          </p>
        </div>
      </form>
    </Modal>
  );
}

function emptyDraft(): DestinationDraft {
  return {
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
