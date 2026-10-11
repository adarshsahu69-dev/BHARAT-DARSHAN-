'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { getAdminSession } from '@/lib/auth/next-auth';
import { prisma, Verification } from '@/lib/db';
import {
  CATEGORIES,
  HISTORICAL_PERIODS,
  type Category,
  type HistoricalPeriod,
} from '@/lib/types';
import { slugify } from '@/lib/utils';

/**
 * The core record fields an editor can set from the admin panel.
 *
 * The panel is deliberately narrow: historical narrative, architecture notes,
 * timelines, sources and images are seeded or curated outside the UI, so they
 * are not part of the draft.
 */
export interface DestinationDraft {
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

export type DestinationActionResult =
  | { ok: true }
  | { ok: false; error?: string; field?: string };

/**
 * The single boundary for every write in this module.
 *
 * The layout already gates the page, but a server action is a public endpoint:
 * the check has to run inside the action too, not just around the UI that
 * calls it.
 */
async function requireAdmin(): Promise<boolean> {
  return (await getAdminSession())?.user.role === 'ADMIN';
}

/** Field-keyed messages, mirroring the admin dialog one-to-one. */
function validateDraft(draft: DestinationDraft): Record<string, string> {
  const errors: Record<string, string> = {};

  if (draft.name.trim().length < 3) errors.name = 'Enter a name of at least 3 characters.';
  if (!slugify(draft.slug)) errors.slug = 'A URL slug is required.';
  if (draft.tagline.trim().length < 10) {
    errors.tagline = 'Write a one-line summary (10+ characters).';
  }
  if (draft.description.trim().length < 40) {
    errors.description = 'The overview needs at least 40 characters.';
  }
  if (!draft.state.trim()) errors.state = 'A state or region is required.';
  if (!draft.city.trim()) errors.city = 'A city or district is required.';
  if (!Number.isFinite(draft.latitude) || draft.latitude < -90 || draft.latitude > 90) {
    errors.latitude = 'Latitude must be between -90 and 90.';
  }
  if (!Number.isFinite(draft.longitude) || draft.longitude < -180 || draft.longitude > 180) {
    errors.longitude = 'Longitude must be between -180 and 180.';
  }
  if (!CATEGORIES.includes(draft.category)) {
    errors.category = 'Choose a category from the list.';
  }
  if (!HISTORICAL_PERIODS.includes(draft.historicalPeriod)) {
    errors.historicalPeriod = 'Choose a historical period from the list.';
  }
  if (draft.unescoYear !== undefined && draft.unescoYear !== null) {
    if (!Number.isInteger(draft.unescoYear) || draft.unescoYear < 1972 || draft.unescoYear > 2100) {
      errors.unescoYear = 'UNESCO year must be between 1972 and 2100.';
    }
  }

  return errors;
}

function toPrismaData(draft: DestinationDraft): Prisma.DestinationUncheckedCreateInput {
  return {
    slug: slugify(draft.slug),
    name: draft.name.trim(),
    tagline: draft.tagline.trim(),
    description: draft.description.trim(),
    state: draft.state,
    city: draft.city,
    latitude: Number(draft.latitude),
    longitude: Number(draft.longitude),
    category: draft.category,
    historicalPeriod: draft.historicalPeriod,
    verification: draft.verification === 'verified' ? Verification.VERIFIED : Verification.UNVERIFIED,
    featured: draft.featured,
    unescoYear: draft.unescoYear ?? null,
  };
}

/**
 * Prisma's known error codes carry meaning a generic catch cannot: P2002 is a
 * unique-constraint clash (a duplicate slug), P2025 is a missing row. Anything
 * else is surfaced without leaking driver detail.
 */
function mapPrismaError(error: unknown): DestinationActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return { ok: false, error: 'That slug is already in use.', field: 'slug' };
    }
    if (error.code === 'P2025') {
      return { ok: false, error: 'That record no longer exists.' };
    }
  }
  return { ok: false, error: 'Could not save the record. Please try again.' };
}

function firstError(errors: Record<string, string>): DestinationActionResult | null {
  const field = Object.keys(errors)[0];
  if (!field) return null;
  return { ok: false, error: errors[field], field };
}

export async function createDestination(draft: DestinationDraft): Promise<DestinationActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Not authorised' };

  const invalid = firstError(validateDraft(draft));
  if (invalid) return invalid;

  try {
    await prisma.destination.create({
      data: {
        ...toPrismaData(draft),
        // Editorial defaults for a brand-new record. An editor raises these
        // once the record is complete; the panel does not ask for them up front.
        visitDurationMinutes: 60,
        significanceScore: 3,
        tags: [],
      },
    });
  } catch (error) {
    return mapPrismaError(error);
  }

  revalidatePath('/admin');
  return { ok: true };
}

export async function updateDestination(
  id: string,
  draft: DestinationDraft,
): Promise<DestinationActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Not authorised' };

  const invalid = firstError(validateDraft(draft));
  if (invalid) return invalid;

  try {
    await prisma.destination.update({ where: { id }, data: toPrismaData(draft) });
  } catch (error) {
    return mapPrismaError(error);
  }

  revalidatePath('/admin');
  return { ok: true };
}

export async function deleteDestination(id: string): Promise<DestinationActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Not authorised' };

  try {
    await prisma.destination.delete({ where: { id } });
  } catch (error) {
    return mapPrismaError(error);
  }

  revalidatePath('/admin');
  return { ok: true };
}
