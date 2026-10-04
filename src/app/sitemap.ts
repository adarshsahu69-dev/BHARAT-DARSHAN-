import type { MetadataRoute } from 'next';
import { DESTINATIONS, getAllSlugs } from '@/data/destinations';
import { HISTORICAL_PERIOD_META } from '@/data/timeline';
import { CATEGORIES } from '@/lib/types';
import { appConfig } from '@/lib/config';

/**
 * Sitemap.
 *
 * Only public, indexable routes appear. Anything per-user (dashboard, trips,
 * admin) and anything noindex (auth pages, search) is deliberately excluded —
 * a sitemap that lists noindex URLs is a contradiction.
 *
 * `force-static` is required: the site is exported with `output: 'export'`, and
 * this route is built from data known at build time, so it must be written to
 * `sitemap.xml` as a file instead of rendered per request.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-01-15T00:00:00.000Z');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appConfig.url, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${appConfig.url}/destinations`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${appConfig.url}/explore`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    {
      url: `${appConfig.url}/historical-places`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: `${appConfig.url}/map`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appConfig.url}/timeline`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${appConfig.url}/about`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const destinationRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${appConfig.url}/destinations/${slug}`,
    lastModified: DESTINATIONS.find((d) => d.slug === slug)?.updatedAt
      ? new Date(DESTINATIONS.find((d) => d.slug === slug)!.updatedAt)
      : lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Category landings are real, indexable pages built from the query string.
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${appConfig.url}/destinations?category=${encodeURIComponent(category)}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const periodRoutes: MetadataRoute.Sitemap = HISTORICAL_PERIOD_META.map((period) => ({
    url: `${appConfig.url}/timeline/${period.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...destinationRoutes, ...categoryRoutes, ...periodRoutes];
}
