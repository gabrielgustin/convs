-- Fase 2: clientes, juzgados, expedientes, actuaciones, asignaciones y etiquetas.

create table clients (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  name text not null,
  type_id uuid references catalog_items (id) on delete set null,
  active boolean not null default true,
  email text,
  phone text,
  tax_id text,            -- CUIT / DNI
  address text,
  notes text,
  created_at timestamptz not null default now()
);
create index clients_studio_idx on clients (studio_id, active, name);

create table courts (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  name text not null,
  type_id uuid references catalog_items (id) on delete set null,
  active boolean not null default true,
  province text,
  email text,
  phone text,
  identification text,    -- código o identificación del organismo
  address text,
  notes text,
  created_at timestamptz not null default now()
);
create index courts_studio_idx on courts (studio_id, active, name);

create table matters (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  caption text not null,          -- carátula
  number text,
  year integer,
  full_number text,               -- clave PJN / CUIJ
  court_url text,
  fuero_id uuid references catalog_items (id) on delete set null,
  estado_id uuid references catalog_items (id) on delete set null,
  etapa_id uuid references catalog_items (id) on delete set null,
  parte_id uuid references catalog_items (id) on delete set null,
  court_id uuid references courts (id) on delete set null,
  notes text,
  archived boolean not null default false,
  deleted_at timestamptz,
  last_activity_at timestamptz,
  created_by text references "user" (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index matters_studio_idx on matters (studio_id, archived, deleted_at, updated_at desc);
create unique index matters_full_number_idx on matters (studio_id, lower(full_number)) where full_number is not null;

create table matter_clients (
  matter_id uuid not null references matters (id) on delete cascade,
  client_id uuid not null references clients (id) on delete cascade,
  primary key (matter_id, client_id)
);
create index matter_clients_client_idx on matter_clients (client_id);

-- Actuaciones: las manuales ahora; las de tribunales llegan en la fase 6 con source = 'pjn', 'scba', etc.
create table matter_activities (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid not null references matters (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  title text not null,
  body text,
  source text not null default 'manual',
  external_id text,
  created_by text references "user" (id) on delete set null,
  created_at timestamptz not null default now()
);
create index matter_activities_matter_idx on matter_activities (matter_id, occurred_at desc);
create unique index matter_activities_external_idx on matter_activities (matter_id, source, external_id) where external_id is not null;

-- Asignaciones y etiquetas genéricas para expedientes, clientes y juzgados (y tareas más adelante).
create table assignments (
  studio_id uuid not null references studios (id) on delete cascade,
  entity text not null check (entity in ('matter', 'client', 'court', 'task')),
  entity_id uuid not null,
  user_id text not null references "user" (id) on delete cascade,
  primary key (entity, entity_id, user_id)
);
create index assignments_user_idx on assignments (studio_id, user_id, entity);

create table taggings (
  studio_id uuid not null references studios (id) on delete cascade,
  entity text not null check (entity in ('matter', 'client', 'court', 'task')),
  entity_id uuid not null,
  tag_id uuid not null references catalog_items (id) on delete cascade,
  primary key (entity, entity_id, tag_id)
);
create index taggings_tag_idx on taggings (tag_id);

-- Directorio nacional de juzgados (compartido entre estudios). Se carga con scripts/importar-directorio.mjs.
create table court_directory (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  jurisdiction text,      -- PJN, SCBA, CABA, etc.
  province text,
  email text,
  phone text,
  identification text,
  address text,
  unique (name, province)
);
