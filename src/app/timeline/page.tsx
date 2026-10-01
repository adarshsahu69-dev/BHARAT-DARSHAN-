import type { Metadata } from 'next';
import { TimelineExplorer } from '@/components/timeline/timeline-explorer';
import { appConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Historical timeline',
  description:
    'An interactive timeline of Indian history from ancient India to the present, with the heritage destinations of each period and a note on how firm the dating is.',
  alternates: { canonical: `${appConfig.url}/timeline` },
};

export default function TimelinePage() {
  return <TimelineExplorer />;
}
