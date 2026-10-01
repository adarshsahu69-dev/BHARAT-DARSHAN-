import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TimelineExplorer } from '@/components/timeline/timeline-explorer';
import { HISTORICAL_PERIOD_META } from '@/data/timeline';
import { appConfig } from '@/lib/config';
import type { HistoricalPeriod } from '@/lib/types';

export function generateStaticParams() {
  return HISTORICAL_PERIOD_META.map((period) => ({
    period: period.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ period: string }>;
}): Promise<Metadata> {
  const { period: slug } = await params;
  const meta = HISTORICAL_PERIOD_META.find(
    (p) => p.id.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug,
  );

  if (!meta) return { title: 'Period not found' };

  return {
    title: `${meta.id} (${meta.range})`,
    description: meta.summary.slice(0, 300),
    alternates: { canonical: `${appConfig.url}/timeline/${slug}` },
    openGraph: {
      title: `${meta.id} — ${meta.range}`,
      description: meta.summary.slice(0, 300),
      url: `${appConfig.url}/timeline/${slug}`,
    },
  };
}

export default async function PeriodPage({ params }: { params: Promise<{ period: string }> }) {
  const { period: slug } = await params;
  const meta = HISTORICAL_PERIOD_META.find(
    (p) => p.id.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug,
  );

  if (!meta) notFound();

  return <TimelineExplorer initialPeriod={meta.id as HistoricalPeriod} />;
}
