-- MatheHeldin — Supabase Schema
-- Dieses SQL im Supabase Dashboard unter "SQL Editor" ausführen.

-- 1. Tabellen erstellen

create table if not exists public.profiles (
  sync_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id integer,
  name text not null,
  avatar text not null default '🦊',
  avatar_config jsonb,
  farbe text not null default 'teal',
  erstellt_am bigint not null,
  updated_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

create table if not exists public.sessions (
  sync_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id integer,
  profile_sync_id uuid references public.profiles(sync_id) on delete cascade,
  stufe_id text not null,
  gestartet_am bigint not null,
  beendet_am bigint,
  updated_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

create table if not exists public.antworten (
  sync_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id integer,
  session_sync_id uuid references public.sessions(sync_id) on delete set null,
  profile_sync_id uuid references public.profiles(sync_id) on delete cascade,
  stufe_id text not null,
  aufgabe_id text not null,
  aufgabe_snapshot text,
  antwort text not null,
  richtig boolean not null,
  dauer_ms integer not null,
  tipp_benutzt boolean not null default false,
  tipp_stufe integer not null default 0,
  erstellt_am bigint not null,
  updated_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

-- 2. Indizes

create index if not exists idx_profiles_user on public.profiles(user_id);
create index if not exists idx_sessions_user on public.sessions(user_id);
create index if not exists idx_antworten_user on public.antworten(user_id);
create index if not exists idx_antworten_profile on public.antworten(profile_sync_id, stufe_id);

-- 3. Row Level Security (RLS)

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.antworten enable row level security;

-- Jeder User sieht nur seine eigenen Daten
create policy "Users see own profiles" on public.profiles
  for all using (auth.uid() = user_id);

create policy "Users see own sessions" on public.sessions
  for all using (auth.uid() = user_id);

create policy "Users see own antworten" on public.antworten
  for all using (auth.uid() = user_id);

-- 4. Einstellungen (Zustand-Stores als JSON-Blob)

create table if not exists public.einstellungen (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

alter table public.einstellungen enable row level security;

create policy "Users see own einstellungen" on public.einstellungen
  for all using (auth.uid() = user_id);
