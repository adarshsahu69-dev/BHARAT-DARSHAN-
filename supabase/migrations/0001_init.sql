-- =============================================================================
-- Bharat Darshan — database schema
-- =============================================================================
--
-- Apply with:  supabase db push        (or paste into the SQL editor)
--
-- Design notes
-- ------------
-- * Every table has Row Level Security enabled. The policies are the actual
--   authorisation boundary — not the application code, and not the client.
-- * `public.profiles` is the only table a user can read their own row from, and
--   it is mirrored from `auth.users` by a trigger so it cannot drift.
-- * Admin access is expressed as `profiles.role = 'admin'`, checked through a
--   SECURITY DEFINER helper so the policy does not recurse into the profiles
--   table it is reading from.
-- * Foreign keys are ON DELETE CASCADE for a user's own data, and RESTRICT for
--   curated content, so a destination cannot be deleted while a trip still
--   points at it.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Trigram search, for the search engine's substring matching. Supabase puts
-- extensions in their own schema, which may not exist on a bare Postgres, so
-- the schema is created first and the index below is created defensively.
create schema if not exists extensions;
create extension if not exists "pg_trgm" with schema extensions;

-- -----------------------------------------------------------------------------
-- Enumerated types
-- -----------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('user', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type source_type as enum (
    'Archaeological Survey of India',
    'UNESCO',
    'Ministry of Culture',
    'Official tourism',
    'Museum',
    'Government archive',
    'Academic',
    'Other'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type verification_status as enum ('verified', 'unverified');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type activity_type as enum (
    'view', 'save', 'unsave', 'trip_add', 'trip_remove', 'trip_create'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
exception when duplicate_object then null;
end $$;

-- =============================================================================
-- profiles
-- =============================================================================
-- Mirrors auth.users. Application code reads the role from here rather than from
-- user_metadata, so a role change takes effect without a re-login.
-- =============================================================================
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  name           text        not null default '',
  email          text,
  avatar_url     text,
  role           user_role   not null default 'user',
  email_verified boolean     not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint profiles_name_length check (char_length(name) <= 200),
  constraint profiles_avatar_scheme check (
    avatar_url is null or avatar_url ~* '^https?://'
  )
);

comment on table public.profiles is
  'Public profile for each authenticated user, mirrored from auth.users by trigger.';

create index if not exists profiles_email_idx on public.profiles (lower(email));
create index if not exists profiles_role_idx  on public.profiles (role);

-- =============================================================================
-- destinations
-- =============================================================================
-- Curated content. Readable by everyone (including anonymous visitors) so the
-- collection can be browsed and indexed; writable by admins only.
-- =============================================================================
create table if not exists public.destinations (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text        not null unique,
  name                 text        not null,
  tagline              text        not null default '',
  description          text        not null default '',
  historical_description text      not null default '',
  state                text        not null,
  city                 text        not null,
  latitude             double precision not null,
  longitude            double precision not null,
  category             text        not null,
  historical_period    text        not null,
  image_url            text,
  opening_hours        text        not null default '',
  entry_information    text        not null default '',
  best_season          text        not null default '',
  visit_duration_minutes integer   not null default 60,
  unesco_year          smallint,
  unesco_list_id       integer,
  significance_score   smallint    not null default 3,
  featured             boolean     not null default false,
  verification         verification_status not null default 'unverified',
  tags                 text[]      not null default '{}',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  constraint destinations_slug_format  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint destinations_latitude     check (latitude  between  -90 and  90),
  constraint destinations_longitude    check (longitude between -180 and 180),
  constraint destinations_significance check (significance_score between 1 and 5),
  constraint destinations_duration     check (visit_duration_minutes between 5 and 2880),
  constraint destinations_unesco_year   check (unesco_year is null or unesco_year between 1972 and 2100),
  -- A UNESCO year without a list reference cannot be linked to its inscription.
  constraint destinations_unesco_pair   check (unesco_year is null or unesco_list_id is not null)
);

comment on table public.destinations is
  'Curated heritage destination records. Public read; admin write only.';
comment on column public.destinations.verification is
  'unverified = editorial draft, not yet checked against cited sources. The UI labels these.';

-- The filter panel and the map both select and filter on these, so they are
-- indexed rather than relying on sequential scans.
create index if not exists destinations_state_idx     on public.destinations (state);
create index if not exists destinations_city_idx      on public.destinations (city);
create index if not exists destinations_category_idx  on public.destinations (category);
create index if not exists destinations_period_idx    on public.destinations (historical_period);
create index if not exists destinations_featured_idx  on public.destinations (featured) where featured;
create index if not exists destinations_unesco_idx    on public.destinations (unesco_year) where unesco_year is not null;
-- PostGIS is not assumed, so coordinates are indexed as a pair; this still helps
-- the bounding-box pre-filter that a map pan would issue.
create index if not exists destinations_coords_idx    on public.destinations (latitude, longitude);
-- Trigram index for the search engine's LIKE/substring matching.
do $$ begin
  execute 'create index destinations_name_trgm_idx
           on public.destinations using gin (name extensions.gin_trgm_ops)';
exception
  -- Not fatal: the search engine falls back to a scan, which is fine at this
  -- collection size. Better to apply the migration than to fail on it.
  when others then
    raise notice 'Skipped pg_trgm index: %', sqlerrm;
end $$;

-- =============================================================================
-- destination_sources
-- =============================================================================
-- Every historical record carries its provenance. A record with no source row is
-- an editorial failure, and the admin panel surfaces the count.
-- =============================================================================
create table if not exists public.destination_sources (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid        not null references public.destinations (id) on delete cascade,
  title          text        not null,
  url            text        not null,
  source_type    source_type not null default 'Other',
  note           text,
  created_at     timestamptz not null default now(),

  constraint destination_sources_url_scheme check (url ~* '^https?://')
);

create index if not exists destination_sources_destination_idx
  on public.destination_sources (destination_id);
create index if not exists destination_sources_type_idx
  on public.destination_sources (source_type);

-- =============================================================================
-- destination_images
-- =============================================================================
create table if not exists public.destination_images (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations (id) on delete cascade,
  image_url      text not null,
  caption        text,
  source         text,
  -- Position in the gallery; lower sorts first.
  position       smallint not null default 0,
  created_at     timestamptz not null default now(),

  constraint destination_images_url_scheme check (image_url ~* '^https?://')
);

create index if not exists destination_images_destination_idx
  on public.destination_images (destination_id, position);

-- =============================================================================
-- saved_destinations
-- =============================================================================
create table if not exists public.saved_destinations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users (id) on delete cascade,
  destination_id uuid        not null references public.destinations (id) on delete cascade,
  created_at     timestamptz not null default now(),

  -- Makes the bookmark toggle idempotent at the database level.
  constraint saved_destinations_unique unique (user_id, destination_id)
);

create index if not exists saved_destinations_user_idx
  on public.saved_destinations (user_id, created_at desc);
create index if not exists saved_destinations_destination_idx
  on public.saved_destinations (destination_id);

-- =============================================================================
-- trips
-- =============================================================================
create table if not exists public.trips (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users (id) on delete cascade,
  name               text        not null,
  start_location     text        not null default '',
  destination_summary text,
  start_date         date        not null,
  end_date           date        not null,
  travelers          smallint    not null default 1,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint trips_name_length   check (char_length(name) between 3 and 200),
  constraint trips_date_order    check (end_date >= start_date),
  constraint trips_travelers     check (travelers between 1 and 40)
);

create index if not exists trips_user_idx    on public.trips (user_id, start_date desc);
create index if not exists trips_user_dates_idx on public.trips (user_id, start_date, end_date);

-- =============================================================================
-- trip_destinations
-- =============================================================================
-- `order_index` is unique per trip so the itinerary order cannot contain
-- duplicates. The client's reorder routine exploits this: it stages rows into a
-- high range before folding them back, which is only safe because the
-- constraint is per-trip rather than global.
-- =============================================================================
create table if not exists public.trip_destinations (
  id             uuid primary key default gen_random_uuid(),
  trip_id        uuid     not null references public.trips (id) on delete cascade,
  destination_id uuid     not null references public.destinations (id) on delete restrict,
  visit_date     date,
  order_index    integer  not null,
  notes          text,
  start_time     time,
  end_time       time,
  activity       text,
  created_at     timestamptz not null default now(),

  constraint trip_destinations_order_unique unique (trip_id, order_index),
  constraint trip_destinations_time_order   check (end_time is null or start_time is null or end_time >= start_time)
);

create index if not exists trip_destinations_trip_idx
  on public.trip_destinations (trip_id, order_index);
create index if not exists trip_destinations_destination_idx
  on public.trip_destinations (destination_id);
-- "Which trips visit this destination?" — used by the detail page's related list.
create index if not exists trip_destinations_visit_date_idx
  on public.trip_destinations (visit_date) where visit_date is not null;

-- =============================================================================
-- user_activity
-- =============================================================================
create table if not exists public.user_activity (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid          not null references auth.users (id) on delete cascade,
  destination_id uuid          references public.destinations (id) on delete set null,
  activity_type  activity_type not null,
  created_at     timestamptz not null default now()
);

create index if not exists user_activity_user_idx
  on public.user_activity (user_id, created_at desc);
create index if not exists user_activity_destination_idx
  on public.user_activity (destination_id) where destination_id is not null;

-- =============================================================================
-- content_reports
-- =============================================================================
create table if not exists public.content_reports (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid          references public.destinations (id) on delete set null,
  reporter_email text          not null,
  reason         text          not null,
  details        text,
  status         report_status not null default 'open',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint content_reports_email check (reporter_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index if not exists content_reports_status_idx
  on public.content_reports (status, created_at desc);

-- =============================================================================
-- updated_at maintenance
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists destinations_set_updated_at on public.destinations;
create trigger destinations_set_updated_at
  before update on public.destinations
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists content_reports_set_updated_at on public.content_reports;
create trigger content_reports_set_updated_at
  before update on public.content_reports
  for each row execute function public.set_updated_at();

-- =============================================================================
-- profiles mirror trigger
-- =============================================================================
-- Keeps public.profiles in step with auth.users for sign-up, and backfills
-- email_verified on confirmation. SECURITY DEFINER because the function runs as
-- the migration owner and needs to write to auth.users' derived data.
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url, email_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce(new.email_confirmed_at is not null, false)
  )
  on conflict (id) do update
    set email          = excluded.email,
        email_verified = excluded.email_verified,
        updated_at     = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email, email_confirmed_at on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any profile rows that predate this trigger.
insert into public.profiles (id, name, email, email_verified)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'name', split_part(coalesce(u.email, ''), '@', 1)),
  u.email,
  coalesce(u.email_confirmed_at is not null, false)
from auth.users u
on conflict (id) do nothing;

-- =============================================================================
-- Role helper
-- =============================================================================
-- SECURITY DEFINER, and `stable`, so a policy can ask "is this user an admin?"
-- without recursing into public.profiles (which would otherwise trigger the
-- profiles SELECT policy from inside the destinations policy).
-- =============================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- The caller's own role. SECURITY DEFINER for the same reason as is_admin(): a
-- policy that read `role` from public.profiles directly would re-enter the
-- profiles SELECT policy and recurse.
create or replace function public.current_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

revoke all on function public.current_role() from public;
grant execute on function public.current_role() to authenticated;

-- Helper used by the trip policies: does this user own the trip?
create or replace function public.owns_trip(target_trip_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.trips
    where id = target_trip_id
      and user_id = (select auth.uid())
  );
$$;

revoke all on function public.owns_trip(uuid) from public;
grant execute on function public.owns_trip(uuid) to authenticated;

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles             enable row level security;
alter table public.destinations         enable row level security;
alter table public.destination_sources  enable row level security;
alter table public.destination_images   enable row level security;
alter table public.saved_destinations   enable row level security;
alter table public.trips                enable row level security;
alter table public.trip_destinations    enable row level security;
alter table public.user_activity        enable row level security;
alter table public.content_reports      enable row level security;

-- Force RLS even for the table owner, so a mistake in a server function cannot
-- quietly bypass the policies.
alter table public.profiles            force row level security;
alter table public.saved_destinations  force row level security;
alter table public.trips               force row level security;
alter table public.trip_destinations   force row level security;
alter table public.user_activity       force row level security;

-- ------------------------------- profiles -----------------------------------
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()));

-- A user may change their own name and avatar, but not their own role: the
-- `role` equality check is what stops privilege escalation through a direct
-- UPDATE. Admins are exempt, since promoting a user is their job.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or public.is_admin())
  with check (
    (id = (select auth.uid()) and role = public.current_role())
    or public.is_admin()
  );

-- ------------------------------ destinations --------------------------------
drop policy if exists destinations_public_read on public.destinations;
create policy destinations_public_read on public.destinations
  for select to anon, authenticated
  using (true);

drop policy if exists destinations_admin_write on public.destinations;
create policy destinations_admin_write on public.destinations
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------- destination_sources -----------------------------
drop policy if exists destination_sources_public_read on public.destination_sources;
create policy destination_sources_public_read on public.destination_sources
  for select to anon, authenticated
  using (true);

drop policy if exists destination_sources_admin_write on public.destination_sources;
create policy destination_sources_admin_write on public.destination_sources
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -------------------------- destination_images ------------------------------
drop policy if exists destination_images_public_read on public.destination_images;
create policy destination_images_public_read on public.destination_images
  for select to anon, authenticated
  using (true);

drop policy if exists destination_images_admin_write on public.destination_images;
create policy destination_images_admin_write on public.destination_images
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -------------------------- saved_destinations ------------------------------
-- No anon policy at all: an unauthenticated request simply matches nothing.
drop policy if exists saved_destinations_own on public.saved_destinations;
create policy saved_destinations_own on public.saved_destinations
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- --------------------------------- trips -------------------------------------
drop policy if exists trips_own on public.trips;
create policy trips_own on public.trips
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- --------------------------- trip_destinations ------------------------------
-- Access follows the parent trip, so a user cannot attach a stop to somebody
-- else's itinerary even if they guess a trip id.
drop policy if exists trip_destinations_own on public.trip_destinations;
create policy trip_destinations_own on public.trip_destinations
  for all to authenticated
  using (public.owns_trip(trip_id))
  with check (public.owns_trip(trip_id));

-- ----------------------------- user_activity --------------------------------
drop policy if exists user_activity_own on public.user_activity;
create policy user_activity_own on public.user_activity
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ---------------------------- content_reports --------------------------------
-- Any signed-in visitor may report a problem, which is the point of the feature.
drop policy if exists content_reports_insert on public.content_reports;
create policy content_reports_insert on public.content_reports
  for insert to authenticated
  with check (true);

-- Only admins read the queue or change a report's status. Reports are private
-- because they contain the reporter's email address.
drop policy if exists content_reports_admin_read on public.content_reports;
create policy content_reports_admin_read on public.content_reports
  for select to authenticated
  using (public.is_admin());

drop policy if exists content_reports_admin_update on public.content_reports;
create policy content_reports_admin_update on public.content_reports
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- Grants
-- =============================================================================
grant usage on schema public to anon, authenticated;
grant select on public.destinations, public.destination_sources, public.destination_images
  to anon, authenticated;

grant select, insert, update, delete on
  public.profiles, public.saved_destinations, public.trips,
  public.trip_destinations, public.user_activity
  to authenticated;

grant select, insert, update, delete on public.destinations,
  public.destination_sources, public.destination_images
  to authenticated;

grant insert, select on public.content_reports to authenticated;

-- Sequences: identity columns are owned by the table, but be explicit for
-- projects created with older Supabase defaults.
grant usage, select on all sequences in schema public to anon, authenticated;

commit;

-- =============================================================================
-- Post-migration: promote the first administrator
-- =============================================================================
-- Role assignment is deliberately not automatic. Run this by hand, once, with
-- the email of the person who should own the site:
--
--   update public.profiles
--      set role = 'admin'
--    where email = 'you@example.com';
--
-- There is no policy that lets a user set their own role, so this has to happen
-- from the SQL editor or the service role — which is the point.
-- =============================================================================
