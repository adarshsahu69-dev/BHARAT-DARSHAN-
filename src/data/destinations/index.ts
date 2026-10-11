import { MADHYA_PRADESH_DESTINATIONS } from './madhya-pradesh';
import { commonsImage } from '../commons-images';
import type { Category, Destination } from '@/lib/types';

/**
 * The catalogue.
 *
 * The site is scoped to Madhya Pradesh only, so the catalogue is composed from
 * the state's section alone. The regional seed files (north, south and west
 * India) are deliberately excluded — to bring a region back, import its list
 * here and add it to the spread. Every in-app surface (facets, search, map,
 * sitemap, prerendered routes) derives from this array, so nothing else has
 * to change.
 *
 * Every record here is a *draft* (`verification: 'unverified'`) until an editor
 * has checked it against the sources it cites. The UI labels these records
 * explicitly; nothing here is presented as an authenticated account of a
 * monument.
 */
export const DESTINATIONS: Destination[] = [...MADHYA_PRADESH_DESTINATIONS];

/* ------------------------------------------------------------------ */
/* Derived indexes                                                     */
/* ------------------------------------------------------------------ */

const bySlug = new Map(DESTINATIONS.map((d) => [d.slug, d]));
const byId = new Map(DESTINATIONS.map((d) => [d.id, d]));

export function getDestinationBySlug(slug: string): Destination | null {
  return bySlug.get(slug) ?? null;
}

export function getDestinationById(id: string): Destination | null {
  return byId.get(id) ?? null;
}

export function getDestinationsByIds(ids: string[]): Destination[] {
  return ids.map((id) => byId.get(id)).filter((d): d is Destination => Boolean(d));
}

export function getAllSlugs(): string[] {
  return DESTINATIONS.map((d) => d.slug);
}

/** All categories present on a destination, primary first. */
export function categoriesOf(destination: Destination): Category[] {
  return [destination.category, ...destination.alsoCategories];
}

export const ALL_STATES: string[] = Array.from(new Set(DESTINATIONS.map((d) => d.state))).sort();

export const ALL_CITIES: string[] = Array.from(new Set(DESTINATIONS.map((d) => d.city))).sort();

export const FEATURED_DESTINATIONS: Destination[] = DESTINATIONS.filter((d) => d.featured);

export const UNESCO_DESTINATIONS: Destination[] = DESTINATIONS.filter((d) => d.unescoYear);

export function destinationsByCategory(category: Category): Destination[] {
  return DESTINATIONS.filter((d) => categoriesOf(d).includes(category));
}

export function destinationsByState(state: string): Destination[] {
  return DESTINATIONS.filter((d) => d.state === state);
}

/* ------------------------------------------------------------------ */
/* Category metadata                                                   */
/* ------------------------------------------------------------------ */

export interface CategoryMeta {
  name: Category;
  slug: string;
  description: string;
  /** Commons filename backing the card image, for attribution. */
  imageFile: string | null;
  /** Resolved thumbnail URL, or null if the file is not in the manifest. */
  imageUrl: string | null;
  /** Lucide icon name resolved by `CategoryCard`. */
  icon: string;
}

export const CATEGORY_META: CategoryMeta[] = (
  [
    {
      name: 'Ancient India',
      slug: 'ancient-india',
      description: 'Sites of the early historic period, from the Mauryas to the Satavahanas.',
      imageFile: 'Great Sanchi Stupa (3).jpg',
      icon: 'Landmark',
    },
    {
      name: 'Forts & Palaces',
      slug: 'forts-palaces',
      description: 'Defensive works and courtly residences across a thousand years of dynasties.',
      imageFile: 'Gwalior fort view 003 (15).jpg',
      icon: 'Castle',
    },
    {
      name: 'Temples',
      slug: 'temples',
      description: 'Hindu temple architecture from the Chandela period to the Nayaks.',
      imageFile: 'Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg',
      icon: 'Sparkles',
    },
    {
      name: 'UNESCO Heritage',
      slug: 'unesco-heritage',
      description: 'Sites inscribed on the UNESCO World Heritage List.',
      imageFile: 'Khajuraho Dulhadeo 2010.jpg',
      icon: 'Award',
    },
    {
      name: 'Museums',
      slug: 'museums',
      description: 'Collections that hold the material record of the subcontinent.',
      imageFile: 'India national museum 01.jpg',
      icon: 'Building2',
    },
    {
      name: 'Buddhist Sites',
      slug: 'buddhist-sites',
      description: 'Monasteries, stupas and caves of the Buddhist traditions of South Asia.',
      imageFile: 'Sanchi Stupa No 3.jpg',
      icon: 'Flower2',
    },
    {
      name: 'Historical Cities',
      slug: 'historical-cities',
      description: 'Living cities with continuous occupation and monumental cores.',
      imageFile: 'Gwalior fort view 003 (4).jpg',
      icon: 'Home',
    },
    {
      name: 'Archaeological Sites',
      slug: 'archaeological-sites',
      description: 'Excavated settlements, ruins and monuments under protection.',
      imageFile: 'Stupa 1, Sanchi 02.jpg',
      icon: 'Layers',
    },
    {
      name: 'Natural Heritage',
      slug: 'natural-heritage',
      description: 'Landscapes and habitats of outstanding natural value.',
      imageFile: 'Keoladeo National Park - Bharatpur 116 (409164014).jpg',
      icon: 'Trees',
    },
    {
      name: 'Cultural Festivals',
      slug: 'cultural-festivals',
      description: "Seasonal gatherings that carry a place's traditions into the present.",
      imageFile: 'Diwali Celebration 03.jpg',
      icon: 'PartyPopper',
    },
    {
      name: 'Beaches',
      slug: 'beaches',
      description: 'Coastal destinations, from the temple shore to the Arabian Sea.',
      imageFile: 'Palolem Beach, South Goa.jpg',
      icon: 'Waves',
    },
    {
      name: 'Mountains',
      slug: 'mountains',
      description: 'Hill stations, high passes and the forts built above them.',
      imageFile: 'Panorama showing Alpenglow on Himalayan Peaks.jpg',
      icon: 'Mountain',
    },
    {
      name: 'Wildlife',
      slug: 'wildlife',
      description: 'Sanctuaries and reserves with conservation significance.',
      imageFile: 'Bengal tiger (Panthera tigris tigris) female 3.jpg',
      icon: 'PawPrint',
    },
    {
      name: 'Hidden Gems',
      slug: 'hidden-gems',
      description: 'Places of real interest that receive comparatively few visitors.',
      imageFile: 'Shantinath Jain Temple, Khajuraho India.JPG',
      icon: 'Compass',
    },
  ] as const satisfies readonly (Omit<CategoryMeta, 'imageUrl'> & { name: Category })[]
).map((c) => ({ ...c, imageUrl: c.imageFile ? commonsImage(c.imageFile) : null }));

export function getCategoryMeta(name: Category): CategoryMeta {
  return (
    CATEGORY_META.find((c) => c.name === name) ?? {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: '',
      imageFile: null,
      imageUrl: null,
      icon: 'Landmark',
    }
  );
}

/* ------------------------------------------------------------------ */
/* Hero media                                                          */
/* ------------------------------------------------------------------ */

/** Wide hero image for the homepage. Verified Wikimedia Commons file. */
export const HERO_IMAGE: string | null = commonsImage(
  'Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg',
);

export const HERO_IMAGE_CREDIT: string =
  '“Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg” on Wikimedia Commons';
export const HERO_IMAGE_CREDIT_URL: string =
  'https://commons.wikimedia.org/wiki/File:Kandariya_Mahadeva_Temple,_Khajuraho,_Madhya_Pradesh.jpg';

/** Rotating images for the hero crossfade, all verified Commons files. */
export const HERO_SLIDES: { url: string; credit: string; creditUrl: string; alt: string }[] = [
  {
    url: commonsImage('Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg') ?? '',
    credit: '“Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg” on Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Kandariya_Mahadeva_Temple,_Khajuraho,_Madhya_Pradesh.jpg',
    alt: 'Kandariya Mahadeva temple at Khajuraho, Madhya Pradesh, the tallest of the Chandela temples.',
  },
  {
    url: commonsImage('Great Sanchi Stupa (3).jpg') ?? '',
    credit: '“Great Sanchi Stupa (3).jpg” on Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Great_Sanchi_Stupa_(3).jpg',
    alt: 'The Great Stupa at Sanchi, Madhya Pradesh, begun under Ashoka and enlarged by later dynasties.',
  },
  {
    url: commonsImage('Gwalior fort view 003 (15).jpg') ?? '',
    credit: '“Gwalior fort view 003 (15).jpg” on Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Gwalior_fort_view_003_(15).jpg',
    alt: 'Gwalior Fort, Madhya Pradesh, seen across the Tamas river plain from the southern approach.',
  },
  {
    url: commonsImage('Stupa 1, Sanchi 02.jpg') ?? '',
    credit: '“Stupa 1, Sanchi 02.jpg” on Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Stupa_1,_Sanchi_02.jpg',
    alt: 'The western torana of the Great Stupa at Sanchi, carved in the second century BCE.',
  },
].filter((s) => s.url.length > 0);
