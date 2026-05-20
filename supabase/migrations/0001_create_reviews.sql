create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  external_review_id text,
  place_id text not null,
  author_name text,
  rating integer check (rating between 1 and 5),
  content text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Resolved')),
  ai_replies jsonb,
  selected_tone text check (selected_tone in ('standard', 'friendly', 'solution')),
  selected_reply text,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint reviews_place_external_unique unique (place_id, external_review_id)
);

create index if not exists reviews_place_id_idx on public.reviews (place_id);
create index if not exists reviews_status_idx on public.reviews (status);
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_reviews_updated_at on public.reviews;

create trigger set_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_updated_at();
