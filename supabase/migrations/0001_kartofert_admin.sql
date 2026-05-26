create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  description text,
  category text,
  nutrients jsonb default '[]'::jsonb,
  growing_stages text[] default '{}',
  price numeric,
  price_label text default 'Цена уточняется',
  price_mode text not null default 'request',
  currency text not null default 'BYN',
  package_weight text default '25 кг',
  image_url text,
  images jsonb default '[]'::jsonb,
  is_published boolean not null default true,
  in_stock boolean not null default true,
  sort_order integer not null default 0,
  document_links jsonb default '[]'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  cover_image_url text,
  read_time text,
  published_at timestamptz,
  status text not null default 'draft',
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  customer_address text,
  comment text,
  items jsonb not null,
  subtotal numeric,
  total numeric,
  currency text not null default 'BYN',
  status text not null default 'new',
  payment_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text,
  entity_id text,
  message text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  entity_type text,
  entity_id text,
  path text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists products_published_idx on products (is_published, sort_order) where deleted_at is null;
create index if not exists articles_status_idx on articles (status, published_at);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists admin_logs_created_at_idx on admin_logs (created_at desc);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);
create index if not exists analytics_events_name_idx on analytics_events (event_name);
