-- ============================================================================
-- Grimoire — D&D 3.5e Character Sheet Builder
-- Initial schema: reference/definition content, character graph, live-play
-- layer, homebrew sharing, and Row-Level Security.
-- ============================================================================

create extension if not exists "pgcrypto";

-- Content source: shipped 3.5e reference data vs user homebrew / sourcebook entry.
do $$ begin
  create type content_source as enum ('builtin', 'custom');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Reference / definition content
-- Each table shares the same envelope: a stable id, a source, an owner (null
-- for builtin), a human slug, homebrew pack/version tags, and a `data` JSONB
-- holding the mechanical definition the engine consumes. `data` shapes are
-- validated in the app with Zod (see src/lib/schemas).
-- ----------------------------------------------------------------------------

create table if not exists races (
  id uuid primary key default gen_random_uuid(),
  source content_source not null default 'custom',
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  pack text,
  version integer not null default 1,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  source content_source not null default 'custom',
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  is_prestige boolean not null default false,
  pack text,
  version integer not null default 1,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  source content_source not null default 'custom',
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  key_ability text not null,
  armor_check_penalty boolean not null default false,
  trained_only boolean not null default false,
  pack text,
  version integer not null default 1,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists feats (
  id uuid primary key default gen_random_uuid(),
  source content_source not null default 'custom',
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  feat_type text not null default 'general',
  pack text,
  version integer not null default 1,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists spells (
  id uuid primary key default gen_random_uuid(),
  source content_source not null default 'custom',
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  school text,
  pack text,
  version integer not null default 1,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  source content_source not null default 'custom',
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  item_type text not null default 'gear', -- gear | weapon | armor | shield | magic
  pack text,
  version integer not null default 1,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conditions (
  id uuid primary key default gen_random_uuid(),
  source content_source not null default 'custom',
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Campaigns (optional grouping)
-- ----------------------------------------------------------------------------
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  dm_notes text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Characters
-- Identity + light-play state. Ability scores, ranks, and level increases are
-- JSONB (small, always read together). Classes/inventory/effects/spells/log
-- are child tables so live edits and audit are row-level.
-- ----------------------------------------------------------------------------
create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  campaign_id uuid references campaigns (id) on delete set null,
  name text not null,
  player_name text,
  avatar_url text,
  alignment text,
  deity text,
  size text not null default 'medium',
  age integer,
  gender text,
  height text,
  weight text,
  eyes text,
  hair text,
  skin text,
  experience integer not null default 0,
  race_id uuid references races (id),
  race_snapshot jsonb,             -- resolved race definition at build time
  base_ability_scores jsonb not null default '{"str":10,"dex":10,"con":10,"int":10,"wis":10,"cha":10}'::jsonb,
  ability_level_increases jsonb not null default '{}'::jsonb,
  skill_ranks jsonb not null default '{}'::jsonb,
  -- live HP layer
  hp_damage integer not null default 0,
  hp_nonlethal integer not null default 0,
  hp_temp integer not null default 0,
  -- read-only share link
  share_token uuid unique default gen_random_uuid(),
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists character_classes (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters (id) on delete cascade,
  class_id uuid references classes (id),
  class_snapshot jsonb not null,   -- resolved class definition (progressions, features)
  level integer not null check (level > 0),
  position integer not null default 0, -- order taken (favored-class / 1st-level rules)
  hit_points_rolled integer[]
);

create table if not exists character_feats (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters (id) on delete cascade,
  feat_id uuid references feats (id),
  feat_snapshot jsonb not null,
  source text not null default 'level', -- level | class-bonus | race-bonus
  granted_at_level integer
);

create table if not exists character_spells (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters (id) on delete cascade,
  spell_id uuid references spells (id),
  spell_snapshot jsonb not null,
  class_slug text not null,        -- which casting class this is prepared/known under
  spell_level integer not null,
  known boolean not null default true,
  prepared integer not null default 0,
  is_domain boolean not null default false
);

create table if not exists character_inventory (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters (id) on delete cascade,
  item_id uuid references items (id),
  item_snapshot jsonb not null,
  custom_name text,
  quantity integer not null default 1,
  equipped_slot text,              -- null = carried
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists character_money (
  character_id uuid primary key references characters (id) on delete cascade,
  cp integer not null default 0,
  sp integer not null default 0,
  gp integer not null default 0,
  pp integer not null default 0
);

-- The live-play effect layer: buffs/debuffs/conditions as uniform, reversible rows.
create table if not exists character_effects (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters (id) on delete cascade,
  target text not null,            -- e.g. ability:str | ac | save:fort | skill:hide
  bonus_type text not null default 'untyped',
  value integer not null,
  source text not null,            -- "Bull's Strength", "Poison", ...
  duration text,                   -- freeform / rounds
  active boolean not null default true,
  applied_at timestamptz not null default now()
);

-- Append-only session journal: dice results, HP changes, notes, level-ups.
create table if not exists session_log (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters (id) on delete cascade,
  session_group uuid,              -- groups a play session
  kind text not null,              -- roll | hp | note | item | effect | levelup
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
create index if not exists idx_characters_owner on characters (owner_id);
create index if not exists idx_char_classes_char on character_classes (character_id);
create index if not exists idx_char_effects_char on character_effects (character_id);
create index if not exists idx_session_log_char on session_log (character_id, created_at);
create unique index if not exists uniq_builtin_race_slug on races (slug) where source = 'builtin';
create unique index if not exists uniq_builtin_class_slug on classes (slug) where source = 'builtin';
create unique index if not exists uniq_builtin_skill_slug on skills (slug) where source = 'builtin';
create unique index if not exists uniq_builtin_feat_slug on feats (slug) where source = 'builtin';

-- ----------------------------------------------------------------------------
-- Row-Level Security
-- Built-in content: world-readable, no writes. Custom content & all character
-- data: owner-only. Shared characters: readable via share_token by anyone
-- (enforced in the app through a security-definer RPC, not blanket-public).
-- ----------------------------------------------------------------------------
alter table races enable row level security;
alter table classes enable row level security;
alter table skills enable row level security;
alter table feats enable row level security;
alter table spells enable row level security;
alter table items enable row level security;
alter table conditions enable row level security;
alter table campaigns enable row level security;
alter table characters enable row level security;
alter table character_classes enable row level security;
alter table character_feats enable row level security;
alter table character_spells enable row level security;
alter table character_inventory enable row level security;
alter table character_money enable row level security;
alter table character_effects enable row level security;
alter table session_log enable row level security;

-- Reference content: builtin readable by all; custom readable/writable by owner.
do $$
declare t text;
begin
  foreach t in array array['races','classes','skills','feats','spells','items','conditions']
  loop
    execute format($f$
      create policy %1$s_read on %1$I for select
        using (source = 'builtin' or owner_id = auth.uid());
      create policy %1$s_insert on %1$I for insert
        with check (source = 'custom' and owner_id = auth.uid());
      create policy %1$s_update on %1$I for update
        using (owner_id = auth.uid()) with check (owner_id = auth.uid());
      create policy %1$s_delete on %1$I for delete
        using (owner_id = auth.uid());
    $f$, t);
  end loop;
end $$;

-- Owner-only tables.
create policy campaigns_owner on campaigns for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy characters_owner on characters for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Child tables inherit ownership through the parent character.
do $$
declare t text;
begin
  foreach t in array array[
    'character_classes','character_feats','character_spells',
    'character_inventory','character_money','character_effects','session_log'
  ]
  loop
    execute format($f$
      create policy %1$s_owner on %1$I for all
        using (exists (select 1 from characters c where c.id = %1$I.character_id and c.owner_id = auth.uid()))
        with check (exists (select 1 from characters c where c.id = %1$I.character_id and c.owner_id = auth.uid()));
    $f$, t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- Avatar storage bucket + policies (per-user folder: avatars/<uid>/<file>)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars read" on storage.objects for select
  using (bucket_id = 'avatars');
create policy "avatars insert own" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars update own" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars delete own" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- updated_at touch trigger
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['races','classes','skills','feats','spells','items','conditions','characters']
  loop
    execute format('create trigger %1$s_touch before update on %1$I for each row execute function touch_updated_at();', t);
  end loop;
end $$;
