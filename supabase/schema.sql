
-- ---------------------------------------------------------------------------
-- Site settings: small key/value store for things the pastor toggles from
-- /admin (live stream URL, latest sermon URL, "we are live" switch).
-- Run this block too if the table does not exist yet.

create table if not exists public.site_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Signed-in users can write settings" on public.site_settings;
create policy "Signed-in users can write settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (key, value) values
  ('is_live', 'false'),
  ('live_video_url', ''),
  ('latest_sermon_url', ''),
  ('latest_sermon_title', '')
on conflict (key) do nothing;
