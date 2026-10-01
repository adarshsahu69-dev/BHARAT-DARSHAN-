import { appConfig } from '@/lib/config';
import type { Destination } from '@/lib/types';

/**
 * schema.org JSON-LD builders.
 *
 * Structured data is used to describe what a page *is* — a tourist attraction at
 * coordinates, within an administrative area — so search engines can surface the
 * right thing. It is deliberately not used to attach unverifiable ratings or
 * review counts to heritage records.
 */

const ORGANISATION_ID = `${appConfig.url}/#organisation`;
const WEBSITE_ID = `${appConfig.url}/#website`;

/** `TouristAttraction` with an `ImageObject`, `Place` and `WebPage` graph. */
export function buildDestinationJsonLd(destination: Destination) {
  const url = `${appConfig.url}/destinations/${destination.slug}`;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'TouristAttraction',
      '@id': `${url}#attraction`,
      name: destination.name,
      alternateName: destination.tagline,
      description: destination.description,
      url,
      ...(destination.imageUrl ? { image: destination.imageUrl } : {}),
      address: {
        '@type': 'PostalAddress',
        addressRegion: destination.state,
        addressLocality: destination.city,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      ...(destination.unescoYear
        ? {
            isPartOf: {
              '@type': 'CreativeWork',
              name: 'UNESCO World Heritage List',
              url: `https://whc.unesco.org/en/list/${destination.unescoListId ?? ''}`,
            },
          }
        : {}),
      subjectOf: destination.sources.map((source) => ({
        '@type': 'CreativeWork',
        name: source.title,
        url: source.url,
      })),
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: destination.name,
      description: destination.description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': `${url}#attraction` },
      primaryImageOfPage: destination.imageUrl
        ? { '@type': 'ImageObject', url: destination.imageUrl }
        : undefined,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: appConfig.url },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Destinations',
          item: `${appConfig.url}/destinations`,
        },
        { '@type': 'ListItem', position: 3, name: destination.name, item: url },
      ],
    },
  ];

  return { '@context': 'https://schema.org', '@graph': graph.filter(Boolean) };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; href: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };
}

export function buildOrganisationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANISATION_ID,
    name: appConfig.name,
    url: appConfig.url,
    description: appConfig.description,
    inLanguage: 'en-IN',
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: appConfig.url,
    name: appConfig.name,
    description: appConfig.description,
    inLanguage: 'en-IN',
    publisher: { '@id': ORGANISATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${appConfig.url}/destinations?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Describes a set of destinations, e.g. a category listing. */
export function buildItemListJsonLd(
  name: string,
  path: string,
  destinations: Destination[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: `${appConfig.url}${path}`,
    numberOfItems: destinations.length,
    itemListElement: destinations.map((destination, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: destination.name,
      url: `${appConfig.url}/destinations/${destination.slug}`,
    })),
  };
}
