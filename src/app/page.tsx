import type { Metadata } from 'next';
import { Hero } from '@/components/home/hero';
import {
  CategorySection,
  ExploreIndiaSection,
  MapPreviewSection,
  PopularDestinationsSection,
  TimelineSection,
} from '@/components/home/sections';
import {
  CallToAction,
  CulturalDiscoveriesSection,
  FeaturedHeritageSection,
  PlanJourneySection,
  StatsStrip,
} from '@/components/home/plan-and-cta';
import { appConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: `${appConfig.name} — ${appConfig.tagline}`,
  description: appConfig.description,
  alternates: { canonical: appConfig.url },
};

/**
 * Homepage section order is fixed by the product brief:
 * 1 navigation (in the root layout)
 * 2 hero + search
 * 3 explore India
 * 4 popular destinations
 * 5 explore by category
 * 6 historical timeline
 * 7 interactive India map
 * 8 plan your journey
 * 9 featured heritage sites
 * 10 cultural discoveries
 * 11 call to action
 * 12 footer (in the root layout)
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Section 2.5: at-a-glance figures, so the hero is followed by substance. */}
      <StatsStrip />

      <ExploreIndiaSection />
      <PopularDestinationsSection />
      <CategorySection />
      <TimelineSection />
      <MapPreviewSection />
      <PlanJourneySection />
      <FeaturedHeritageSection />
      <CulturalDiscoveriesSection />
      <CallToAction />
    </>
  );
}
