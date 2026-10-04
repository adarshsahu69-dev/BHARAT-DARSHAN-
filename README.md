# Bharat Darshan

**Discover India's Stories, One Destination at a Time.**

A travel discovery platform, historical reference and trip planner for India's
heritage sites. Built with Next.js, TypeScript, Tailwind and Supabase.

The thing that distinguishes it from a travel blog: **every historical claim is
attached to a source, and the parts of the dating that scholars still argue
about are labelled as such.** A record nobody has reviewed says so, on the page,
in a banner you cannot miss.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional — see "Configuration" below
npm run dev
```

Open <http://localhost:3000>.

**No configuration is required.** With no environment variables set the app runs
in demo mode: browsing, search, the map, Google Maps directions and the trip
planner all work, and accounts and trips are stored in the visitor's own
browser. A banner at the top of every page says so.

Two pre-seeded demo accounts let you look at both sides of the product:

| Role       | Email                        | Password        |
| ---------- | ---------------------------- | --------------- |
| Traveller  | `traveller@bharatdarshan.demo` | `traveller1234` |
| Admin      | `admin@bharatdarshan.demo`     | `admin1234`     |

| Command                | Purpose                            |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Development server                 |
| `npm run build`        | Production build                   |
| `npm start`            | Serve the production build         |
| `npm run typecheck`    | `tsc --noEmit`                     |
| `npm run lint`         | ESLint (flat config)             |

---

## Configuration

Copy `.env.example` to `.env.local`. Everything is optional.

### Supabase — real accounts and a real database

Set these two and the app switches from demo mode to Supabase Auth + Postgres:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon key>"
```

Then apply the schema:

```bash
supabase db push          # or paste supabase/migrations/0001_init.sql into the SQL editor
```

That migration creates nine tables, 23 indexes, row-level-security policies on
every table, and the trigger that mirrors `auth.users` into `public.profiles`.

Finally, promote yourself to administrator — deliberately by hand, because no
policy lets a user set their own role:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

`SUPABASE_SERVICE_ROLE_KEY` is optional and **server-only**. It is read in
`src/lib/supabase/service-role.ts`, which is marked `server-only` so that a
client import is a build error rather than a leaked credential. The service role
bypasses RLS, so every call through it needs its own authorisation check.

### Google Maps — no key needed for the useful parts

Directions, routes and turn-by-turn navigation use Google's documented URL
schemes, which take **no API key and no billing account**. They work today, with
the app unconfigured. The "Navigate" button hands off to the device's navigation
app on Android and falls back to the Google Maps route elsewhere.

A key is only needed for richer embeds:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""   # client key — MUST be referrer-restricted
GOOGLE_MAPS_SERVER_KEY=""            # server-only, for Geocoding
```

---

## Architecture

```
src/
├── app/                     # App Router routes (50 prerendered pages)
│   ├── destinations/[slug]/ # one page per record, generateStaticParams
│   ├── timeline/[period]/   # one page per historical period
│   ├── trip-planner/        # trip list, and trips/view?trip=<id> itinerary
│   ├── dashboard/           # saved places, trips, profile
│   ├── admin/               # role-gated content management
│   ├── auth/callback/       # OAuth and email-confirmation landing (a page,
│   │                         #   not a route handler: the site is a static export)
│   ├── sitemap.ts robots.ts error.tsx global-error.tsx not-found.tsx
│
├── components/
│   ├── home/                # hero and the eleven homepage sections
│   ├── destination/         # card, detail page, save button
│   ├── discovery/           # filters, browser, pagination
│   ├── search/              # search bar with fuzzy suggestions
│   ├── map/                 # Leaflet map, India map page, directions
│   ├── trip/                # planner, itinerary builder, add-to-trip
│   ├── timeline/            # interactive period explorer
│   ├── auth/                # login, signup, reset, profile menu
│   ├── admin/               # admin panel tabs
│   ├── layout/              # navbar, footer, mobile nav
│   └── ui/                  # modal, toast, skeletons, empty/error states
│
├── data/
│   ├── destinations/        # 23 curated records, split by region
│   ├── commons-images.ts    # 96 verified Wikimedia Commons URLs
│   ├── seed-builders.ts     # provenance-first record builder
│   └── timeline.ts          # periods, dynasties, rulers, concepts
│
├── lib/
│   ├── config.ts            # every integration resolved in one place
│   ├── types.ts             # domain types, mirroring the SQL schema
│   ├── auth/                # AuthClient interface, Supabase + demo impls
│   ├── supabase/            # browser client, service-role
│   ├── store/user-data.ts   # saved places, trips, activity
│   ├── maps/google-maps.ts  # URL-scheme directions and navigation
│   ├── search/              # weighted field scoring and fuzzy matching
│   ├── discovery/           # filter, sort, paginate
│   ├── seo/                 # JSON-LD builders, metadata helpers
│   ├── routes.ts            # itineraryHref(), the one place a trip URL is built
│   └── utils.ts             # dates, geo, formatting, fuzzy scoring
```

There is no `middleware.ts`: GitHub Pages runs no middleware. The browser
Supabase client keeps the session fresh on its own, and Row Level Security — not
middleware — is what authorises a request.

### The integration layer

`AuthClient` is one interface with two implementations:

- `supabase-auth.ts` — email/password, Google OAuth, email verification,
  password reset. **Not loaded at all unless Supabase is configured.**
- `demo-auth.ts` — browser-only accounts, clearly labelled, used when it isn't.

`src/lib/store/user-data.ts` does the same for data: real Supabase queries when
configured, browser storage otherwise. Nothing above this layer knows which one
it is talking to.

The app never fakes an integration. If Supabase is absent, the banner says so;
if a map fails to load, the map says so; if a report cannot be written to a
database that does not exist, the admin panel says that instead of pretending.

### Why Leaflet, and Google Maps for the actions

The map is **Leaflet + OpenStreetMap** because it needs no API key, no billing
account and no domain registration — so it is the primary map rather than a
fallback. The *actions* (directions, route, navigation) go to **Google Maps**,
because that is where live traffic and turn-by-turn directions actually live.
Neither choice requires a key to ship.

---

## The content

23 destination records across 10 states, each with an overview, a historical
narrative, a dated timeline, notes on architecture and culture, coordinates,
visitor information, and its sources.

- **Every image is a real, working URL.** All 96 were resolved through the
  Wikimedia Commons API and individually verified to return HTTP 200. Each
  record links to its file's Commons description page for the licence and author.
- **UNESCO inscription years and list references come from the official World
  Heritage List**, not from memory.
- **Contested dates are flagged.** Timeline events carry an `approximate` flag
  where the dating is a scholarly estimate or is debated. Period boundaries are
  described as conventions, because they are.
- **Visitor logistics are never presented as permanent.** Opening hours, entry
  fees and festival dates change; every panel names the body that sets it and
  says to confirm before travelling.
- **All 23 records are currently marked `unverified`** — that is, editorial
  drafts pending review against their cited sources. The UI says so on every
  page. Promote a record to `verified` in the admin panel once a human has
  checked it. This is the honest default, and it is deliberate.

---

## Security

- **Row Level Security on all nine tables.** Policies are the authorisation
  boundary, not the application code. `saved_destinations`, `trips`,
  `trip_destinations` and `user_activity` have no `anon` policy at all, so an
  unauthenticated request matches nothing. `FORCE ROW LEVEL SECURITY` closes the
  table-owner escape hatch.
- **Users cannot promote themselves.** The profile update policy pins `role` to
  the caller's current role; only an admin can change it.
- **Trip stops inherit the trip's ownership.** Access is checked via
  `owns_trip()`, so a user cannot attach a stop to someone else's itinerary by
  guessing an id.
- **Service role is confined** to a `server-only` module and referenced nowhere
  else. The client bundle contains no credential values and no reference to the
  variable name.
- **Redirect parameters are validated.** `safeNextPath()` rejects absolute URLs
  and `//` prefixes on the login callback and post-auth redirect.
- **Validation is shared** between client and API routes, so the two cannot
  disagree about what is acceptable. Demo-mode sign-in runs a hash comparison even
  for unknown accounts so the two paths take comparable time.
- **Security headers** (`X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy`) are set for every route.
- **Rate limiting** is available in `lib/config.ts` (`rateLimit()`) for auth
  endpoints. It is in-process, so on serverless it is per-instance; a real
  deployment should put a limit in front of Supabase Auth.

### Known limitations, stated plainly

- **Demo mode is not a security boundary.** The `role` field in the browser is
  client-held, and the admin panel's check is a convenience. The banner on the
  admin page says this. With Supabase configured, the RLS policies are the real
  boundary.
- **Demo passwords use SHA-256, not a password KDF.** Web Crypto has no
  Argon2 or bcrypt. The hash keeps plaintext out of storage; it does not resist a
  determined attacker with the localStorage contents. Supabase uses proper
  password hashing (bcrypt) when configured.
- **Route distances are estimates.** Straight-line distance with a fixed road
  factor, labelled as an estimate everywhere it appears. Google Maps has the real
  routed distance and live traffic.
- **Trip dates accept any past or future date.** Range validation exists
  client-side; the SQL `CHECK` constraint is the backstop.

---

## Accessibility

- Semantic landmarks, a skip link, and one `h1` per page.
- Full keyboard operability, including the itinerary: drag-and-drop has
  focusable "move earlier" / "move later" equivalents, because drag-and-drop
  alone is unusable without a pointer.
- Focus is trapped in dialogs, Escape closes them, and focus returns to the
  trigger.
- `aria-live` regions announce search-result counts and save outcomes.
- Form errors use `role="alert"` and are wired with `aria-invalid` and
  `aria-describedby`.
- Icon-only controls have accessible names; decorative SVG is `aria-hidden`.
- The map exposes `role="application"` with a descriptive label, and every
  destination is also reachable as a list, for anyone not using it.
- Zoom is not disabled. Colour pairs meet WCAG AA.

## Performance

- Destination pages are prerendered at build time via `generateStaticParams`;
  the homepage is static. 50 pages, ~103 kB shared JS.
- Leaflet is dynamically imported with `ssr: false`, so it never reaches routes
  that do not show a map.
- Images go through `next/image` with AVIF/WebP, responsive `sizes`, and lazy
  loading below the fold.
- The search index is built once and memoised, with fields pre-normalised so a
  keystroke does not re-fold Unicode across the corpus. Input is debounced at
  180 ms and scoring is wrapped in `useDeferredValue`.
- Destination discovery filters before paginating, so page one always reflects
  the active facets, and results are capped at 12 per page.

## SEO

Per-destination titles, descriptions, canonical URLs, Open Graph and Twitter
cards, keywords, and `TouristAttraction` + `WebPage` + `BreadcrumbList` JSON-LD
with coordinates and a `PostalAddress`. `sitemap.xml` covers the static routes,
all 23 destinations, category landings and every timeline period; `robots.txt`
excludes the per-user and admin surface. Anything `noindex` is deliberately kept
out of the sitemap, because the two would otherwise contradict each other.

---

## Deploying

The site is a **static export** (`output: 'export'` in `next.config.mjs`) because
it is published to GitHub Pages, which serves files and runs no server. Everything
is prerendered at build time; the browser does the rest.

`.github/workflows/nextjs.yml` builds and publishes it. The workflow uses
`actions/configure-pages` to inject the Pages `basePath`, which is why the config
is `next.config.mjs`: the action only patches `.js`, `.cjs` and `.mjs`, and with a
`next.config.ts` it would silently create a blank `next.config.js` that Next then
loads in preference to the TypeScript one. The committed config must be the file
that builds the deployed site.

What a static host rules out, and where it went instead:

| Not available on Pages | What the app does now |
| --- | --- |
| Middleware | Removed. The browser Supabase client refreshes the session itself; RLS is unaffected. |
| Route handlers | `/auth/callback` is a prerendered page that completes the PKCE exchange in the browser. |
| Per-request rendering | Filtered and per-user pages are prerendered shells; the existing `Suspense` boundaries show skeletons until the browser renders real content. |
| Per-trip URLs from a dynamic segment | The itinerary is one prerendered page, `/trip-planner/trips/view?trip=<id>`. Trip ids are created in the browser, so no build can know them. Build links with `itineraryHref()` in `src/lib/routes.ts`. |
| Image optimisation | `images.unoptimized` — `next/image` still lays out and lazy-loads, but serves the original image. |
| Security headers | `headers()` is retained for `next dev`; GitHub Pages cannot set response headers, so the deployed site does not get them. |

Two settings are required for real accounts on Pages:

1. `NEXT_PUBLIC_SITE_URL` must be the deployed origin **including the repository
   path**, e.g. `https://<user>.github.io/bharat-darshan`. It is what Google
   OAuth and email confirmation links redirect back to.
2. In Supabase → Authentication → URL Configuration, add
   `<origin>/auth/callback` to the redirect allow-list.

Everything else is optional: with no variables set the app runs in demo mode.

To publish somewhere that does run a server, drop `output: 'export'`,
`trailingSlash` and `images.unoptimized` from `next.config.mjs`; no application
code has to change.

---

## Licence and data provenance

Code: use it as you like.

Content: the historical writing is editorial work for this project. Images are
reused from Wikimedia Commons under the licence stated on each file's
description page, which every record links to — check that licence before reusing
an image. UNESCO inscription data is from the World Heritage List.
