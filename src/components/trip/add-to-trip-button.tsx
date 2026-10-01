'use client';

import { useEffect, useState } from 'react';
import { CalendarPlus, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addStop, createTrip, getTrips, recordActivity } from '@/lib/store/user-data';
import { useAuth } from '@/lib/auth/session-provider';
import { useToast } from '@/components/ui/toast';
import { Modal, useDisclosure } from '@/components/ui/modal';
import { redirectToLogin } from '@/lib/auth/redirect';
import { toISODate } from '@/lib/utils';
import type { Destination, Trip } from '@/lib/types';

/**
 * Adds a destination to an existing trip, or creates one on the fly.
 *
 * Creating a trip inline — rather than bouncing the user to the planner and
 * losing their place — is the difference between a feature that gets used and one
 * that does not. The newly created trip is named after the destination so it is
 * never left as "Untitled trip".
 */
export function AddToTripButton({
  destination,
  variant = 'inline',
  className,
}: {
  destination: Destination;
  variant?: 'inline' | 'primary';
  className?: string;
}) {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const { toast } = useToast();
  const dialog = useDisclosure();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [busy, setBusy] = useState(false);
  const [newTripName, setNewTripName] = useState(`${destination.city} heritage trip`);

  useEffect(() => {
    if (!dialog.isOpen || !profile) return;
    let cancelled = false;
    void getTrips(profile.id).then((list) => {
      if (cancelled) return;
      setTrips(list);
    });
    return () => {
      cancelled = true;
    };
  }, [dialog.isOpen, profile]);

  const addTo = async (trip: Trip) => {
    if (!profile) return;
    setBusy(true);
    const result = await addStop(profile.id, trip.id, { destinationId: destination.id });
    setBusy(false);

    if (!result.ok) {
      toast({ variant: 'error', title: result.error ?? 'Could not add this place.' });
      return;
    }

    void recordActivity(profile.id, destination.id, 'trip_add');
    toast({
      variant: 'success',
      title: `Added to ${trip.name}`,
      description: 'Open the trip to set the day and time.',
    });
    dialog.close();
  };

  const createAndAdd = async () => {
    if (!profile) return;
    const name = newTripName.trim();
    if (!name) {
      toast({ variant: 'error', title: 'Give the trip a name.' });
      return;
    }

    setBusy(true);
    const today = toISODate(new Date());
    const { trip, error } = await createTrip(profile.id, {
      name,
      startLocation: destination.city,
      startDate: today,
      // A single-day placeholder the user can widen; two weeks is arbitrary and
      // would be wrong more often than right, so it is set to the same day and
      // left for the planner to expand.
      endDate: today,
      travelers: 1,
    });

    if (error || !trip) {
      setBusy(false);
      toast({ variant: 'error', title: error ?? 'Could not create the trip.' });
      return;
    }

    const added = await addStop(profile.id, trip.id, { destinationId: destination.id });
    setBusy(false);

    if (!added.ok) {
      toast({ variant: 'warning', title: `Created “${name}”`, description: added.error });
      router.push(`/trip-planner/trips/${trip.id}`);
      return;
    }

    void recordActivity(profile.id, destination.id, 'trip_add');
    toast({ variant: 'success', title: `Created “${name}” with ${destination.name}` });
    dialog.close();
    router.push(`/trip-planner/trips/${trip.id}`);
  };

  const onClick = () => {
    if (loading) return;
    if (!profile) {
      toast({
        variant: 'info',
        title: 'Sign in to build a trip',
        description: 'Itineraries are tied to your account.',
      });
      redirectToLogin();
      return;
    }
    dialog.open();
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={
          variant === 'primary'
            ? `btn-primary ${className ?? ''}`
            : `btn-secondary btn-sm ${className ?? ''}`
        }
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        )}
        Add to trip
      </button>

      <Modal
        open={dialog.isOpen}
        onClose={dialog.close}
        title={`Add ${destination.name} to a trip`}
        description="Choose an existing trip, or start a new one."
      >
        {trips.length > 0 ? (
          <ul className="space-y-2">
            {trips.map((trip) => (
              <li key={trip.id}>
                <button
                  type="button"
                  onClick={() => addTo(trip)}
                  disabled={busy}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-sand-200 bg-white p-3.5 text-left transition-colors hover:border-saffron-400 hover:bg-sand-50 disabled:opacity-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-charcoal">
                      {trip.name}
                    </span>
                    <span className="block truncate text-xs text-charcoal-muted">
                      {trip.startDate} → {trip.endDate} · {trip.travelers}{' '}
                      {trip.travelers === 1 ? 'traveller' : 'travellers'}
                    </span>
                  </span>
                  <Check className="h-4 w-4 shrink-0 text-charcoal-muted" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-sand-300 bg-sand-50 p-4 text-sm text-charcoal-muted">
            You have no trips yet. Create one below, or open the trip planner to build a
            full itinerary.
          </p>
        )}

        <div className="mt-5 border-t border-sand-200 pt-5">
          <label htmlFor="new-trip-name" className="label">
            Or start a new trip
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="new-trip-name"
              type="text"
              value={newTripName}
              onChange={(event) => setNewTripName(event.target.value)}
              className="input flex-1"
              placeholder="Trip name"
            />
            <button
              type="button"
              onClick={createAndAdd}
              disabled={busy}
              className="btn-primary shrink-0"
            >
              Create &amp; add
            </button>
          </div>
          <p className="mt-2 text-xs text-charcoal-muted">
            A one-day trip is created with this place in it. Open the planner to set real
            dates, add more stops and arrange the order.
          </p>
        </div>
      </Modal>
    </>
  );
}
