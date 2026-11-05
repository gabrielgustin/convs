-- Estudio (tenant), miembros, invitaciones, dominios y catálogos configurables.

create table studios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  plan text not null default 'gratis',
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table members (
  studio_id uuid not null references studios (id) on delete cascade,
  user_id text not null references "user" (id) on delete cascade,
  role text not null check (role in ('admin', 'abogado', 'asistente')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (studio_id, user_id)
);
create index members_user_idx on members (user_id);

create table invitations (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'abogado', 'asistente')),
  created_at timestamptz not null default now(),
  unique (studio_id, email)
);
create index invitations_email_idx on invitations (email);

create table domains (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  domain text not null unique,
  token text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- Un solo lugar para todos los catálogos: estados, etapas, fueros, partes, estados de tarea,
-- tipos de cliente, tipos de juzgado y etiquetas. "category" solo se usa en estados de tarea.
create table catalog_items (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  kind text not null check (kind in ('estado', 'etapa', 'fuero', 'parte', 'estado_tarea', 'tipo_cliente', 'tipo_juzgado', 'etiqueta')),
  name text not null,
  color text not null default '#64748b',
  category text check (category in ('inactivo', 'activo', 'completado', 'finalizado')),
  active boolean not null default true,
  sort integer not null default 0,
  unique (studio_id, kind, name)
);
create index catalog_items_studio_kind_idx on catalog_items (studio_id, kind, sort);
