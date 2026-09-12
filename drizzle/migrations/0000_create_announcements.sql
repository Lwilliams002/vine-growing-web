create table if not exists public.announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text not null,
  event_date   date,
  event_time   text,
  link_url     text,
  link_label   text,
  is_pinned    boolean not null default false,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

grant select on public.announcements to anon;
grant select, insert, update, delete on public.announcements to authenticated;
grant all on public.announcements to service_role;

create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

alter table public.announcements enable row level security;

drop policy if exists "Public can read published announcements" on public.announcements;
create policy "Public can read published announcements"
  on public.announcements for select
  using (is_published = true);

drop policy if exists "Signed-in users can read everything" on public.announcements;
create policy "Signed-in users can read everything"
  on public.announcements for select
  to authenticated
  using (true);

drop policy if exists "Signed-in users can insert" on public.announcements;
create policy "Signed-in users can insert"
  on public.announcements for insert
  to authenticated
  with check (true);

drop policy if exists "Signed-in users can update" on public.announcements;
create policy "Signed-in users can update"
  on public.announcements for update
  to authenticated
  using (true);

drop policy if exists "Signed-in users can delete" on public.announcements;
create policy "Signed-in users can delete"
  on public.announcements for delete
  to authenticated
  using (true);

create index if not exists announcements_published_date_idx
  on public.announcements (is_published, event_date);