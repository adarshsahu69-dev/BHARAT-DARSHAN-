import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DestinationDetail } from '@/components/destination/destination-detail';
import { getAllSlugs, getDestinationBySlug } from '@/data/destinations';
import { appConfig } from '@/lib/config';
import { buildDestinationJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/structured-data';

/** Pre-renders every destination route at build time. */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return { title: 'Destination not found' };
  }

  const canonical = `${appConfig.url}/destinations/${destination.slug}`;

  return {
    title: `${destination.name}, ${destination.state}`,
    description: `${destination.tagline}. ${destination.description}`.slice(0, 300),
    keywords: [
      destination.name,
      `${destination.name} ${destination.city}`,
      destination.category,
      destination.historicalPeriod,
      destination.state,
      ...destination.tags,
    ].slice(0, 20),
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: `${destination.name} — ${destination.tagline}`,
      description: destination.description.slice(0, 300),
      url: canonical,
      siteName: appConfig.name,
      locale: appConfig.locale,
      images: destination.imageUrl
        ? [{ url: destination.imageUrl, width: 1600, height: 1067, alt: destination.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: destination.name,
      description: destination.tagline,
      images: destination.imageUrl ? [destination.imageUrl] : undefined,
    },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) notFound();

  return (
    <>
      {/*
        JSON-LD is emitted here rather than in a layout so it stays on the page it
        describes. Both blocks are application/ld+json and are ignored by the
        visible layout.
      */}
      <script
        type="application/ld+json"
        // Content is generated from our own data, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildDestinationJsonLd(destination)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: 'Home', href: appConfig.url },
              { name: 'Destinations', href: `${appConfig.url}/destinations` },
              { name: destination.name, href: `${appConfig.url}/destinations/${destination.slug}` },
            ]),
          ),
        }}
      />
      <DestinationDetail destination={destination} />
    </>
  );
}
