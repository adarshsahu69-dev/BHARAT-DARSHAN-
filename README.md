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
| `npm run prisma:deploy` | Apply Prisma migrations (admin panel) |
| `npm run db:seed`      | Create the first admin (admin panel) |

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
prisma/                      # admin panel schema, migrations and seed
src/
├── app/                     # App Router routes (50 prerendered pages)
│   ├── destinations/[slug]/ # one page per record, generateStaticParams
│   ├── timeline/[period]/   # one page per historical period
│   ├── trip-planner/        # trip list, and trips/view?trip=<id> itinerary
│   ├── dashboard/           # saved places, trips, profile
│   ├── api/auth/[...nextauth]/ # NextAuth route handler (admin session)
│   ├── admin/               # role-gated content management
│   ├── auth/callback/       # OAuth and email-confirmation landing (a page,
│   │                         #   not a route handler)
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
│   ├── db.ts                # Prisma client singleton for the admin panel
│   ├── types.ts             # domain types, mirroring the SQL schema
│   ├── auth/                # AuthClient interface, Supabase + demo impls
│   │                         # next-auth.ts (admin Credentials + JWT sessions)
│   ├── supabase/            # browser client, service-role
│   ├── store/user-data.ts   # saved places, trips, activity
│   ├── maps/google-maps.ts  # URL-scheme directions and navigation
│   ├── search/              # weighted field scoring and fuzzy matching
│   ├── discovery/           # filter, sort, paginate
│   ├── seo/                 # JSON-LD builders, metadata helpers
│   ├── routes.ts            # itineraryHref(), the one place a trip URL is built
│   └── utils.ts             # dates, geo, formatting, fuzzy scoring
```

There is no `middleware.ts`: the browser Supabase client keeps the visitor
session fresh on its own, and Row Level Security — not middleware — is what
authorises a request. The `/admin` panel is gated separately, server-side, by
the NextAuth session; see "Admin panel (Prisma + NextAuth)" below.

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

## Admin panel (Prisma + NextAuth)

The admin panel is a second, server-backed half of the same codebase: **Next.js
15 App Router + PostgreSQL through Prisma + NextAuth** (Credentials provider, JWT
sessions, bcrypt password hashing) with **hand-written add/edit/delete forms**.
There is no second app, no second deploy and no second framework.

**Deployment consequence:** the app is **no longer a static GitHub Pages
export**. Prisma, NextAuth and the route handlers need a Node process, so
`output: 'export'` and `trailingSlash` have been removed from
`next.config.mjs`, the image optimiser is switched back on, and
`.github/workflows/nextjs.yml` is a CI pipeline rather than a Pages deployment.
Deploy to any Node host: **Vercel, Render, Railway or Fly.io**.

### Setup, in order

```bash
cp .env.example .env.local       # then set DATABASE_URL and AUTH_SECRET
npm install                      # postinstall runs `prisma generate`
npm run prisma:deploy            # applies prisma/migrations
npm run db:seed                  # creates the first admin (ADMIN_EMAIL / ADMIN_PASSWORD)
npm run dev
```

Then sign in at <http://localhost:3000/admin/login>.

- `DATABASE_URL` points at a **dedicated** Postgres database. Keep it separate
  from the Supabase project above: pointing Prisma at that database would
  collide with the Row Level Security migration tables.
- `AUTH_SECRET` signs the admin session JWTs — generate one with
  `openssl rand -base64 32`. It is required in production.
- The first administrator comes from `ADMIN_EMAIL` and `ADMIN_PASSWORD`; change
  the password after the first login.

### What it manages

| Area | What you can do |
| --- | --- |
| Destinations | Add, edit and delete: name, slug, tagline, overview/description, state, city, latitude, longitude, category, historical period, review status, featured flag, UNESCO inscription year. |
| Users | Browse the user list. |
| Reports | Browse the report list and move a report between statuses. |
| Analytics | Counts and trends computed from the database records, not hardcoded. |

Access control is server-side: `/admin` checks the `ADMIN` role on the session,
and every server action re-checks it. Gating the UI alone is not the boundary.

### Prisma workflow

| Command | Purpose |
| --- | --- |
| `npm run prisma:generate` | Regenerate the client (also runs on `npm install`) |
| `npm run prisma:migrate` | Development: create and apply a new migration |
| `npm run prisma:deploy` | Production: apply the existing `prisma/migrations` |
| `npm run db:seed` | Seed the first administrator from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |

The client is generated from `prisma/schema.prisma`; migrations are applied with
`prisma migrate` so the schema is versioned alongside the code.

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

The app **runs on a Node server**: Prisma, NextAuth and the route handlers need
one. It is deployed to a Node host — Vercel, Render, Railway or Fly.io — not to
a static file host.

`.github/workflows/nextjs.yml` is the CI pipeline: it checks out the repo,
installs with `npm ci` (whose `postinstall` runs `prisma generate`), then runs
`npm run lint`, `npm run typecheck` and `npm run build`. It deploys nothing —
that is the host's job — and it needs no environment variables to pass, because
the app builds in demo mode when nothing is configured.

### Deploy to Render (one-click blueprint)

`render.yaml` in the repository root is a Render Blueprint, so the service can be
created without typing any settings:

1. In Render: **New + → Blueprint** → connect this repository.
2. It prompts for the secret values — paste an **external** Postgres connection
   string for `DATABASE_URL` (Neon or a second Supabase project; Render's own
   managed Postgres is deliberately **not** used, because its free tier expires
   after 90 days), the three Supabase values, and optionally `ADMIN_EMAIL` /
   `ADMIN_PASSWORD`.
3. Deploy, then run **once** in the Render Shell (or locally with `DATABASE_URL`
   exported): `npx prisma migrate deploy && node prisma/seed.mjs`.
4. Attach the custom domain `bharatdarshana.we24.in` in Render → Settings →
   Custom Domains, and keep `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` pointing at it.
   The `CNAME` file in the repo root is a GitHub Pages artifact — Render ignores
   it, and it can be deleted.

The blueprint pins Node 22, builds with `npm ci && npm run build` and starts with
`npm start`. The two URL variables are pre-filled for `bharatdarshana.we24.in` —
change them to `https://bharat-darshan.onrender.com` if you test on the default
Render URL first. Free web services sleep after inactivity, so the first visit
after an idle period is slow.

What a Node host gives the app, and where the constraint used to land:

| Needed a server | What the app does now |
| --- | --- |
| Route handlers | `/api/auth/[...nextauth]` handles the admin session; `/auth/callback` is still a page that completes the PKCE exchange in the browser. |
| Per-request rendering | Filtered and per-user pages render per request where a database is involved; the existing `Suspense` boundaries still show skeletons. |
| Image optimisation | `next/image` optimises again — `images.unoptimized` is gone, `formats` and `remotePatterns` are kept. |
| Security headers | `headers()` in `next.config.mjs` is honoured by the Node host, so the deployed site does receive them. |
| Extensionless URLs | `trailingSlash` is gone; a Node server resolves route URLs itself. |

What you still have to set for real accounts:

1. `NEXT_PUBLIC_SITE_URL` must be the deployed origin, e.g.
   `https://bharat-darshan.example.com`. It is what Google OAuth and email
   confirmation links redirect back to.
2. In Supabase → Authentication → URL Configuration, add
   `<origin>/auth/callback` to the redirect allow-list.

For the admin panel, also set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL` and
`ADMIN_PASSWORD` on the host, and run the migrations and seed as part of the
deploy (`npm run prisma:deploy`, then `npm run db:seed`). See
"Admin panel (Prisma + NextAuth)" above.

Everything else is optional: with no variables set the public site still runs in
demo mode.

---

## Licence and data provenance

Code: use it as you like.

Content: the historical writing is editorial work for this project. Images are
reused from Wikimedia Commons under the licence stated on each file's
description page, which every record links to — check that licence before reusing
an image. UNESCO inscription data is from the World Heritage List.
