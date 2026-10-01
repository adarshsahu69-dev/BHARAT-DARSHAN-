/**
 * Domain types shared across the app.
 * These mirror the Supabase schema in `supabase/migrations` one-to-one so the
 * mock repository and the real Postgres repository are interchangeable.
 */

export const CATEGORIES = [
  'Ancient India',
  'Forts & Palaces',
  'Temples',
  'UNESCO Heritage',
  'Museums',
  'Buddhist Sites',
  'Historical Cities',
  'Archaeological Sites',
  'Natural Heritage',
  'Cultural Festivals',
  'Beaches',
  'Mountains',
  'Wildlife',
  'Hidden Gems',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const HISTORICAL_PERIODS = [
  'Ancient India',
  'Mauryan Period',
  'Gupta Period',
  'Early Medieval India',
  'Delhi Sultanate',
  'Mughal Period',
  'Maratha Period',
  'Colonial India',
  'Modern India',
] as const;

export type HistoricalPeriod = (typeof HISTORICAL_PERIODS)[number];

export type SourceType =
  | 'Archaeological Survey of India'
  | 'UNESCO'
  | 'Ministry of Culture'
  | 'Official tourism'
  | 'Museum'
  | 'Government archive'
  | 'Academic'
  | 'Other';

/**
 * `verification` communicates epistemic status of the record itself.
 * `unverified` entries are demo data and are labelled in the UI.
 */
export type VerificationStatus = 'verified' | 'unverified';

export interface DestinationSource {
  id: string;
  title: string;
  url: string;
  sourceType: SourceType;
  note?: string;
}

export interface DestinationImage {
  id: string;
  imageUrl: string;
  caption?: string;
  source?: string;
}

export interface TimelineEvent {
  /** e.g. "c. 950 CE" */
  period: string;
  title: string;
  detail: string;
  /** True when the date is an estimate or scholarly debate exists. */
  approximate?: boolean;
}

export interface ArchitectureNote {
  heading: string;
  body: string;
}

export interface Destination {
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
  /** Secondary categories used by the discovery facets. */
  alsoCategories: Category[];
  historicalPeriod: HistoricalPeriod;
  imageUrl: string;
  /** Every destination is labelled as verified or demo data. */
  verification: VerificationStatus;
  featured: boolean;
  unescoYear?: number;
  /** UNESCO World Heritage List reference number, when inscribed. */
  unescoListId?: number;
  /** 1..5 editorial rating used for sorting, not user reviews. */
  significanceScore: number;
  bestSeason: string;
  openingHours: string;
  entryInformation: string;
  visitDurationMinutes: number;
  nearbyAttractions: string[];
  architecture: ArchitectureNote[];
  timeline: TimelineEvent[];
  sources: DestinationSource[];
  images: DestinationImage[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Auth + user                                                        */
/* ------------------------------------------------------------------ */

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

export interface AppUser extends Profile {
  /** Present only in local demo mode. Never in production. */
  password?: string;
}

/* ------------------------------------------------------------------ */
/* Trips                                                              */
/* ------------------------------------------------------------------ */

export interface Trip {
  id: string;
  userId: string;
  name: string;
  startLocation: string;
  /** Optional explicit destination summary for the trip as a whole. */
  destinationSummary: string | null;
  startDate: string;
  endDate: string;
  travelers: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripStop {
  id: string;
  tripId: string;
  destinationId: string;
  visitDate: string | null;
  orderIndex: number;
  notes: string | null;
  /** Times of day, keyed by itinerary entry id. Empty when unassigned. */
  startTime: string | null;
  endTime: string | null;
  activity: string | null;
}

export interface TripWithStops extends Trip {
  stops: (TripStop & { destination: Destination })[];
}

/* ------------------------------------------------------------------ */
/* User activity                                                      */
/* ------------------------------------------------------------------ */

export type ActivityType = 'view' | 'save' | 'unsave' | 'trip_add' | 'trip_remove' | 'trip_create';

export interface UserActivity {
  id: string;
  userId: string;
  destinationId: string | null;
  activityType: ActivityType;
  createdAt: string;
}

export interface SavedDestination {
  id: string;
  userId: string;
  destinationId: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Search                                                             */
/* ------------------------------------------------------------------ */

export type SearchEntityKind = 'destination' | 'city' | 'state' | 'period' | 'person' | 'dynasty' | 'category';

export interface SearchSuggestion {
  id: string;
  kind: SearchEntityKind;
  label: string;
  sublabel: string;
  href: string;
  destinationId?: string;
}

export interface DestinationFilters {
  categories: Category[];
  states: string[];
  periods: HistoricalPeriod[];
  query: string;
  savedOnly: boolean;
  sort: SortOption;
}

export type SortOption =
  | 'relevance'
  | 'significance'
  | 'name-asc'
  | 'name-desc'
  | 'oldest';

/* ------------------------------------------------------------------ */
/* Admin                                                              */
/* ------------------------------------------------------------------ */

export type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export interface ContentReport {
  id: string;
  destinationId: string | null;
  destinationName: string;
  reporterEmail: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
}
