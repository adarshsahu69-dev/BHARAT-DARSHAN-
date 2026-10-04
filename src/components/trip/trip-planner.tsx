'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  Check,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import { createTrip, deleteTrip, getTripWithStops, getTrips, recordActivity } from '@/lib/store/user-data';
import { redirectToLogin } from '@/lib/auth/redirect';
import { ConfirmDialog, Modal, useDisclosure } from '@/components/ui/modal';
import { EmptyState, ErrorState, TripCardSkeleton } from '@/components/ui/states';
import { addDays, cn, daysBetween, formatDate, formatDateRange, toISODate } from '@/lib/utils';
import type { Trip } from '@/lib/types';
import { itineraryHref } from '@/lib/routes';

/**
 * Trip list and creation.
 *
 * Everything here is behind a sign-in. In demo mode the guard is client-side
 * because the account lives in the browser; in Supabase mode the middleware has
 * already redirected. The UI states which it is rather than implying otherwise.
 */
export function TripPlanner() {
  const router = useRouter();
  const { profile, loading, mode } = useAuth();
  const { toast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [dataState, setDataState] = useState<'loading' | 'ready' | 'error'>('loading');
  const createDialog = useDisclosure();
  const [editing, setEditing] = useState<Trip | null>(null);

  const load = useCallback(async () => {
    if (!profile) return;
    setDataState('loading');
    try {
      const list = await getTrips(profile.id);
      setTrips(list);

      // Stop counts are fetched per trip. The list is short, and a single
      // `in` query would need a join the browser store cannot express.
      const entries = await Promise.all(
        list.map(async (trip) => {
          const full = await getTripWithStops(profile.id, trip.id);
          return [trip.id, full?.stops.length ?? 0] as const;
        }),
      );
      setCounts(Object.fromEntries(entries));
      setDataState('ready');
    } catch {
      setDataState('error');
    }
  }, [profile]);

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      setDataState('ready');
      return;
    }
    void load();
  }, [load, loading, profile]);

  if (!loading && !profile) {
    return (
      <div className="container-page py-14">
        <EmptyState
          title="Sign in to plan a trip"
          description="Your trips, itineraries and saved places are tied to your account. Browsing and the map work without one."
          action={
            <button type="button" className="btn-primary" onClick={() => redirectToLogin('/trip-planner')}>
              Sign in
            </button>
          }
          secondaryAction={
            <Link href="/signup" className="btn-secondary">
              Create an account
            </Link>
          }
        />
      </div>
    );
  }

  if (loading || dataState === 'loading') {
    return (
      <div className="container-page py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading your trips">
          {Array.from({ length: 3 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (dataState === 'error') {
    return (
      <div className="container-page py-14">
        <ErrorState onRetry={() => void load()} />
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Trip planner</p>
          <h1 className="mt-2 text-display-sm font-semibold text-charcoal">Your trips</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
            Build an itinerary from places in the collection, arrange the order, set the day
            and time for each stop, then hand the whole route to Google Maps.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary shrink-0"
          onClick={() => {
            setEditing(null);
            createDialog.open();
          }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New trip
        </button>
      </header>

      {mode === 'demo' ? (
        <p className="mt-5 rounded-xl border border-saffron-300/60 bg-saffron-50 p-3.5 text-sm text-saffron-900">
          Demo mode: this trip list lives in your browser only. It will not follow you to
          another device or browser.
        </p>
      ) : null}

      {trips.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No trips yet"
            description="Create a trip, then add destinations from their pages, from search, or straight from the map."
            action={
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setEditing(null);
                  createDialog.open();
                }}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create your first trip
              </button>
            }
            secondaryAction={
              <Link href="/destinations" className="btn-secondary">
                Browse destinations
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => {
            const stopCount = counts[trip.id] ?? 0;
            const days = daysBetween(trip.startDate, trip.endDate);
            const past = new Date(trip.endDate).getTime() < Date.now();

            return (
              <li key={trip.id} className="card-interactive flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
                      {past ? 'Completed trip' : 'Planned trip'}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold leading-snug text-charcoal">
                      <Link href={itineraryHref(trip.id)} className="hover:text-maroon-800">
                        {trip.name}
                      </Link>
                    </h2>
                  </div>
                  <TripMenu
                    trip={trip}
                    onEdit={() => {
                      setEditing(trip);
                      createDialog.open();
                    }}
                    onChanged={load}
                  />
                </div>

                <dl className="mt-4 space-y-2 text-sm text-charcoal-soft">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
                    <dd>
                      {formatDateRange(trip.startDate, trip.endDate)}
                      <span className="ml-1.5 text-xs text-charcoal-muted">
                        ({days} {days === 1 ? 'day' : 'days'})
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
                    <dd className="truncate">From {trip.startLocation}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
                    <dd>
                      {trip.travelers} {trip.travelers === 1 ? 'traveller' : 'travellers'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-sand-200 pt-4">
                  <span className="text-xs text-charcoal-muted">
                    <span className="font-semibold text-charcoal">{stopCount}</span>{' '}
                    {stopCount === 1 ? 'destination' : 'destinations'}
                  </span>
                  <Link href={itineraryHref(trip.id)} className="btn-secondary btn-sm">
                    View itinerary
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <TripFormDialog
        open={createDialog.isOpen}
        onClose={createDialog.close}
        trip={editing}
        onSaved={(trip) => {
          createDialog.close();
          void load();
          if (!editing) {
            toast({ variant: 'success', title: `Created “${trip.name}”` });
            router.push(itineraryHref(trip.id));
          } else {
            toast({ variant: 'success', title: 'Trip updated' });
          }
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Per-trip menu                                                       */
/* ------------------------------------------------------------------ */

function TripMenu({
  trip,
  onEdit,
  onChanged,
}: {
  trip: Trip;
  onEdit(): void;
  onChanged(): void;
}) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const confirm = useDisclosure();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!profile) return;
    setBusy(true);
    const result = await deleteTrip(profile.id, trip.id);
    setBusy(false);
    confirm.close();

    if (!result.ok) {
      toast({ variant: 'error', title: result.error ?? 'Could not delete the trip.' });
      return;
    }
    toast({ variant: 'success', title: `Deleted “${trip.name}”` });
    onChanged();
  };

  return (
    <>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-charcoal-soft transition-colors hover:bg-sand-100 hover:text-charcoal"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={confirm.open}
          aria-label={`Delete ${trip.name}`}
          className="rounded-lg p-2 text-charcoal-muted transition-colors hover:bg-danger-50 hover:text-danger-700"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <ConfirmDialog
        open={confirm.isOpen}
        onClose={confirm.close}
        onConfirm={remove}
        busy={busy}
        title={`Delete “${trip.name}”?`}
        message="The trip and its itinerary will be removed. This cannot be undone."
        confirmLabel="Delete trip"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Create / edit dialog                                                */
/* ------------------------------------------------------------------ */

function TripFormDialog({
  open,
  onClose,
  trip,
  onSaved,
}: {
  open: boolean;
  onClose(): void;
  trip: Trip | null;
  onSaved(trip: Trip): void;
}) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const today = toISODate(new Date());

  const [name, setName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [destinationSummary, setDestinationSummary] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addDays(today, 3));
  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset the form each time the dialog opens, in create or edit mode.
  useEffect(() => {
    if (!open) return;
    if (trip) {
      setName(trip.name);
      setStartLocation(trip.startLocation);
      setDestinationSummary(trip.destinationSummary ?? '');
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setTravelers(trip.travelers);
      setNotes(trip.notes ?? '');
    } else {
      setName('');
      setStartLocation('');
      setDestinationSummary('');
      setStartDate(today);
      setEndDate(addDays(today, 3));
      setTravelers(1);
      setNotes('');
    }
    setErrors({});
  }, [open, today, trip]);

  // Keep the end date at or after the start date as the user changes it.
  useEffect(() => {
    if (endDate < startDate) setEndDate(startDate);
  }, [endDate, startDate]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Give the trip a name.';
    else if (name.trim().length < 3) next.name = 'Use at least 3 characters.';
    if (!startLocation.trim()) next.startLocation = 'Where are you starting from?';
    if (!startDate) next.startDate = 'Choose a start date.';
    if (!endDate) next.endDate = 'Choose an end date.';
    else if (endDate < startDate) next.endDate = 'The end date cannot be before the start date.';
    if (travelers < 1) next.travelers = 'At least one traveller.';
    else if (travelers > 40) next.travelers = 'Please contact us directly for groups over 40.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile || !validate()) return;

    setBusy(true);
    const payload = {
      name: name.trim(),
      startLocation: startLocation.trim(),
      destinationSummary: destinationSummary.trim() || null,
      startDate,
      endDate,
      travelers,
      notes: notes.trim() || null,
    };

    if (trip) {
      const { updateTrip } = await import('@/lib/store/user-data');
      const result = await updateTrip(profile.id, trip.id, payload);
      setBusy(false);
      if (!result.ok) {
        toast({ variant: 'error', title: result.error ?? 'Could not save the trip.' });
        return;
      }
      onSaved({ ...trip, ...payload });
      return;
    }

    const { trip: created, error } = await createTrip(profile.id, payload);
    setBusy(false);
    if (error || !created) {
      toast({ variant: 'error', title: error ?? 'Could not create the trip.' });
      return;
    }
    void recordActivity(profile.id, null, 'trip_create');
    onSaved(created);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={trip ? 'Edit trip' : 'Create a trip'}
      description={
        trip
          ? 'Changes apply to the itinerary and the route.'
          : 'Give the trip a name and a date range. You can add destinations next.'
      }
      size="lg"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" form="trip-form" className="btn-primary" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            {trip ? 'Save changes' : 'Create trip'}
          </button>
        </>
      }
    >
      <form id="trip-form" onSubmit={submit} noValidate className="space-y-4">
        <Field label="Trip name" error={errors.name} required>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Madhya Pradesh heritage trip"
            aria-invalid={Boolean(errors.name)}
            className={cn('input', errors.name && 'input-error')}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Starting location" error={errors.startLocation} required>
            <input
              type="text"
              value={startLocation}
              onChange={(event) => setStartLocation(event.target.value)}
              placeholder="New Delhi Railway Station"
              aria-invalid={Boolean(errors.startLocation)}
              className={cn('input', errors.startLocation && 'input-error')}
            />
          </Field>

          <Field label="Number of travellers" error={errors.travelers} required>
            <input
              type="number"
              min={1}
              max={40}
              value={travelers}
              onChange={(event) => setTravelers(Number(event.target.value))}
              aria-invalid={Boolean(errors.travelers)}
              className={cn('input', errors.travelers && 'input-error')}
            />
          </Field>
        </div>

        <Field
          label="Destination"
          hint="Optional. A short description of where this trip is going, e.g. “Temples of Bundelkhand”."
        >
          <input
            type="text"
            value={destinationSummary}
            onChange={(event) => setDestinationSummary(event.target.value)}
            placeholder="Temples of Bundelkhand"
            className="input"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date" error={errors.startDate} required>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              aria-invalid={Boolean(errors.startDate)}
              className={cn('input', errors.startDate && 'input-error')}
            />
          </Field>

          <Field label="End date" error={errors.endDate} required>
            <input
              type="date"
              min={startDate}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              aria-invalid={Boolean(errors.endDate)}
              className={cn('input', errors.endDate && 'input-error')}
            />
          </Field>
        </div>

        <Field label="Notes" hint="Anything you want to remember: bookings, clothing for temple visits, who is driving.">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="textarea"
            placeholder="Book the Khajuraho sound-and-light show in advance…"
          />
        </Field>

        <p className="text-xs text-charcoal-muted">
          Trip created{' '}
          {trip ? `on ${formatDate(trip.createdAt)}` : 'today'}. The itinerary is editable
          afterwards.
        </p>
      </form>
    </Modal>
  );
}

/** Labelled form field with optional error and hint text. */
export function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fieldset">
      <span className="label">
        {label}
        {required ? (
          <span className="ml-0.5 text-danger-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      {children}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-charcoal-muted">{hint}</p>
      ) : null}
    </div>
  );
}
