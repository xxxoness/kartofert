alter table analytics_events
  add column if not exists product_slug text,
  add column if not exists payload jsonb;

create index if not exists analytics_events_product_slug_idx on analytics_events (product_slug);
create index if not exists analytics_events_path_idx on analytics_events (path);
