import { Prisma } from '@prisma/client';
import type { ContentReport as ContentReportRow, User as UserRow } from '@prisma/client';
import { Role, Verification } from '@/lib/db';
import type {
  Category,
  ContentReport,
  Destination,
  DestinationImage,
  DestinationSource,
  HistoricalPeriod,
  ReportStatus,
  SourceType,
  UserRole,
} from '@/lib/types';

/**
 * Prisma-shaped rows as the admin page reads them.
 *
 * `DestinationRow` carries the two relations the panel needs (source count and
 * gallery); the source and image row types are derived from it rather than
 * repeated, so they cannot drift from what the query actually selects.
 */
type DestinationRow = Prisma.DestinationGetPayload<{
  include: { sources: true; images: true };
}>;

type SourceRow = DestinationRow['sources'][number];
type ImageRow = DestinationRow['images'][number];

function toSource(row: SourceRow): DestinationSource {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    // `sourceType` is a free-form string in the schema; the editor picks from
    // the fixed list, so anything else falls through as the catch-all type.
    sourceType: row.sourceType as SourceType,
    note: row.note ?? undefined,
  };
}

function toImage(row: ImageRow): DestinationImage {
  return {
    id: row.id,
    imageUrl: row.imageUrl,
    caption: row.caption ?? undefined,
    source: row.source ?? undefined,
  };
}

/** Maps a destination row (with sources and images) onto the domain type. */
export function toDestination(row: DestinationRow): Destination {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    description: row.description,
    historicalDescription: row.historicalDescription,
    state: row.state,
    city: row.city,
    latitude: row.latitude,
    longitude: row.longitude,
    category: row.category as Category,
    historicalPeriod: row.historicalPeriod as HistoricalPeriod,
    imageUrl: row.imageUrl ?? '',
    verification: row.verification === Verification.VERIFIED ? 'verified' : 'unverified',
    featured: row.featured,
    unescoYear: row.unescoYear ?? undefined,
    unescoListId: row.unescoListId ?? undefined,
    significanceScore: row.significanceScore,
    bestSeason: row.bestSeason,
    openingHours: row.openingHours,
    entryInformation: row.entryInformation,
    visitDurationMinutes: row.visitDurationMinutes,
    // Curated facets are not modelled in the admin database; the record page
    // treats them as empty rather than inventing values.
    alsoCategories: [],
    nearbyAttractions: [],
    architecture: [],
    timeline: [],
    sources: row.sources.map(toSource),
    images: row.images.map(toImage),
    tags: row.tags,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toReport(row: ContentReportRow): ContentReport {
  return {
    id: row.id,
    destinationId: row.destinationId,
    destinationName: row.destinationName,
    reporterEmail: row.reporterEmail,
    reason: row.reason,
    details: row.details,
    status: row.status as ReportStatus,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toAdminUser(row: UserRow): {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
} {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role === Role.ADMIN ? 'admin' : 'user',
    createdAt: row.createdAt.toISOString(),
  };
}
