import type { MetadataRoute } from 'next';
import { appConfig } from '@/lib/config';

/**
 * robots.txt
 *
 * Disallows the per-user and administrative surface explicitly rather than
 * relying only on the `noindex` meta tag, so crawlers do not spend budget on it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/dashboard',
          '/trip-planner',
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/auth/',
          '/search',
        ],
      },
    ],
    sitemap: `${appConfig.url}/sitemap.xml`,
    host: appConfig.url,
  };
}
