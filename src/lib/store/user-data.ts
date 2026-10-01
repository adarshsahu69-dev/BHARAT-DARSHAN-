'use client';

import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/config';
import { createId, daysBetween } from '@/lib/utils';
import type {
  ActivityType,
  Destination,
  Trip,
  TripStop,
  TripWithStops,
  UserActivity,
} from '@/lib/types';
import { getDestinationById } from '@/data/destinations';

/**
 * Saved destinations, trips and activity.
 *
 * Two backends behind one interface:
 *
 *  - Supabase, when the project is configured. Every statement runs as the
 *    signed-in user, so Row Level Security is the actual authorisation
 *    boundary — a user cannot read or write another user's rows.
 *  - Browser storage, otherwise. Keyed by user id, and labelled as demo data
 *    in the dashboard.
 *
 * The browser path is not a security boundary and never pretends to be: it holds
 * the current user's own records only, in one browser.
 */

const PREFIX = 'bd.v1';

const savedKey = (userId: string) => `${PREFIX}.saved.${userId}`;
const tripsKey = (userId: string) => `${PREFIX}.trips.${userId}`;
const activityKey = (userId: string) => `${PREFIX}.activity.${userId}`;

/* ------------------------------------------------------------------ */
/* Local storage primitives                                            */
/* ------------------------------------------------------------------ */

function canStore(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__bd_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function load<T>(key: string, fallback: T): T {
  if (!canStore()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked. The in-memory result of this session still holds.
  }
}

/* ------------------------------------------------------------------ */
/* Row mapping (Supabase -> domain)                                    */
/* ------------------------------------------------------------------ */

interface TripRow {
  id: string;
  user_id: string;
  name: string;
  start_location: string;
  destination_summary: string | null;
  start_date: string;
  end_date: string;
  travelers: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface StopRow {
  id: string;
  trip_id: string;
  destination_id: string;
  visit_date: string | null;
  order_index: number;
  notes: string | null;
  start_time: string | null;
  end_time: string | null;
  activity: string | null;
}

function rowToTrip(row: TripRow): Trip {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    startLocation: row.start_location,
    destinationSummary: row.destination_summary,
    startDate: row.start_date,
    endDate: row.end_date,
    travelers: row.travelers,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Drops the hydrated stops, leaving the trip record itself. */
function toPlainTrip(trip: TripWithStops): Trip {
  return {
    id: trip.id,
    userId: trip.userId,
    name: trip.name,
    startLocation: trip.startLocation,
    destinationSummary: trip.destinationSummary,
    startDate: trip.startDate,
    endDate: trip.endDate,
    travelers: trip.travelers,
    notes: trip.notes,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}

/** Resolves stops to destinations, dropping any whose destination is gone. */
function attachStops(trip: Trip, stops: StopRow[]): TripWithStops {
  const hydrated: (TripStop & { destination: Destination })[] = [];
  for (const stop of stops) {
    const destination = getDestinationById(stop.destination_id);
    if (!destination) continue;
    hydrated.push({
      id: stop.id,
      tripId: stop.trip_id,
      destinationId: stop.destination_id,
      visitDate: stop.visit_date,
      orderIndex: stop.order_index,
      notes: stop.notes,
      startTime: stop.start_time,
      endTime: stop.end_time,
      activity: stop.activity,
      destination,
    });
  }
  hydrated.sort((a, b) => a.orderIndex - b.orderIndex);
  return { ...trip, stops: hydrated };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export interface CreateTripInput {
  name: string;
  startLocation: string;
  destinationSummary?: string | null;
  startDate: string;
  endDate: string;
  travelers: number;
  notes?: string | null;
}

export interface StopInput {
  destinationId: string;
  visitDate?: string | null;
  notes?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  activity?: string | null;
}

/* ---------------------------- saved --------------------------------- */

export async function getSavedIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured) return load<string[]>(savedKey(userId), []);

  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('saved_destinations')
    .select('destination_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []).map((r) => (r as { destination_id: string }).destination_id);
}

export async function toggleSaved(
  userId: string,
  destinationId: string,
): Promise<{ saved: boolean; error?: string }> {
  const current = await getSavedIds(userId);
  const isSaved = current.includes(destinationId);

  if (!isSupabaseConfigured) {
    const next = isSaved ? current.filter((id) => id !== destinationId) : [destinationId, ...current];
    save(savedKey(userId), next);
    return { saved: !isSaved };
  }

  const supabase = createClient();
  if (!supabase) return { saved: !isSaved };

  if (isSaved) {
    const { error } = await supabase
      .from('saved_destinations')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);
    if (error) return { saved: true, error: 'Could not remove from saved places.' };
    return { saved: false };
  }

  const { error } = await supabase
    .from('saved_destinations')
    .insert({ user_id: userId, destination_id: destinationId });
  if (error) return { saved: true, error: 'Could not save this place.' };
  return { saved: true };
}

/* ---------------------------- activity ------------------------------ */

export async function recordActivity(
  userId: string,
  destinationId: string | null,
  activityType: ActivityType,
): Promise<void> {
  if (!isSupabaseConfigured) {
    const list = load<UserActivity[]>(activityKey(userId), []);
    list.unshift({
      id: createId('act'),
      userId,
      destinationId,
      activityType,
      createdAt: new Date().toISOString(),
    });
    // Keep the buffer bounded; this is a recents list, not an audit log.
    save(activityKey(userId), list.slice(0, 100));
    return;
  }

  const supabase = createClient();
  if (!supabase) return;
  await supabase.from('user_activity').insert({
    user_id: userId,
    destination_id: destinationId,
    activity_type: activityType,
  });
}

export async function getRecentActivity(
  userId: string,
  limit = 12,
): Promise<UserActivity[]> {
  if (!isSupabaseConfigured) {
    return load<UserActivity[]>(activityKey(userId), []).slice(0, limit);
  }

  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('user_activity')
    .select('id, user_id, destination_id, activity_type, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []).map(
    (r): UserActivity => ({
      id: (r as { id: string }).id,
      userId: (r as { user_id: string }).user_id,
      destinationId: (r as { destination_id: string | null }).destination_id,
      activityType: (r as { activity_type: ActivityType }).activity_type,
      createdAt: (r as { created_at: string }).created_at,
    }),
  );
}

/* ---------------------------- trips --------------------------------- */

export async function getTrips(userId: string): Promise<Trip[]> {
  if (!isSupabaseConfigured) {
    return load<TripWithStops[]>(tripsKey(userId), []).map(toPlainTrip);
  }

  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: true });

  if (error) return [];
  return (data as TripRow[]).map(rowToTrip);
}

export async function getTripWithStops(
  userId: string,
  tripId: string,
): Promise<TripWithStops | null> {
  if (!isSupabaseConfigured) {
    const trip = load<TripWithStops[]>(tripsKey(userId), []).find((t) => t.id === tripId);
    if (!trip) return null;
    return { ...trip, stops: [...trip.stops].sort((a, b) => a.orderIndex - b.orderIndex) };
  }

  const supabase = createClient();
  if (!supabase) return null;

  const { data: tripRow, error: tripError } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .eq('user_id', userId)
    .maybeSingle();

  if (tripError || !tripRow) return null;

  const { data: stopRows, error: stopError } = await supabase
    .from('trip_destinations')
    .select('*')
    .eq('trip_id', tripId)
    .order('order_index', { ascending: true });

  if (stopError) return null;
  return attachStops(rowToTrip(tripRow as TripRow), (stopRows ?? []) as StopRow[]);
}

export async function createTrip(
  userId: string,
  input: CreateTripInput,
): Promise<{ trip: Trip | null; error?: string }> {
  const now = new Date().toISOString();

  if (!isSupabaseConfigured) {
    const trip: TripWithStops = {
      id: createId('trip'),
      userId,
      name: input.name,
      startLocation: input.startLocation,
      destinationSummary: input.destinationSummary ?? null,
      startDate: input.startDate,
      endDate: input.endDate,
      travelers: input.travelers,
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now,
      stops: [],
    };
    const list = load<TripWithStops[]>(tripsKey(userId), []);
    save(tripsKey(userId), [trip, ...list]);
    return { trip: toPlainTrip(trip) };
  }

  const supabase = createClient();
  if (!supabase) return { trip: null, error: 'Database is not configured.' };

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: userId,
      name: input.name,
      start_location: input.startLocation,
      destination_summary: input.destinationSummary ?? null,
      start_date: input.startDate,
      end_date: input.endDate,
      travelers: input.travelers,
      notes: input.notes ?? null,
    })
    .select('*')
    .single();

  if (error) return { trip: null, error: 'Could not create the trip.' };
  return { trip: rowToTrip(data as TripRow) };
}

export async function updateTrip(
  userId: string,
  tripId: string,
  patch: Partial<CreateTripInput>,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    const list = load<TripWithStops[]>(tripsKey(userId), []);
    const index = list.findIndex((t) => t.id === tripId);
    if (index === -1) return { ok: false, error: 'Trip not found.' };
    list[index] = { ...list[index], ...patch, updatedAt: new Date().toISOString() };
    save(tripsKey(userId), list);
    return { ok: true };
  }

  const supabase = createClient();
  if (!supabase) return { ok: false, error: 'Database is not configured.' };

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.startLocation !== undefined) payload.start_location = patch.startLocation;
  if (patch.destinationSummary !== undefined) payload.destination_summary = patch.destinationSummary;
  if (patch.startDate !== undefined) payload.start_date = patch.startDate;
  if (patch.endDate !== undefined) payload.end_date = patch.endDate;
  if (patch.travelers !== undefined) payload.travelers = patch.travelers;
  if (patch.notes !== undefined) payload.notes = patch.notes;

  const { error } = await supabase.from('trips').update(payload).eq('id', tripId).eq('user_id', userId);
  if (error) return { ok: false, error: 'Could not save your changes.' };
  return { ok: true };
}

export async function deleteTrip(userId: string, tripId: string): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    const list = load<TripWithStops[]>(tripsKey(userId), []);
    save(
      tripsKey(userId),
      list.filter((t) => t.id !== tripId),
    );
    return { ok: true };
  }

  const supabase = createClient();
  if (!supabase) return { ok: false, error: 'Database is not configured.' };

  // `trip_destinations` has ON DELETE CASCADE, so stops go with the trip.
  const { error } = await supabase.from('trips').delete().eq('id', tripId).eq('user_id', userId);
  if (error) return { ok: false, error: 'Could not delete the trip.' };
  return { ok: true };
}

/* --------------------------- trip stops ----------------------------- */

export async function addStop(
  userId: string,
  tripId: string,
  input: StopInput,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    const list = load<TripWithStops[]>(tripsKey(userId), []);
    const trip = list.find((t) => t.id === tripId);
    if (!trip) return { ok: false, error: 'Trip not found.' };

    const destination = getDestinationById(input.destinationId);
    if (!destination) return { ok: false, error: 'That destination is not available.' };
    if (trip.stops.some((s) => s.destinationId === input.destinationId)) {
      return { ok: false, error: 'That place is already in this trip.' };
    }

    trip.stops.push({
      id: createId('stop'),
      tripId,
      destinationId: input.destinationId,
      visitDate: input.visitDate ?? null,
      orderIndex: trip.stops.length,
      notes: input.notes ?? null,
      startTime: input.startTime ?? null,
      endTime: input.endTime ?? null,
      activity: input.activity ?? null,
      destination,
    });
    trip.updatedAt = new Date().toISOString();
    save(tripsKey(userId), list);
    return { ok: true };
  }

  const supabase = createClient();
  if (!supabase) return { ok: false, error: 'Database is not configured.' };

  const { data: existing } = await supabase
    .from('trip_destinations')
    .select('order_index')
    .eq('trip_id', tripId)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextIndex = (existing?.[0] as { order_index: number } | undefined)?.order_index ?? -1;

  const { error } = await supabase.from('trip_destinations').insert({
    trip_id: tripId,
    destination_id: input.destinationId,
    visit_date: input.visitDate ?? null,
    order_index: nextIndex + 1,
    notes: input.notes ?? null,
    start_time: input.startTime ?? null,
    end_time: input.endTime ?? null,
    activity: input.activity ?? null,
  });

  if (error) return { ok: false, error: 'Could not add that place to the trip.' };
  return { ok: true };
}

export async function removeStop(
  userId: string,
  tripId: string,
  stopId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    const list = load<TripWithStops[]>(tripsKey(userId), []);
    const trip = list.find((t) => t.id === tripId);
    if (!trip) return { ok: false, error: 'Trip not found.' };
    trip.stops = trip.stops
      .filter((s) => s.id !== stopId)
      .map((s, index) => ({ ...s, orderIndex: index }));
    trip.updatedAt = new Date().toISOString();
    save(tripsKey(userId), list);
    return { ok: true };
  }

  const supabase = createClient();
  if (!supabase) return { ok: false, error: 'Database is not configured.' };

  const { error } = await supabase.from('trip_destinations').delete().eq('id', stopId).eq('trip_id', tripId);
  if (error) return { ok: false, error: 'Could not remove that place.' };

  // Renumber the remainder so order_index stays dense and comparable.
  const { data: remaining } = await supabase
    .from('trip_destinations')
    .select('id')
    .eq('trip_id', tripId)
    .order('order_index', { ascending: true });

  const ids = (remaining ?? []).map((r) => (r as { id: string }).id);
  if (ids.length > 0) {
    await supabase.from('trip_destinations').upsert(
      ids.map((id, index) => ({ id, trip_id: tripId, order_index: index })),
    );
  }

  return { ok: true };
}

export async function updateStop(
  userId: string,
  tripId: string,
  stopId: string,
  patch: Partial<StopInput>,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    const list = load<TripWithStops[]>(tripsKey(userId), []);
    const trip = list.find((t) => t.id === tripId);
    if (!trip) return { ok: false, error: 'Trip not found.' };
    const stop = trip.stops.find((s) => s.id === stopId);
    if (!stop) return { ok: false, error: 'Stop not found.' };

    if (patch.visitDate !== undefined) stop.visitDate = patch.visitDate;
    if (patch.notes !== undefined) stop.notes = patch.notes;
    if (patch.startTime !== undefined) stop.startTime = patch.startTime;
    if (patch.endTime !== undefined) stop.endTime = patch.endTime;
    if (patch.activity !== undefined) stop.activity = patch.activity;

    trip.updatedAt = new Date().toISOString();
    save(tripsKey(userId), list);
    return { ok: true };
  }

  const supabase = createClient();
  if (!supabase) return { ok: false, error: 'Database is not configured.' };

  const payload: Record<string, unknown> = {};
  if (patch.visitDate !== undefined) payload.visit_date = patch.visitDate;
  if (patch.notes !== undefined) payload.notes = patch.notes;
  if (patch.startTime !== undefined) payload.start_time = patch.startTime;
  if (patch.endTime !== undefined) payload.end_time = patch.endTime;
  if (patch.activity !== undefined) payload.activity = patch.activity;

  if (Object.keys(payload).length === 0) return { ok: true };

  const { error } = await supabase
    .from('trip_destinations')
    .update(payload)
    .eq('id', stopId)
    .eq('trip_id', tripId);

  if (error) return { ok: false, error: 'Could not save that stop.' };
  return { ok: true };
}

/**
 * Persists a new stop order.
 *
 * `order_index` is declared UNIQUE per trip, so a naive sequential rewrite trips
 * the constraint. The offset keeps every intermediate value distinct.
 */
export async function reorderStops(
  userId: string,
  tripId: string,
  orderedStopIds: string[],
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    const list = load<TripWithStops[]>(tripsKey(userId), []);
    const trip = list.find((t) => t.id === tripId);
    if (!trip) return { ok: false, error: 'Trip not found.' };

    const byId = new Map(trip.stops.map((s) => [s.id, s]));
    const reordered = orderedStopIds
      .map((id) => byId.get(id))
      .filter((s): s is TripStop & { destination: Destination } => Boolean(s));

    // Anything the caller did not mention keeps its relative position at the end.
    for (const stop of trip.stops) {
      if (!orderedStopIds.includes(stop.id)) reordered.push(stop);
    }

    trip.stops = reordered.map((s, index) => ({ ...s, orderIndex: index }));
    trip.updatedAt = new Date().toISOString();
    save(tripsKey(userId), list);
    return { ok: true };
  }

  const supabase = createClient();
  if (!supabase) return { ok: false, error: 'Database is not configured.' };

  /*
   * `order_index` is UNIQUE per trip, so a naive sequential rewrite collides
   * with itself mid-statement. Adding a constant to every row is order-preserving
   * and cannot introduce a collision, which frees the low range for one write.
   */
  const SHIFT = 10_000;

  const { data: allRows, error: readError } = await supabase
    .from('trip_destinations')
    .select('id, order_index')
    .eq('trip_id', tripId)
    .order('order_index', { ascending: true });

  if (readError) return { ok: false, error: 'Could not reorder the itinerary.' };

  // Distinct high values, written one at a time so no intermediate state can
  // collide with a row that has not moved yet.
  for (const [index, row] of (allRows ?? []).entries()) {
    const { error } = await supabase
      .from('trip_destinations')
      .update({ order_index: SHIFT + index })
      .eq('id', (row as { id: string }).id);
    if (error) return { ok: false, error: 'Could not reorder the itinerary.' };
  }

  const { error: stageError } = await supabase.from('trip_destinations').upsert(
    orderedStopIds.map((id, index) => ({ id, trip_id: tripId, order_index: index })),
  );

  if (stageError) return { ok: false, error: 'Could not reorder the itinerary.' };

  // Rows the caller did not mention keep a position after the ordered ones.
  const { data: orphans } = await supabase
    .from('trip_destinations')
    .select('id')
    .eq('trip_id', tripId)
    .gte('order_index', SHIFT);

  for (const [index, row] of (orphans ?? []).entries()) {
    const { error } = await supabase
      .from('trip_destinations')
      .update({ order_index: orderedStopIds.length + index })
      .eq('id', (row as { id: string }).id);
    if (error) return { ok: false, error: 'Could not finalise the itinerary order.' };
  }

  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Aggregates                                                          */
/* ------------------------------------------------------------------ */

/**
 * Removes every browser-stored record for a user.
 *
 * Only meaningful in demo mode, where the "delete my data" control points here.
 * In Supabase mode the equivalent is an authenticated DELETE against each table.
 */
export function clearAllUserData(userId?: string): void {
  if (!canStore()) return;
  const target = userId ?? null;

  for (const key of Object.keys(window.localStorage)) {
    if (!key.startsWith(PREFIX)) continue;
    // Without a user id, every key under the prefix belongs to the demo store.
    if (target !== null && !key.endsWith(`.${target}`)) continue;
    window.localStorage.removeItem(key);
  }
}

export interface TripSummary {
  tripId: string;
  stops: number;
  days: number;
  /** True when every stop in the trip carries a visit date. */
  fullyScheduled: boolean;
  completed: boolean;
  /** ISO date of the earliest scheduled stop, if any. */
  firstVisitDate: string | null;
}

/**
 * Derives the dashboard counters for each trip. Lives here so the Supabase and
 * browser backends present identical figures.
 */
export function summariseTrips(trips: TripWithStops[]): TripSummary[] {
  const now = Date.now();

  return trips.map((trip) => {
    const days = daysBetween(trip.startDate, trip.endDate);
    const endTime = new Date(trip.endDate).getTime();

    const dates = trip.stops
      .map((stop) => stop.visitDate)
      .filter((date): date is string => Boolean(date))
      .sort();

    return {
      tripId: trip.id,
      stops: trip.stops.length,
      days,
      fullyScheduled: trip.stops.length > 0 && dates.length === trip.stops.length,
      completed: Number.isFinite(endTime) && endTime < now,
      firstVisitDate: dates[0] ?? null,
    };
  });
}
