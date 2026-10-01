import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Info, MapPinned, Scale, ShieldCheck, TriangleAlert } from 'lucide-react';
import { appConfig } from '@/lib/config';
import { DESTINATIONS } from '@/data/destinations';

export const metadata: Metadata = {
  title: 'About',
  description:
    'What Bharat Darshan is, how its historical content is sourced, what the draft-record labels mean, and which integrations are live.',
  alternates: { canonical: `${appConfig.url}/about` },
};

const SOURCE_TYPES = [
  {
    name: 'Archaeological Survey of India',
    url: 'https://asi.nic.in/',
    what: 'The body responsible for centrally protected monuments. The authoritative source for whether a site is protected, which circle administers it, and the site reports and excavation records.',
  },
  {
    name: 'UNESCO World Heritage List',
    url: 'https://whc.unesco.org/',
    what: 'The inscription record for any site on the World Heritage List, including the year, the criteria used, and the nomination dossier.',
  },
  {
    name: 'Ministry of Culture, Government of India',
    url: 'https://www.indiaculture.gov.in/',
    what: 'Cultural institutions, centrally protected monuments, and national heritage programmes.',
  },
  {
    name: 'Official state tourism departments',
    url: 'https://incredibleindia.gov.in/',
    what: 'Visitor information: opening hours, entry rules, permits and access. These change, so they are never cached as fact here.',
  },
  {
    name: 'Museums and academic collections',
    url: 'https://nationalmuseumindia.gov.in/',
    what: 'Object records and catalogues, and the published scholarship on sculpture, painting and architecture.',
  },
];

export default function AboutPage() {
  const verified = DESTINATIONS.filter((d) => d.verification === 'verified').length;
  const sourceCount = DESTINATIONS.reduce((sum, d) => sum + d.sources.length, 0);

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="max-w-3xl">
        <p className="eyebrow">About</p>
        <h1 className="mt-2 text-display-md font-semibold text-charcoal">
          A travel platform that tells you where its history came from
        </h1>
        <p className="mt-5 text-base leading-relaxed text-charcoal-soft">
          Bharat Darshan combines destination discovery, historical reference and trip planning
          for India&rsquo;s heritage sites. The part that distinguishes it from a travel blog is
          that every historical claim is attached to a source, and the parts of the dating that
          scholars still argue about are labelled as such.
        </p>
      </header>

      {/* What it is */}
      <section className="mt-14" aria-labelledby="about-what">
        <h2 id="about-what" className="text-display-sm font-semibold text-charcoal">
          What this is
        </h2>
        <div className="prose-heritage mt-4 text-base">
          <p>
            The collection currently holds {DESTINATIONS.length} destinations across{' '}
            {new Set(DESTINATIONS.map((d) => d.state)).size} states and union territories, with{' '}
            {sourceCount} cited sources between them. Each record carries an overview, a longer
            historical narrative, a dated timeline, notes on architecture and culture, location
            and coordinates, visitor information, and its sources.
          </p>
          <p>
            Every destination is discoverable four ways: browse and filter, fuzzy search across
            names and dynasties and rulers, an interactive map, and the trip planner. Saved
            places, itineraries and routes are tied to an account.
          </p>
        </div>
      </section>

      {/* Sourcing */}
      <section className="mt-14 scroll-mt-28" id="sources" aria-labelledby="about-sources">
        <h2 id="about-sources" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
          <BookOpen className="h-6 w-6 text-saffron-600" aria-hidden="true" />
          Where the history comes from
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-charcoal-soft">
          Historical content is written against the sources below. The point of listing them is
          that you can check the claim yourself, and see who is responsible for the record.
        </p>

        <ul className="mt-6 space-y-3">
          {SOURCE_TYPES.map((source) => (
            <li key={source.name} className="card p-5">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-maroon-700 underline underline-offset-2 hover:text-maroon-800"
              >
                {source.name}
              </a>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{source.what}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Accuracy */}
      <section className="mt-14 scroll-mt-28" id="accuracy" aria-labelledby="about-accuracy">
        <h2 id="about-accuracy" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
          <Scale className="h-6 w-6 text-saffron-600" aria-hidden="true" />
          How the accuracy labels work
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-saffron-300/70 bg-saffron-50 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-saffron-900">
              <TriangleAlert className="h-4 w-4" aria-hidden="true" />
              Draft record
            </p>
            <p className="mt-2 text-sm leading-relaxed text-saffron-900/85">
              The text has not yet been checked line by line against its cited sources. A banner
              appears at the top of the page saying so, and timeline entries that are estimates
              or contested are individually marked{' '}
              <span className="font-semibold">approximate</span>. {verified} of{' '}
              {DESTINATIONS.length} records currently carry this label.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-saffron-900/85">
              This is the honest default for a record nobody has reviewed yet, rather than a
              claim of authority the project cannot support.
            </p>
          </div>

          <div className="rounded-2xl border border-success-500/30 bg-success-50 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-success-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Sources checked
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
              An editor has verified the record against the sources it cites. The banner is
              removed. This is a claim about the sourcing, not a guarantee that every published
              account of the site is correct — historians disagree.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-sand-200 bg-white p-5 shadow-card">
          <h3 className="text-sm font-semibold text-charcoal">Three rules the content follows</h3>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-charcoal-soft">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" aria-hidden="true" />
              <span>
                <strong className="text-charcoal">Nothing is presented as settled that is not.</strong>{' '}
                Where scholarship is divided — the date of a monument, the identity of a patron,
                the interpretation of a sculpture programme — the record says so and names the
                disagreement.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" aria-hidden="true" />
              <span>
                <strong className="text-charcoal">Period boundaries are labelled as conventions.</strong>{' '}
                &ldquo;Mughal period&rdquo; and &ldquo;Gupta period&rdquo; are scholarly
                periodisations, not exact edges, and different regions were in different phases
                simultaneously. The timeline shows them on a scale and states the caveat.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" aria-hidden="true" />
              <span>
                <strong className="text-charcoal">Logistics are never stated as permanent fact.</strong>{' '}
                Opening hours, entry fees and festival dates change, and festival dates follow
                lunar calendars. Every visitor-information panel names the body that sets it and
                tells you to confirm before travelling.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Integrations */}
      <section className="mt-14" aria-labelledby="about-integrations">
        <h2 id="about-integrations" className="flex items-center gap-2 text-display-sm font-semibold text-charcoal">
          <ShieldCheck className="h-6 w-6 text-saffron-600" aria-hidden="true" />
          Maps, and what is actually connected
        </h2>

        <div className="mt-5 space-y-4">
          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <MapPinned className="h-4 w-4 text-maroon-700" aria-hidden="true" />
              Interactive map — live, no key required
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
              The map is Leaflet with OpenStreetMap tiles. It needs no API key, no billing
              account and no domain registration, which is why it is the default rather than a
              fallback. Tiles are served by the OpenStreetMap Foundation; heavy production use
              should use a dedicated tile provider.
            </p>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <MapPinned className="h-4 w-4 text-maroon-700" aria-hidden="true" />
              Directions and navigation — live via Google Maps
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
              Directions, route and turn-by-turn navigation use Google Maps&rsquo; documented URL
              schemes, which carry no key at all. They are real and work now. The
              &ldquo;Navigate&rdquo; button hands off to the device&rsquo;s navigation app on
              Android, and falls back to the Google Maps route everywhere else.
            </p>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <Info className="h-4 w-4 text-maroon-700" aria-hidden="true" />
              Accounts and database — Supabase, optional
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
              With <code className="rounded bg-sand-100 px-1 py-0.5 font-mono text-xs">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{' '}
              and{' '}
              <code className="rounded bg-sand-100 px-1 py-0.5 font-mono text-xs">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{' '}
              set, accounts, saved places, trips and activity are stored in Postgres with Row
              Level Security, and Google sign-in becomes available. Without them the site runs in
              demo mode with everything in your browser, and says so in a banner on every page.
            </p>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="mt-14" aria-labelledby="about-data">
        <h2 id="about-data" className="text-display-sm font-semibold text-charcoal">
          Data and privacy
        </h2>
        <div className="prose-heritage mt-4 text-base">
          <p>
            In demo mode, this site stores your account, saved destinations, trips and activity
            in your browser&rsquo;s local storage. Nothing is transmitted to a server. Clearing
            site data removes it permanently, and it will not follow you to another browser or
            device.
          </p>
          <p>
            With Supabase configured, your data lives in that project&rsquo;s Postgres database
            under Row Level Security, which restricts every table to its owner. The only
            third-party data ever sent anywhere is when you click through to Google Maps for
            directions — that request goes from your browser straight to Google, and this site is
            not involved in it.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-14 scroll-mt-28" id="contact" aria-labelledby="about-contact">
        <h2 id="about-contact" className="text-display-sm font-semibold text-charcoal">
          Corrections and contributions
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-charcoal-soft">
          If a record here is wrong, the sources are miscited, or a monument you know well is
          missing, that is a bug worth reporting. Include the destination and what the correct
          detail is, with a source if you have one. The reporting form in the admin panel is the
          path this is designed around; without Supabase configured the reports table is not
          writable, so use the project repository instead.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/destinations" className="btn-primary">
            Browse the collection
          </Link>
          <Link href="/about#sources" className="btn-secondary">
            See the source list
          </Link>
        </div>
      </section>
    </div>
  );
}
