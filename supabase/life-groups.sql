-- Vine Life Groups: schema, security, reporting.
-- Run the whole file in the Supabase SQL editor. It is idempotent.
--
-- BEFORE running: nothing. AFTER running:
--   1. update public.profiles set role = 'super_admin' where email = '<pastor email>';
--   2. Authentication > Providers > Email: enable sign-ups (the app needs them).
--   3. Manual RLS checklist (use two test users):
--      - a member cannot select lg_announcements for a group they are not in
--      - a leader cannot lg_decide_request() for another leader's group
--      - a member cannot update public.announcements or public.site_settings

-- ---------------------------------------------------------------------------
-- Profiles

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null default '',
  email      text not null default '',
  phone      text not null default '',
  role       text not null default 'member' check (role in ('member','leader','super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that existed before this file ran (e.g. the pastor).
insert into public.profiles (id, full_name, email)
select id, coalesce(raw_user_meta_data ->> 'full_name', ''), coalesce(email, '')
from auth.users
on conflict (id) do nothing;

-- Role helpers (security definer so RLS policies can call them without recursion).
create or replace function public.lg_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'anon');
$$;

-- ---------------------------------------------------------------------------
-- Groups

create table if not exists public.lg_groups (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text not null default '',
  meeting_day  smallint check (meeting_day between 0 and 6),
  meeting_time text not null default '',
  location     text not null default '',
  leader_id    uuid references public.profiles (id) on delete set null,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists lg_groups_set_updated_at on public.lg_groups;
create trigger lg_groups_set_updated_at before update on public.lg_groups
  for each row execute function public.set_updated_at();

create table if not exists public.lg_join_requests (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.lg_groups (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  message    text not null default '',
  status     text not null default 'pending' check (status in ('pending','approved','declined')),
  decided_by uuid references public.profiles (id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, user_id)
);
drop trigger if exists lg_join_requests_set_updated_at on public.lg_join_requests;
create trigger lg_join_requests_set_updated_at before update on public.lg_join_requests
  for each row execute function public.set_updated_at();

create table if not exists public.lg_memberships (
  id        uuid primary key default gen_random_uuid(),
  group_id  uuid not null references public.lg_groups (id) on delete cascade,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table if not exists public.lg_sessions (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.lg_groups (id) on delete cascade,
  session_date date not null,
  topic        text not null default '',
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (group_id, session_date)
);

create table if not exists public.lg_attendance (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.lg_sessions (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  status     text not null check (status in ('present','absent')),
  marked_at  timestamptz not null default now(),
  unique (session_id, user_id)
);

create table if not exists public.lg_announcements (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.lg_groups (id) on delete cascade,
  author_id  uuid references public.profiles (id) on delete set null,
  title      text not null,
  body       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists lg_announcements_set_updated_at on public.lg_announcements;
create trigger lg_announcements_set_updated_at before update on public.lg_announcements
  for each row execute function public.set_updated_at();

create table if not exists public.lg_documents (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.lg_groups (id) on delete cascade,
  uploader_id  uuid references public.profiles (id) on delete set null,
  title        text not null,
  storage_path text not null,
  mime_type    text not null default '',
  size_bytes   bigint not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists lg_memberships_user_idx on public.lg_memberships (user_id);
create index if not exists lg_join_requests_group_status_idx on public.lg_join_requests (group_id, status);
create index if not exists lg_sessions_group_date_idx on public.lg_sessions (group_id, session_date desc);
create index if not exists lg_attendance_session_idx on public.lg_attendance (session_id);
create index if not exists lg_announcements_group_idx on public.lg_announcements (group_id, created_at desc);
create index if not exists lg_documents_group_idx on public.lg_documents (group_id, created_at desc);

-- Membership helpers (defined after the tables they reference).
create or replace function public.lg_is_leader_of(gid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.lg_groups where id = gid and leader_id = auth.uid());
$$;

create or replace function public.lg_is_member_of(gid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.lg_memberships where group_id = gid and user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Grants

grant usage on schema public to anon, authenticated;
grant select on public.lg_groups to anon;
grant select, insert, update, delete on
  public.profiles, public.lg_groups, public.lg_join_requests, public.lg_memberships,
  public.lg_sessions, public.lg_attendance, public.lg_announcements, public.lg_documents
  to authenticated;

-- ---------------------------------------------------------------------------
-- Row level security

alter table public.profiles         enable row level security;
alter table public.lg_groups        enable row level security;
alter table public.lg_join_requests enable row level security;
alter table public.lg_memberships   enable row level security;
alter table public.lg_sessions      enable row level security;
alter table public.lg_attendance    enable row level security;
alter table public.lg_announcements enable row level security;
alter table public.lg_documents     enable row level security;

-- profiles
drop policy if exists "profiles: own row" on public.profiles;
create policy "profiles: own row" on public.profiles for select to authenticated
  using (id = auth.uid());
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles p where p.id = auth.uid()));
drop policy if exists "profiles: leaders see their people" on public.profiles;
create policy "profiles: leaders see their people" on public.profiles for select to authenticated
  using (
    exists (select 1 from public.lg_memberships m join public.lg_groups g on g.id = m.group_id
            where m.user_id = profiles.id and g.leader_id = auth.uid())
    or exists (select 1 from public.lg_join_requests r join public.lg_groups g on g.id = r.group_id
            where r.user_id = profiles.id and g.leader_id = auth.uid())
  );
drop policy if exists "profiles: members see group mates and leader" on public.profiles;
create policy "profiles: members see group mates and leader" on public.profiles for select to authenticated
  using (
    exists (select 1 from public.lg_memberships mine join public.lg_memberships theirs on theirs.group_id = mine.group_id
            where mine.user_id = auth.uid() and theirs.user_id = profiles.id)
    or exists (select 1 from public.lg_groups g join public.lg_memberships m on m.group_id = g.id
            where m.user_id = auth.uid() and g.leader_id = profiles.id)
    or exists (select 1 from public.lg_groups g where g.leader_id = profiles.id and g.is_active)
  );
drop policy if exists "profiles: super admin all" on public.profiles;
create policy "profiles: super admin all" on public.profiles for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

-- lg_groups
drop policy if exists "groups: public read active" on public.lg_groups;
create policy "groups: public read active" on public.lg_groups for select
  using (is_active or leader_id = auth.uid() or public.lg_role() = 'super_admin');
drop policy if exists "groups: leader updates own" on public.lg_groups;
create policy "groups: leader updates own" on public.lg_groups for update to authenticated
  using (leader_id = auth.uid()) with check (leader_id = auth.uid());
drop policy if exists "groups: super admin all" on public.lg_groups;
create policy "groups: super admin all" on public.lg_groups for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

-- lg_join_requests
drop policy if exists "requests: own" on public.lg_join_requests;
create policy "requests: own" on public.lg_join_requests for select to authenticated
  using (user_id = auth.uid());
drop policy if exists "requests: insert own" on public.lg_join_requests;
create policy "requests: insert own" on public.lg_join_requests for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "requests: re-request own" on public.lg_join_requests;
create policy "requests: re-request own" on public.lg_join_requests for update to authenticated
  using (user_id = auth.uid() and status = 'declined') with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "requests: leader reads" on public.lg_join_requests;
create policy "requests: leader reads" on public.lg_join_requests for select to authenticated
  using (public.lg_is_leader_of(group_id));
drop policy if exists "requests: super admin all" on public.lg_join_requests;
create policy "requests: super admin all" on public.lg_join_requests for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

-- lg_memberships
drop policy if exists "memberships: own" on public.lg_memberships;
create policy "memberships: own" on public.lg_memberships for select to authenticated
  using (user_id = auth.uid() or public.lg_is_member_of(group_id));
drop policy if exists "memberships: leader" on public.lg_memberships;
create policy "memberships: leader" on public.lg_memberships for all to authenticated
  using (public.lg_is_leader_of(group_id)) with check (public.lg_is_leader_of(group_id));
drop policy if exists "memberships: super admin all" on public.lg_memberships;
create policy "memberships: super admin all" on public.lg_memberships for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

-- lg_sessions / lg_attendance / lg_announcements / lg_documents share one shape
drop policy if exists "sessions: member read" on public.lg_sessions;
create policy "sessions: member read" on public.lg_sessions for select to authenticated
  using (public.lg_is_member_of(group_id));
drop policy if exists "sessions: leader all" on public.lg_sessions;
create policy "sessions: leader all" on public.lg_sessions for all to authenticated
  using (public.lg_is_leader_of(group_id)) with check (public.lg_is_leader_of(group_id));
drop policy if exists "sessions: super admin all" on public.lg_sessions;
create policy "sessions: super admin all" on public.lg_sessions for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

drop policy if exists "attendance: own read" on public.lg_attendance;
create policy "attendance: own read" on public.lg_attendance for select to authenticated
  using (user_id = auth.uid());
drop policy if exists "attendance: leader all" on public.lg_attendance;
create policy "attendance: leader all" on public.lg_attendance for all to authenticated
  using (exists (select 1 from public.lg_sessions s where s.id = session_id and public.lg_is_leader_of(s.group_id)))
  with check (exists (select 1 from public.lg_sessions s where s.id = session_id and public.lg_is_leader_of(s.group_id)));
drop policy if exists "attendance: super admin all" on public.lg_attendance;
create policy "attendance: super admin all" on public.lg_attendance for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

drop policy if exists "announcements: member read" on public.lg_announcements;
create policy "announcements: member read" on public.lg_announcements for select to authenticated
  using (public.lg_is_member_of(group_id));
drop policy if exists "announcements: leader all" on public.lg_announcements;
create policy "announcements: leader all" on public.lg_announcements for all to authenticated
  using (public.lg_is_leader_of(group_id)) with check (public.lg_is_leader_of(group_id));
drop policy if exists "announcements: super admin all" on public.lg_announcements;
create policy "announcements: super admin all" on public.lg_announcements for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

drop policy if exists "documents: member read" on public.lg_documents;
create policy "documents: member read" on public.lg_documents for select to authenticated
  using (public.lg_is_member_of(group_id));
drop policy if exists "documents: leader all" on public.lg_documents;
create policy "documents: leader all" on public.lg_documents for all to authenticated
  using (public.lg_is_leader_of(group_id)) with check (public.lg_is_leader_of(group_id));
drop policy if exists "documents: super admin all" on public.lg_documents;
create policy "documents: super admin all" on public.lg_documents for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

-- ---------------------------------------------------------------------------
-- RPCs

create or replace function public.lg_decide_request(request_id uuid, approve boolean)
returns void language plpgsql security definer set search_path = public as $$
declare r public.lg_join_requests%rowtype;
begin
  select * into r from public.lg_join_requests where id = request_id;
  if not found then raise exception 'request not found'; end if;
  if not (public.lg_is_leader_of(r.group_id) or public.lg_role() = 'super_admin') then
    raise exception 'not allowed';
  end if;
  update public.lg_join_requests
    set status = case when approve then 'approved' else 'declined' end,
        decided_by = auth.uid(), decided_at = now()
    where id = request_id;
  if approve then
    insert into public.lg_memberships (group_id, user_id) values (r.group_id, r.user_id)
    on conflict (group_id, user_id) do nothing;
  end if;
end $$;

create or replace function public.lg_set_role(target uuid, new_role text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.lg_role() <> 'super_admin' then raise exception 'not allowed'; end if;
  if new_role not in ('member','leader','super_admin') then raise exception 'bad role'; end if;
  update public.profiles set role = new_role where id = target;
end $$;

create or replace function public.lg_assign_leader(gid uuid, target uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.lg_role() <> 'super_admin' then raise exception 'not allowed'; end if;
  update public.lg_groups set leader_id = target where id = gid;
  if target is not null then
    update public.profiles set role = 'leader' where id = target and role = 'member';
  end if;
end $$;

create or replace function public.lg_delete_my_account()
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  delete from auth.users where id = auth.uid();
end $$;

grant execute on function public.lg_role(), public.lg_is_leader_of(uuid), public.lg_is_member_of(uuid),
  public.lg_decide_request(uuid, boolean), public.lg_set_role(uuid, text),
  public.lg_assign_leader(uuid, uuid), public.lg_delete_my_account() to authenticated;
grant execute on function public.lg_role() to anon;

-- ---------------------------------------------------------------------------
-- Reporting views (RLS of the caller still applies)

create or replace view public.lg_session_stats with (security_invoker = true) as
select s.id as session_id, s.group_id, s.session_date, s.topic,
       count(a.id) filter (where a.status = 'present') as present,
       count(a.id) filter (where a.status = 'absent')  as absent,
       (select count(*) from public.lg_memberships m where m.group_id = s.group_id) as members,
       case when count(a.id) = 0 then 0
            else round(100.0 * count(a.id) filter (where a.status = 'present') / count(a.id)) end as rate
from public.lg_sessions s
left join public.lg_attendance a on a.session_id = s.id
group by s.id;

create or replace view public.lg_member_stats with (security_invoker = true) as
select m.group_id, m.user_id, p.full_name, p.phone, m.joined_at,
       count(a.id) as sessions,
       count(a.id) filter (where a.status = 'present') as present,
       case when count(a.id) = 0 then 0
            else round(100.0 * count(a.id) filter (where a.status = 'present') / count(a.id)) end as rate
from public.lg_memberships m
join public.profiles p on p.id = m.user_id
left join public.lg_sessions s on s.group_id = m.group_id
left join public.lg_attendance a on a.session_id = s.id and a.user_id = m.user_id
group by m.group_id, m.user_id, p.full_name, p.phone, m.joined_at;

create or replace view public.lg_group_stats with (security_invoker = true) as
select g.id as group_id, g.name, g.leader_id, lp.full_name as leader_name, g.is_active,
       (select count(*) from public.lg_memberships m where m.group_id = g.id) as members,
       (select count(*) from public.lg_join_requests r where r.group_id = g.id and r.status = 'pending') as pending,
       (select count(*) from public.lg_sessions s where s.group_id = g.id) as sessions,
       (select max(s.session_date) from public.lg_sessions s where s.group_id = g.id) as last_session,
       coalesce((select round(avg(ss.rate)) from public.lg_session_stats ss where ss.group_id = g.id), 0) as avg_rate
from public.lg_groups g
left join public.profiles lp on lp.id = g.leader_id;

grant select on public.lg_session_stats, public.lg_member_stats, public.lg_group_stats to authenticated;

-- ---------------------------------------------------------------------------
-- Storage bucket for documents

insert into storage.buckets (id, name, public) values ('lg-documents', 'lg-documents', false)
on conflict (id) do nothing;

drop policy if exists "lg docs: members read" on storage.objects;
create policy "lg docs: members read" on storage.objects for select to authenticated
  using (bucket_id = 'lg-documents' and (
    public.lg_is_member_of(((storage.foldername(name))[1])::uuid)
    or public.lg_is_leader_of(((storage.foldername(name))[1])::uuid)
    or public.lg_role() = 'super_admin'));
drop policy if exists "lg docs: leaders write" on storage.objects;
create policy "lg docs: leaders write" on storage.objects for insert to authenticated
  with check (bucket_id = 'lg-documents' and (
    public.lg_is_leader_of(((storage.foldername(name))[1])::uuid) or public.lg_role() = 'super_admin'));
drop policy if exists "lg docs: leaders delete" on storage.objects;
create policy "lg docs: leaders delete" on storage.objects for delete to authenticated
  using (bucket_id = 'lg-documents' and (
    public.lg_is_leader_of(((storage.foldername(name))[1])::uuid) or public.lg_role() = 'super_admin'));

-- ---------------------------------------------------------------------------
-- Website hardening: only the super admin may edit site content now that
-- ordinary members sign in to the same project.

drop policy if exists "Signed-in users can insert" on public.announcements;
drop policy if exists "Signed-in users can update" on public.announcements;
drop policy if exists "Signed-in users can delete" on public.announcements;
drop policy if exists "Signed-in users can read everything" on public.announcements;
drop policy if exists "Super admin manages announcements" on public.announcements;
create policy "Super admin manages announcements" on public.announcements for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

drop policy if exists "Signed-in users can write settings" on public.site_settings;
drop policy if exists "Super admin writes settings" on public.site_settings;
create policy "Super admin writes settings" on public.site_settings for all to authenticated
  using (public.lg_role() = 'super_admin') with check (public.lg_role() = 'super_admin');

drop policy if exists "Signed-in users can read subscribers" on public.subscribers;
drop policy if exists "Signed-in users can delete subscribers" on public.subscribers;
drop policy if exists "Super admin reads subscribers" on public.subscribers;
create policy "Super admin reads subscribers" on public.subscribers for select to authenticated
  using (public.lg_role() = 'super_admin');
drop policy if exists "Super admin deletes subscribers" on public.subscribers;
create policy "Super admin deletes subscribers" on public.subscribers for delete to authenticated
  using (public.lg_role() = 'super_admin');
