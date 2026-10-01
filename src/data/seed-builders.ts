import { commonsImage, commonsPage } from './commons-images';
import type {
  ArchitectureNote,
  Category,
  Destination,
  DestinationImage,
  DestinationSource,
  HistoricalPeriod,
  SourceType,
  TimelineEvent,
  VerificationStatus,
} from '@/lib/types';

/**
 * Builders for the seed dataset.
 *
 * The point of this module is that every record is assembled from a small set of
 * typed inputs plus a *declaration of provenance*. Nothing is invented at
 * render time, and every destination carries the sources that support it.
 */

/* ------------------------------------------------------------------ */
/* Provenance helpers                                                  */
/* ------------------------------------------------------------------ */

export const UNESCO = (listId: number, title?: string): DestinationSource => ({
  id: `src_whc_${listId}`,
  title: title ?? 'UNESCO World Heritage List record',
  url: `https://whc.unesco.org/en/list/${listId}`,
  sourceType: 'UNESCO',
  note: 'Official inscription record, including criteria and year of inscription.',
});

export const ASI = (note?: string): DestinationSource => ({
  id: 'src_asi_circle',
  title: 'Archaeological Survey of India — protected monuments',
  url: 'https://asi.nic.in/pages/WorldHeritageSites',
  sourceType: 'Archaeological Survey of India',
  note: note ?? 'ASI is the body responsible for protection and upkeep of this monument.',
});

export const ASI_CIRCLE = (circle: string, note?: string): DestinationSource => ({
  id: `src_asi_${circle.toLowerCase().replace(/\s+/g, '_')}`,
  title: `Archaeological Survey of India — ${circle} Circle`,
  url: 'https://asi.nic.in/',
  sourceType: 'Archaeological Survey of India',
  note: note ?? `The ${circle} Circle of the ASI has administrative charge of this site.`,
});

export const MINISTRY_OF_CULTURE = (note?: string): DestinationSource => ({
  id: 'src_moc',
  title: 'Ministry of Culture, Government of India',
  url: 'https://www.indiaculture.gov.in/',
  sourceType: 'Ministry of Culture',
  note: note ?? 'Surveys cultural institutions, antiquities and heritage programmes.',
});

export const TOURISM = (name: string, url: string, note?: string): DestinationSource => ({
  id: `src_tourism_${url.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40)}`,
  title: name,
  url,
  sourceType: 'Official tourism',
  note: note ?? 'Official visitor information. Opening hours and entry fees should be confirmed here before travel.',
});

export const GOV_ARCHIVE = (title: string, url: string): DestinationSource => ({
  id: `src_arch_${url.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40)}`,
  title,
  url,
  sourceType: 'Government archive',
});

export const ACADEMIC = (title: string, url: string, note?: string): DestinationSource => ({
  id: `src_acad_${url.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40)}`,
  title,
  url,
  sourceType: 'Academic',
  note,
});

export const MUSEUM = (title: string, url: string, note?: string): DestinationSource => ({
  id: `src_mus_${url.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40)}`,
  title,
  url,
  sourceType: 'Museum',
  note,
});

/**
 * Attribution source for the Wikimedia Commons files used in the seed data.
 * Each Commons description page carries the author and licence.
 */
export const commonsAttribution = (filename: string): DestinationSource => ({
  id: `src_commons_${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 48)}`,
  title: `Image licence and author — “${filename}” on Wikimedia Commons`,
  url: commonsPage(filename),
  sourceType: 'Other',
  note: 'Seed imagery is reused under the licence stated on the file description page.',
});

/* ------------------------------------------------------------------ */
/* Image helper                                                        */
/* ------------------------------------------------------------------ */

export interface ImageSpec {
  file: string;
  caption: string;
}

/**
 * Resolves image specs to URLs. Any file missing from the manifest is dropped
 * rather than emitted as a broken URL, so the UI never renders a dead image.
 */
export function imagesFrom(specs: ImageSpec[]): DestinationImage[] {
  const out: DestinationImage[] = [];
  for (const spec of specs) {
    const url = commonsImage(spec.file);
    if (!url) continue;
    out.push({
      id: `img_${spec.file.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 48)}`,
      imageUrl: url,
      caption: spec.caption,
      source: commonsPage(spec.file),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Destination builder                                                 */
/* ------------------------------------------------------------------ */

export interface DestinationInput {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  historicalDescription: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  category: Category;
  /** Secondary categories, used by the discovery facets. */
  alsoCategories?: Category[];
  historicalPeriod: HistoricalPeriod;
  image: ImageSpec;
  gallery?: ImageSpec[];
  /** Year of UNESCO inscription, when the property is on the World Heritage List. */
  unescoYear?: number;
  unescoListId?: number;
  significanceScore: number;
  bestSeason: string;
  openingHours: string;
  entryInformation: string;
  visitDurationMinutes: number;
  nearbyAttractions: string[];
  architecture: ArchitectureNote[];
  timeline: TimelineEvent[];
  sources: DestinationSource[];
  tags: string[];
  featured?: boolean;
  verification?: VerificationStatus;
  updatedAt?: string;
}

/** Timestamp applied to seed records so ordering is stable and reproducible. */
const SEED_CREATED_AT = '2026-01-15T00:00:00.000Z';

export function buildDestination(input: DestinationInput): Destination {
  const allSpecs = [input.image, ...(input.gallery ?? [])];
  const images = imagesFrom(allSpecs);
  const primary = images[0];

  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    tagline: input.tagline,
    description: input.description,
    historicalDescription: input.historicalDescription,
    state: input.state,
    city: input.city,
    latitude: input.latitude,
    longitude: input.longitude,
    category: input.category,
    alsoCategories: (input.alsoCategories ?? []).filter((c) => c !== input.category),
    historicalPeriod: input.historicalPeriod,
    imageUrl: primary?.imageUrl ?? '',
    unescoYear: input.unescoYear,
    unescoListId: input.unescoListId,
    featured: input.featured ?? false,
    significanceScore: input.significanceScore,
    bestSeason: input.bestSeason,
    openingHours: input.openingHours,
    entryInformation: input.entryInformation,
    visitDurationMinutes: input.visitDurationMinutes,
    nearbyAttractions: input.nearbyAttractions,
    architecture: input.architecture,
    timeline: input.timeline,
    sources: input.sources,
    images,
    tags: input.tags,
    // Seed records are editorial drafts until an admin has checked them against
    // the cited sources. The UI surfaces this honestly.
    verification: input.verification ?? 'unverified',
    createdAt: SEED_CREATED_AT,
    updatedAt: input.updatedAt ?? SEED_CREATED_AT,
  };
}

export type { ArchitectureNote, Category, HistoricalPeriod, SourceType, TimelineEvent };
