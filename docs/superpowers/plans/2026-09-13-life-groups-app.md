# Vine Life Groups App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an Expo mobile app where members request to join life groups, leaders approve requests, take attendance, and post announcements/documents, and the pastor (super admin) sees stats and reports across all groups.

**Architecture:** One Expo Router app with a role-aware tab bar (Home, Groups, Profile for all; Lead for leaders; Admin for super admins) talking directly to the website's Supabase project through supabase-js. Authorization lives in Postgres (RLS + security-definer RPCs), so the client only shapes queries. Reporting is done by SQL views with `security_invoker` so RLS filters rows automatically.

**Tech Stack:** Expo SDK 55, expo-router 55, React Native 0.83, NativeWind 4, TanStack Query 5, @supabase/supabase-js 2, AsyncStorage, expo-document-picker, expo-file-system, expo-sharing, expo-web-browser, @expo-google-fonts (Anton, Inter, JetBrains Mono), lucide-react-native, react-native-toast-message, zod, jest-expo.

**Spec:** `docs/superpowers/specs/2026-09-13-life-groups-app-design.md` (in the website repo `vine-growing-web`).

## Global Constraints

- App folder: `/Users/lezdev/Desktop/Williams/vine-life-groups-app`, its own git repo. SQL file lives in the website repo at `vine-growing-web/supabase/life-groups.sql`.
- All new tables prefixed `lg_` except `profiles`. Roles: `member` | `leader` | `super_admin`.
- Copy is bilingual through `t(es, en)`; Spanish is the default. Never hardcode a single-language string in a screen.
- Colors come from `src/lib/theme.ts` (hex of the site's oklch tokens): background `#060a13`, surfaceDeep `#010204`, card `#0e1420`, secondary `#191f2c`, border `#1f2531`, input `#2f3542`, foreground `#fafafa`, mutedForeground `#a0a5ae`, primary `#18b4f4`, primaryForeground `#060a13`, accent `#f2ab19`, destructive `#ee3533`. Square corners everywhere (`borderRadius: 0`), except avatars.
- Fonts: display `Anton_400Regular`, body `Inter_400Regular` / `Inter_500Medium` / `Inter_600SemiBold`, mono `JetBrainsMono_400Regular` for eyebrows (uppercase, letter-spacing 4).
- Path alias `@/*` → `src/*`. Screens live in `app/`, everything else in `src/`.
- Env: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` read from `.env` (git-ignored). `.env.example` committed.
- Bundle id `org.thevinehouston.lifegroups`, app name "Vine Life Groups".
- Tests run with `npx jest`. Commit after every task.

---

## File map

**Website repo (`vine-growing-web`)**
- `supabase/life-groups.sql` — profiles, `lg_*` tables, helpers, RLS, RPCs, views, storage bucket + policies, website policy hardening. Idempotent (`if not exists` / `drop ... if exists`).

**App repo (`vine-life-groups-app`)**
- `package.json`, `app.json`, `eas.json`, `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`, `nativewind-env.d.ts`, `tsconfig.json`, `jest.config.js`, `.env.example`, `.gitignore`, `README.md`
- `assets/icon.png`, `assets/splash-icon.png`, `assets/adaptive-icon.png` — logo on navy
- `src/assets/vine-logo.png` — copied from the website
- `src/lib/theme.ts` — color + font constants
- `src/lib/i18n.tsx` — `LanguageProvider`, `useLang`, `pick`
- `src/lib/utils.ts` — `cn`, `formatDate`, `initials`
- `src/lib/stats.ts` — `attendanceRate`, `summarizeSessions`
- `src/lib/csv.ts` — `toCsv`
- `src/lib/roles.ts` — `tabsForRole`
- `src/lib/validation.ts` — zod schemas for sign-up, group form, announcement form
- `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`
- `src/contexts/AuthContext.tsx` — session + profile + role
- `src/lib/queries/*.ts` — `groups.ts`, `requests.ts`, `memberships.ts`, `sessions.ts`, `announcements.ts`, `documents.ts`, `stats.ts`, `people.ts`
- `src/components/ui/` — `Screen`, `Text` variants (`Display`, `Eyebrow`, `Body`), `Button`, `Input`, `Card`, `Badge`, `Avatar`, `Empty`, `Loading`, `Field`
- `src/components/` — `Logo`, `GroupCard`, `AnnouncementCard`, `DocumentRow`, `StatTile`, `RequestRow`, `MemberRow`, `LangToggle`
- `app/_layout.tsx`, `app/index.tsx`, `app/+not-found.tsx`
- `app/(public)/_layout.tsx`, `welcome.tsx`, `groups.tsx`, `group/[id].tsx`, `sign-in.tsx`, `sign-up.tsx`
- `app/(app)/_layout.tsx`, `home.tsx`, `groups/index.tsx`, `groups/[id].tsx`, `group/[id]/_layout.tsx`, `group/[id]/index.tsx`, `group/[id]/documents.tsx`, `group/[id]/attendance.tsx`, `profile.tsx`
- `app/(app)/lead/index.tsx`, `lead/requests.tsx`, `lead/[groupId]/index.tsx` (roster), `lead/[groupId]/attendance.tsx`, `lead/[groupId]/post.tsx`, `lead/[groupId]/upload.tsx`, `lead/[groupId]/report.tsx`
- `app/(app)/admin/index.tsx` (dashboard), `admin/groups.tsx`, `admin/group-form.tsx`, `admin/people.tsx`, `admin/reports.tsx`
- `__tests__/i18n.test.tsx`, `stats.test.ts`, `csv.test.ts`, `roles.test.ts`, `validation.test.ts`

---

### Task 1: Database schema, RLS, RPCs, views (website repo)

**Files:**
- Create: `vine-growing-web/supabase/life-groups.sql`

**Interfaces:**
- Produces: tables `profiles`, `lg_groups`, `lg_join_requests`, `lg_memberships`, `lg_sessions`, `lg_attendance`, `lg_announcements`, `lg_documents`; functions `lg_role()`, `lg_is_leader_of(uuid)`, `lg_is_member_of(uuid)`, `lg_decide_request(uuid, boolean)`, `lg_set_role(uuid, text)`, `lg_assign_leader(uuid, uuid)`, `lg_delete_my_account()`; views `lg_session_stats`, `lg_member_stats`, `lg_group_stats`; bucket `lg-documents`.

- [ ] **Step 1: Write the SQL file**

```sql
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

create or replace function public.lg_is_leader_of(gid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.lg_groups where id = gid and leader_id = auth.uid());
$$;

create or replace function public.lg_is_member_of(gid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.lg_memberships where group_id = gid and user_id = auth.uid());
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
```

- [ ] **Step 2: Syntax-check locally if Postgres is available**

Run: `which psql && createdb lg_check && psql lg_check -v ON_ERROR_STOP=1 -c "create schema auth; create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb); create function auth.uid() returns uuid language sql as 'select null::uuid'; create schema storage; create table storage.buckets(id text primary key, name text, public boolean); create table storage.objects(id uuid, bucket_id text, name text); create function storage.foldername(text) returns text[] language sql as 'select string_to_array(\$1, ''/'')'; create role anon; create role authenticated; create role service_role; create table public.announcements(id uuid); create table public.site_settings(key text); create table public.subscribers(id uuid);" -f supabase/life-groups.sql; dropdb lg_check`
Expected: no errors. If `psql` is missing, skip and rely on the Supabase SQL editor run.

- [ ] **Step 3: Commit**

```bash
cd /Users/lezdev/Desktop/Williams/vine-growing-web
git add supabase/life-groups.sql
git commit -m "Add Life Groups schema, RLS, RPCs, reports, and site policy hardening"
```

---

### Task 2: Scaffold the Expo app

**Files:**
- Create: `vine-life-groups-app/package.json`, `app.json`, `eas.json`, `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`, `nativewind-env.d.ts`, `tsconfig.json`, `jest.config.js`, `.gitignore`, `.env.example`, `README.md`, `src/assets/vine-logo.png`, `assets/icon.png`, `assets/splash-icon.png`, `assets/adaptive-icon.png`

**Interfaces:**
- Produces: a runnable Expo project with `npx jest` and `npx expo start` working.

- [ ] **Step 1: Create the folder and package.json**

```json
{
  "name": "vine-life-groups-app",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "private": true,
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android",
    "test": "jest",
    "typecheck": "tsc --noEmit",
    "build:ios": "eas build --platform ios --profile production",
    "build:ios:preview": "eas build --platform ios --profile preview",
    "submit:ios": "eas submit --platform ios --profile production --latest"
  },
  "dependencies": {
    "@expo-google-fonts/anton": "^0.4.1",
    "@expo-google-fonts/inter": "^0.4.1",
    "@expo-google-fonts/jetbrains-mono": "^0.4.1",
    "@expo/vector-icons": "^15.1.1",
    "@hookform/resolvers": "^5.2.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@supabase/supabase-js": "^2.100.0",
    "@tanstack/react-query": "^5.95.2",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "expo": "~55.0.8",
    "expo-constants": "~55.0.9",
    "expo-document-picker": "~55.0.9",
    "expo-file-system": "~55.0.9",
    "expo-font": "~55.0.4",
    "expo-linking": "~55.0.8",
    "expo-router": "~55.0.7",
    "expo-sharing": "~55.0.9",
    "expo-splash-screen": "~55.0.9",
    "expo-status-bar": "~55.0.4",
    "expo-web-browser": "~55.0.9",
    "lucide-react-native": "^1.7.0",
    "nativewind": "^4.2.3",
    "react": "19.2.4",
    "react-dom": "^19.2.4",
    "react-hook-form": "^7.72.0",
    "react-native": "0.83.2",
    "react-native-gesture-handler": "~2.30.0",
    "react-native-reanimated": "4.2.1",
    "react-native-safe-area-context": "~5.6.2",
    "react-native-screens": "~4.23.0",
    "react-native-svg": "^15.15.4",
    "react-native-toast-message": "^2.3.3",
    "react-native-worklets": "0.7.2",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^3.4.17",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@testing-library/react-native": "^13.2.0",
    "@types/react": "~19.2.2",
    "babel-preset-expo": "^55.0.12",
    "jest": "^29.7.0",
    "jest-expo": "~55.0.0",
    "typescript": "~5.9.2"
  }
}
```

Then run `npx expo install --fix` so every Expo package lands on the SDK 55 version, and `npm install`.

- [ ] **Step 2: Config files**

`app.json`:
```json
{
  "expo": {
    "name": "Vine Life Groups",
    "slug": "vine-life-groups",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "vinelifegroups",
    "userInterfaceStyle": "dark",
    "newArchEnabled": true,
    "splash": { "image": "./assets/splash-icon.png", "resizeMode": "contain", "backgroundColor": "#060a13" },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "org.thevinehouston.lifegroups",
      "buildNumber": "1",
      "infoPlist": { "ITSAppUsesNonExemptEncryption": false }
    },
    "android": {
      "package": "org.thevinehouston.lifegroups",
      "versionCode": 1,
      "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "backgroundColor": "#060a13" }
    },
    "plugins": ["expo-router", "expo-font", "expo-document-picker", "expo-web-browser"],
    "experiments": { "typedRoutes": true }
  }
}
```

`eas.json`:
```json
{
  "cli": { "version": ">= 16.0.0", "appVersionSource": "local" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal", "ios": { "simulator": true } },
    "preview": { "distribution": "internal" },
    "production": { "autoIncrement": true }
  },
  "submit": { "production": { "ios": { "bundleIdentifier": "org.thevinehouston.lifegroups" } } }
}
```

`babel.config.js`:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
  };
};
```

`metro.config.js`:
```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

`tailwind.config.js`:
```js
const { colors } = require("./src/lib/theme.colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        "surface-deep": colors.surfaceDeep,
        card: colors.card,
        secondary: colors.secondary,
        border: colors.border,
        input: colors.input,
        foreground: colors.foreground,
        muted: colors.mutedForeground,
        primary: { DEFAULT: colors.primary, foreground: colors.primaryForeground },
        accent: { DEFAULT: colors.accent, foreground: colors.background },
        destructive: colors.destructive,
      },
      fontFamily: {
        display: ["Anton_400Regular"],
        body: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        mono: ["JetBrainsMono_400Regular"],
      },
      borderRadius: { none: "0", DEFAULT: "0", full: "9999px" },
    },
  },
  plugins: [],
};
```

`src/lib/theme.colors.js` (CommonJS so tailwind can require it):
```js
module.exports.colors = {
  background: "#060a13",
  surfaceDeep: "#010204",
  card: "#0e1420",
  secondary: "#191f2c",
  border: "#1f2531",
  input: "#2f3542",
  foreground: "#fafafa",
  mutedForeground: "#a0a5ae",
  primary: "#18b4f4",
  primaryForeground: "#060a13",
  accent: "#f2ab19",
  destructive: "#ee3533",
};
```

`global.css`: `@tailwind base; @tailwind components; @tailwind utilities;`

`nativewind-env.d.ts`: `/// <reference types="nativewind/types" />`

`tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": { "strict": true, "baseUrl": ".", "paths": { "@/*": ["src/*"] } },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts", "nativewind-env.d.ts"]
}
```

`jest.config.js`:
```js
module.exports = {
  preset: "jest-expo",
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nativewind|react-native-css-interop)",
  ],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
};
```

`.gitignore`: node_modules/, .expo/, dist/, ios/, android/, .env, *.orig.*, .DS_Store

`.env.example`:
```
EXPO_PUBLIC_SUPABASE_URL=https://yyevvpuuvilzdnhefusv.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 3: Assets**

Copy `vine-growing-web/src/assets/vine-logo.png` to `src/assets/vine-logo.png`. Generate `assets/icon.png` (1024×1024, logo centered at 70% on `#060a13`), `assets/adaptive-icon.png` (same, logo at 55%), `assets/splash-icon.png` (logo at 512 on transparent) with `sips` or a small Node script using `sharp` if present; otherwise use `sips -z` to resize the logo and accept a transparent background icon for development. Record what was used in README.

- [ ] **Step 4: Smoke test the toolchain**

Add `__tests__/smoke.test.ts`:
```ts
test("jest runs", () => expect(1 + 1).toBe(2));
```
Run: `npx jest` → PASS. Run: `npx tsc --noEmit` → no errors (there is no app code yet).

- [ ] **Step 5: git init and commit**

```bash
cd /Users/lezdev/Desktop/Williams/vine-life-groups-app && git init -q && git add -A && git commit -m "Scaffold Expo app with NativeWind, jest, and Vine theme"
```

---

### Task 3: Theme, utils, and UI primitives

**Files:**
- Create: `src/lib/theme.ts`, `src/lib/utils.ts`, `src/components/ui/Text.tsx`, `Button.tsx`, `Input.tsx`, `Card.tsx`, `Badge.tsx`, `Avatar.tsx`, `Empty.tsx`, `Loading.tsx`, `Screen.tsx`, `src/components/Logo.tsx`
- Test: `__tests__/utils.test.ts`

**Interfaces:**
- Produces: `colors`, `fonts` from theme; `cn(...classes)`, `initials(name)`, `formatDate(iso, lang)`; components `<Screen scroll? padded?>`, `<Display>`, `<Eyebrow>`, `<Body muted? size?>`, `<Button title onPress variant="primary"|"secondary"|"ghost"|"destructive" loading? disabled?>`, `<Input label error ...TextInputProps>`, `<Card>`, `<Badge tone="primary"|"accent"|"muted"|"destructive">`, `<Avatar name size?>`, `<Empty title body?>`, `<Loading/>`, `<Logo size?>`.

- [ ] **Step 1: Failing tests for utils**

```ts
import { initials, formatDate } from "@/lib/utils";
test("initials", () => {
  expect(initials("Maria Lopez")).toBe("ML");
  expect(initials("juan")).toBe("J");
  expect(initials("")).toBe("?");
});
test("formatDate by language", () => {
  expect(formatDate("2026-09-13", "en")).toBe("Sep 13, 2026");
  expect(formatDate("2026-09-13", "es")).toBe("13 sept 2026");
});
```
Run `npx jest utils` → FAIL (module missing).

- [ ] **Step 2: Implement theme and utils**

`src/lib/theme.ts`:
```ts
import { colors as raw } from "./theme.colors";
export const colors = raw as {
  background: string; surfaceDeep: string; card: string; secondary: string; border: string;
  input: string; foreground: string; mutedForeground: string; primary: string;
  primaryForeground: string; accent: string; destructive: string;
};
export const fonts = {
  display: "Anton_400Regular",
  body: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  mono: "JetBrainsMono_400Regular",
} as const;
export const DAYS = {
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
} as const;
```

`src/lib/utils.ts`:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { es as esLocale } from "date-fns/locale";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}
export function formatDate(iso: string, lang: "es" | "en"): string {
  const d = iso.length === 10 ? parseISO(iso) : new Date(iso);
  return lang === "es" ? format(d, "d MMM yyyy", { locale: esLocale }) : format(d, "MMM d, yyyy");
}
export function todayIso(): string { return new Date().toISOString().slice(0, 10); }
```

- [ ] **Step 3: Implement primitives** (StyleSheet-free; NativeWind classes)

`Text.tsx` exports `Display` (font-display, uppercase, text-foreground, size prop 24/32/40), `Eyebrow` (font-mono text-[10px] uppercase tracking-[4px] text-primary), `Body` (font-body text-foreground; `muted` → text-muted; `size` sm/base/lg; `weight` medium/semibold).
`Button.tsx`: Pressable, h-12, px-5, items-center, variants: primary `bg-primary` text `text-primary-foreground font-semibold uppercase tracking-[2px]`, secondary `bg-secondary border border-border text-foreground`, ghost `text-primary`, destructive `bg-destructive text-foreground`. `loading` shows ActivityIndicator. Optional `icon` ReactNode.
`Input.tsx`: label (Eyebrow muted), TextInput `h-12 px-4 bg-surface-deep border border-input text-foreground font-body`, error text in destructive, `placeholderTextColor={colors.mutedForeground}`.
`Card.tsx`: View `bg-card border border-border p-4`.
`Badge.tsx`: View `px-2 py-1` tone backgrounds (primary/accent at 15% opacity via `bg-primary/15` + text-primary, etc.), mono uppercase 10px text.
`Avatar.tsx`: circle 40 `bg-secondary`, `initials(name)` in semibold.
`Empty.tsx`: centered icon-less block with Display size 24 title + Body muted.
`Loading.tsx`: full-flex ActivityIndicator color primary.
`Screen.tsx`: SafeAreaView bg-background flex-1, optional ScrollView with `contentContainerClassName="p-5 gap-5"`, optional `title` rendering Eyebrow+Display header.
`Logo.tsx`: `<Image source={require("@/assets/vine-logo.png")} style={{ width: size, height: size * 496 / 512 }} resizeMode="contain" />`.

- [ ] **Step 4: Run tests and typecheck**

`npx jest utils` → PASS. `npx tsc --noEmit` → clean.

- [ ] **Step 5: Commit** `git add -A && git commit -m "Add theme, utils, and UI primitives"`

---

### Task 4: i18n, roles, stats, csv, validation (pure logic, TDD)

**Files:**
- Create: `src/lib/i18n.tsx`, `src/lib/roles.ts`, `src/lib/stats.ts`, `src/lib/csv.ts`, `src/lib/validation.ts`
- Test: `__tests__/i18n.test.tsx`, `roles.test.ts`, `stats.test.ts`, `csv.test.ts`, `validation.test.ts`

**Interfaces:**
- Produces: `LanguageProvider`, `useLang(): { lang, setLang, t }` where `t(es, en)` returns a string; `Role = "member"|"leader"|"super_admin"`; `tabsForRole(role, leadsAnyGroup): TabKey[]` with `TabKey = "home"|"groups"|"lead"|"admin"|"profile"`; `attendanceRate(present, total): number` (0–100 int); `summarizeSessions(rows: {present:number; absent:number}[]): {sessions:number; avgRate:number}`; `toCsv(headers: string[], rows: (string|number|null)[][]): string`; zod schemas `signUpSchema`, `signInSchema`, `groupSchema`, `announcementSchema`, `profileSchema`.

- [ ] **Step 1: Write the failing tests**

```ts
// __tests__/roles.test.ts
import { tabsForRole } from "@/lib/roles";
test("member tabs", () => expect(tabsForRole("member", false)).toEqual(["home", "groups", "profile"]));
test("leader tabs", () => expect(tabsForRole("leader", true)).toEqual(["home", "groups", "lead", "profile"]));
test("super admin who leads", () => expect(tabsForRole("super_admin", true)).toEqual(["home", "groups", "lead", "admin", "profile"]));
test("super admin without groups", () => expect(tabsForRole("super_admin", false)).toEqual(["home", "groups", "admin", "profile"]));

// __tests__/stats.test.ts
import { attendanceRate, summarizeSessions } from "@/lib/stats";
test("rate", () => { expect(attendanceRate(3, 4)).toBe(75); expect(attendanceRate(0, 0)).toBe(0); expect(attendanceRate(2, 3)).toBe(67); });
test("summary", () => expect(summarizeSessions([{ present: 3, absent: 1 }, { present: 1, absent: 1 }])).toEqual({ sessions: 2, avgRate: 63 }));
test("empty summary", () => expect(summarizeSessions([])).toEqual({ sessions: 0, avgRate: 0 }));

// __tests__/csv.test.ts
import { toCsv } from "@/lib/csv";
test("escapes commas and quotes", () =>
  expect(toCsv(["name", "note"], [["Ana, Jr", 'said "hi"'], ["Bo", null]])).toBe('name,note\n"Ana, Jr","said ""hi"""\nBo,'));

// __tests__/validation.test.ts
import { signUpSchema } from "@/lib/validation";
test("sign up requires name, email, phone, 8-char password", () => {
  expect(signUpSchema.safeParse({ fullName: "A", email: "x", phone: "", password: "short" }).success).toBe(false);
  expect(signUpSchema.safeParse({ fullName: "Ana Ruiz", email: "a@b.co", phone: "7135550100", password: "longenough" }).success).toBe(true);
});

// __tests__/i18n.test.tsx
import React from "react";
import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { LanguageProvider, useLang } from "@/lib/i18n";
function Probe() { const { t } = useLang(); return <Text>{t("Hola", "Hello")}</Text>; }
test("defaults to Spanish", async () => {
  render(<LanguageProvider><Probe /></LanguageProvider>);
  expect(await screen.findByText("Hola")).toBeTruthy();
});
```
Run `npx jest` → all FAIL (modules missing).

- [ ] **Step 2: Implement**

`src/lib/i18n.tsx`: context with `lang` state default `"es"`, on mount read AsyncStorage key `vine-lang`; `setLang` writes it; `t` overloads like the website. Mock AsyncStorage in tests via `jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"))` placed in `jest.setup.js` (add `setupFiles: ["<rootDir>/jest.setup.js"]` to jest config).

`src/lib/roles.ts`:
```ts
export type Role = "member" | "leader" | "super_admin";
export type TabKey = "home" | "groups" | "lead" | "admin" | "profile";
export function tabsForRole(role: Role, leadsAnyGroup: boolean): TabKey[] {
  const tabs: TabKey[] = ["home", "groups"];
  if (leadsAnyGroup || role === "leader") tabs.push("lead");
  if (role === "super_admin") tabs.push("admin");
  tabs.push("profile");
  return tabs;
}
```

`src/lib/stats.ts`:
```ts
export function attendanceRate(present: number, total: number): number {
  return total === 0 ? 0 : Math.round((present / total) * 100);
}
export function summarizeSessions(rows: { present: number; absent: number }[]) {
  if (rows.length === 0) return { sessions: 0, avgRate: 0 };
  const rates = rows.map((r) => attendanceRate(r.present, r.present + r.absent));
  return { sessions: rows.length, avgRate: Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) };
}
```

`src/lib/csv.ts`:
```ts
function cell(v: string | number | null): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export function toCsv(headers: string[], rows: (string | number | null)[][]): string {
  return [headers, ...rows].map((r) => r.map(cell).join(",")).join("\n");
}
```

`src/lib/validation.ts` (zod v4): `signUpSchema = z.object({ fullName: z.string().trim().min(2), email: z.email(), phone: z.string().trim().min(7), password: z.string().min(8) })`; `signInSchema = { email, password: min(1) }`; `groupSchema = { name: min(2), description: string, meetingDay: number 0-6 nullable, meetingTime: string, location: string }`; `announcementSchema = { title: min(2), body: string }`; `profileSchema = { fullName: min(2), phone: min(7) }`.

- [ ] **Step 3: Run tests** `npx jest` → PASS; `npx tsc --noEmit` → clean.
- [ ] **Step 4: Commit** `git commit -am "Add i18n, roles, stats, csv, validation with tests"`

---

### Task 5: Supabase client, types, AuthContext

**Files:**
- Create: `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `src/contexts/AuthContext.tsx`

**Interfaces:**
- Produces: `supabase` (typed client, `isSupabaseConfigured` boolean); `Database` type with Row types for all `lg_*` tables, `profiles`, the three views, and the RPC `Functions`; `useAuth(): { session, user, profile: Profile | null, role: Role, loading, leadsAnyGroup, signIn(email,pw), signUp({fullName,email,phone,password}), signOut(), refreshProfile() }`; type `Profile = Database["public"]["Tables"]["profiles"]["Row"]`.

- [ ] **Step 1: client.ts** — same as the sibling app (AsyncStorage storage, persistSession, no URL detection) plus `export const isSupabaseConfigured = Boolean(URL && KEY)`.
- [ ] **Step 2: types.ts** — hand-written `Database` type: Tables `profiles`, `lg_groups`, `lg_join_requests`, `lg_memberships`, `lg_sessions`, `lg_attendance`, `lg_announcements`, `lg_documents` each with `Row`, `Insert` (optional generated columns), `Update` (all optional), `Relationships: []`; Views `lg_session_stats`, `lg_member_stats`, `lg_group_stats`; Functions `lg_decide_request {Args:{request_id:string; approve:boolean}; Returns: undefined}`, `lg_set_role {Args:{target:string; new_role:string}}`, `lg_assign_leader {Args:{gid:string; target:string|null}}`, `lg_delete_my_account {Args: Record<string,never>}`, `lg_role {Args: Record<string,never>; Returns: string}`. Column types mirror the SQL in Task 1 exactly (numbers for counts, `string` for uuid/date/timestamptz, `number | null` for `meeting_day`).
- [ ] **Step 3: AuthContext.tsx** — mirrors sibling: subscribe to `onAuthStateChange`, `getSession()`; on session load `profiles.select("*").eq("id", uid).single()` and `lg_groups.select("id").eq("leader_id", uid).limit(1)` to set `leadsAnyGroup`. `signUp` calls `supabase.auth.signUp({ email, password, options: { data: { full_name, phone } } })` and returns `{ error, needsConfirmation: !data.session }`. `signOut` clears state. `refreshProfile()` re-fetches.
- [ ] **Step 4: Typecheck** `npx tsc --noEmit` → clean.
- [ ] **Step 5: Commit** `git commit -am "Add Supabase client, types, and auth context"`

---

### Task 6: Query layer

**Files:**
- Create: `src/lib/queries/groups.ts`, `requests.ts`, `memberships.ts`, `sessions.ts`, `announcements.ts`, `documents.ts`, `stats.ts`, `people.ts`, `src/lib/queries/keys.ts`

**Interfaces (all hooks use TanStack Query; mutations invalidate the listed keys):**
- `keys`: `groups.all`, `groups.one(id)`, `groups.mine(uid)`, `requests.mine(uid)`, `requests.forLeader(uid)`, `members(groupId)`, `sessions(groupId)`, `attendance(sessionId)`, `announcements(groupId)`, `announcementsFeed(uid)`, `documents(groupId)`, `stats.group(groupId)`, `stats.members(groupId)`, `stats.all`, `people.all`.
- `groups.ts`: `useActiveGroups()` → `Group[]` with `leader: { full_name } | null` (select `*, leader:profiles!lg_groups_leader_id_fkey(full_name)`), `useGroup(id)`, `useMyGroups(uid)` (memberships joined to groups), `useLedGroups(uid)`, `useUpsertGroup()` (insert or update), `useAssignLeader()` (rpc).
- `requests.ts`: `useMyRequests(uid)` → map `group_id → status`; `useRequestJoin()` mutation `{ groupId, message }` doing upsert on `(group_id,user_id)` with `status: "pending"`; `usePendingRequestsForLeader(uid)` → requests with `profile:profiles(full_name, phone, email)` and `group:lg_groups(name)` where `status = pending` and group leader is uid (select via `lg_groups!inner(leader_id)` filter `group.leader_id = uid`); `useDecideRequest()` → rpc `lg_decide_request`.
- `memberships.ts`: `useMembers(groupId)` → `{ user_id, joined_at, profile: { full_name, phone, email } }[]`; `useRemoveMember()`.
- `sessions.ts`: `useSessions(groupId)` (desc by date), `useEnsureSession()` mutation `{ groupId, date, topic }` upsert on `(group_id, session_date)` returning row, `useAttendance(sessionId)` → `Record<userId, "present"|"absent">`, `useSaveAttendance()` mutation `{ sessionId, marks: {user_id,status}[] }` upsert on `(session_id,user_id)`, `useMyAttendance(groupId, uid)` → sessions with my status.
- `announcements.ts`: `useAnnouncements(groupId)`, `useAnnouncementsFeed(uid)` (announcements for all my groups with `group:lg_groups(name)`, latest 20), `useCreateAnnouncement()`, `useDeleteAnnouncement()`.
- `documents.ts`: `useDocuments(groupId)`, `useUploadDocument()` mutation `{ groupId, uri, name, mimeType, size }`: reads file with `expo-file-system` `readAsStringAsync(uri, { encoding: "base64" })` → `decode` to ArrayBuffer (small helper `base64ToArrayBuffer`) → `supabase.storage.from("lg-documents").upload(path, buffer, { contentType })` → insert row; `useOpenDocument()` → `createSignedUrl(path, 300)` then `WebBrowser.openBrowserAsync(url)`; `useDeleteDocument()` removes object then row.
- `stats.ts`: `useGroupSessionStats(groupId)` (view `lg_session_stats` desc), `useGroupMemberStats(groupId)` (view `lg_member_stats`), `useAllGroupStats()` (view `lg_group_stats` ordered by name), `useOverview()` derived: totals from `lg_group_stats` + `profiles` count by role (super admin only).
- `people.ts`: `usePeople(search)` → profiles ordered by name; `useSetRole()` → rpc `lg_set_role`; `useUpdateMyProfile()` → update own row; `useDeleteMyAccount()` → rpc then `signOut`.

- [ ] **Step 1: Write all modules** with the signatures above. Every hook wraps errors so `error.message` is a plain string.
- [ ] **Step 2: Typecheck** → clean.
- [ ] **Step 3: Commit** `git commit -am "Add query layer for groups, requests, attendance, announcements, documents, stats"`

---

### Task 7: Root layout, gate, and public screens

**Files:**
- Create: `app/_layout.tsx`, `app/index.tsx`, `app/+not-found.tsx`, `app/(public)/_layout.tsx`, `app/(public)/welcome.tsx`, `app/(public)/groups.tsx`, `app/(public)/group/[id].tsx`, `app/(public)/sign-in.tsx`, `app/(public)/sign-up.tsx`, `src/components/GroupCard.tsx`, `src/components/LangToggle.tsx`

**Behavior:**
- `_layout.tsx`: load fonts with `useFonts` (Anton, Inter 400/500/600, JetBrains Mono), keep splash until loaded; providers: SafeArea → QueryClient → LanguageProvider → AuthProvider; `<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>`; `<Toast/>`; StatusBar light. If `!isSupabaseConfigured` render a full-screen notice "Falta configurar Supabase / Supabase is not configured" instead of the Stack.
- `index.tsx`: while `loading` show `<Loading/>`; then `<Redirect href={session ? "/(app)/home" : "/(public)/welcome"} />`.
- `welcome.tsx`: Logo 120, Eyebrow "The Vine Apostolic Church", Display "Grupos de Vida / Life Groups", Body muted intro, Button primary "Explorar grupos / Browse groups" → `/(public)/groups`, Button secondary "Iniciar sesión / Sign in", ghost "Crear cuenta / Create account". LangToggle top-right.
- `groups.tsx`: list of `useActiveGroups()` as `GroupCard` (name, day+time, location, leader name) → `/(public)/group/[id]`.
- `group/[id].tsx`: group details; button "Solicitar unirme / Request to join" → if not signed in, `router.push({ pathname: "/(public)/sign-up", params: { next: `/(app)/groups/${id}` } })`.
- `sign-in.tsx`: form (react-hook-form + zod `signInSchema`), on success `router.replace(next ?? "/(app)/home")`, link to sign-up. Errors via Toast.
- `sign-up.tsx`: fields fullName, email, phone, password; on success if `needsConfirmation` show inline Card "Revisa tu correo / Check your email" with a button to sign-in; else replace to next.
- `GroupCard`: Card with Display 20 name, Body muted line `DAYS[lang][meeting_day] · meeting_time`, Body muted location, optional right-side `Badge` (`status` prop: pending/approved/declined/member).
- `LangToggle`: two Pressables "ES | EN", active in primary.

- [ ] **Step 1: Write the files** exactly as described, all copy through `t()`.
- [ ] **Step 2: Typecheck** → clean. Start `npx expo start --ios` on the booted simulator; welcome renders with fonts; navigating to groups shows the list or empty state.
- [ ] **Step 3: Commit** `git commit -am "Add root layout, auth gate, and public screens"`

---

### Task 8: Signed-in shell, member portal, profile

**Files:**
- Create: `app/(app)/_layout.tsx`, `app/(app)/home.tsx`, `app/(app)/groups/index.tsx`, `app/(app)/groups/[id].tsx`, `app/(app)/group/[id]/_layout.tsx`, `app/(app)/group/[id]/index.tsx`, `app/(app)/group/[id]/documents.tsx`, `app/(app)/group/[id]/attendance.tsx`, `app/(app)/profile.tsx`, `src/components/AnnouncementCard.tsx`, `src/components/DocumentRow.tsx`, `src/components/StatTile.tsx`

**Behavior:**
- `(app)/_layout.tsx`: if no session `<Redirect href="/(public)/welcome"/>`. `Tabs` with `tabBarStyle` bg `surfaceDeep`, border-top `border`, active tint primary, inactive muted, labels in Inter 500 uppercase 10px. Tabs from `tabsForRole(role, leadsAnyGroup)`; hidden tabs get `href: null`. Icons (lucide): Home, Users, ClipboardList (lead), Shield (admin), User (profile). Non-tab routes (`group/[id]`, `groups/[id]`, `lead/[groupId]/*`, `admin/*` sub-screens) registered with `href: null`.
- `home.tsx`: greeting Display with first name; "Mis grupos / My groups" list of `useMyGroups(uid)` → `/(app)/group/[id]`; "Anuncios recientes / Recent announcements" from `useAnnouncementsFeed(uid)` (AnnouncementCard with group name badge); if no groups, Empty with button to Groups tab.
- `groups/index.tsx`: browse all active groups with status badge from `useMyRequests` + membership; tap → `groups/[id]`.
- `groups/[id].tsx`: details + request button; if pending show Badge and disable; if member show button "Abrir portal / Open portal" → `group/[id]`. Optional message Input.
- `group/[id]/_layout.tsx`: Stack with a custom header (back + group name) and a segmented top bar with three links: Anuncios, Documentos, Asistencia.
- `group/[id]/index.tsx`: announcements list (`useAnnouncements`), Empty state.
- `group/[id]/documents.tsx`: `DocumentRow` list; tap → `useOpenDocument`.
- `group/[id]/attendance.tsx`: `useMyAttendance` → StatTile "Asistencia / Attendance" with rate, then list of sessions with present/absent badges.
- `profile.tsx`: Avatar + name + role badge; editable form (fullName, phone) with `useUpdateMyProfile`; LangToggle; Button secondary "Cerrar sesión / Sign out"; Button destructive "Eliminar cuenta / Delete account" with `Alert.alert` confirm → `useDeleteMyAccount`.
- `AnnouncementCard`: Card with Eyebrow date (formatDate), Display 18 title, Body body, optional group name Badge, optional `onDelete`.
- `DocumentRow`: Pressable row with FileText icon, title, muted size (KB) and date, optional trash icon.
- `StatTile`: Card with Eyebrow label, Display 32 value, optional Body muted hint.

- [ ] **Step 1: Write the files.**
- [ ] **Step 2: Typecheck + simulator check**: sign in as a member (test user), home renders, groups tab shows request flow, profile edits save.
- [ ] **Step 3: Commit** `git commit -am "Add signed-in shell, member portal, and profile"`

---

### Task 9: Leader screens

**Files:**
- Create: `app/(app)/lead/index.tsx`, `app/(app)/lead/requests.tsx`, `app/(app)/lead/[groupId]/_layout.tsx`, `app/(app)/lead/[groupId]/index.tsx`, `app/(app)/lead/[groupId]/attendance.tsx`, `app/(app)/lead/[groupId]/post.tsx`, `app/(app)/lead/[groupId]/upload.tsx`, `app/(app)/lead/[groupId]/report.tsx`, `src/components/RequestRow.tsx`, `src/components/MemberRow.tsx`

**Behavior:**
- `lead/index.tsx`: header "Liderazgo / Leading"; pending-requests StatTile linking to `lead/requests`; list of `useLedGroups(uid)` with members count → `lead/[groupId]`.
- `lead/requests.tsx`: `usePendingRequestsForLeader(uid)` as `RequestRow` (Avatar, name, phone, group name, message, Approve/Decline buttons calling `useDecideRequest`). Empty state.
- `lead/[groupId]/_layout.tsx`: header with group name + segmented links: Grupo, Asistencia, Reporte.
- `lead/[groupId]/index.tsx`: roster (`useMembers`) as `MemberRow` (Avatar, name, phone with `Linking.openURL("tel:")`, joined date, remove via long-press Alert); action buttons: "Publicar anuncio / Post announcement" → `post`, "Subir documento / Upload document" → `upload`; below, the group's announcements (with delete) and documents (with delete).
- `lead/[groupId]/attendance.tsx`: date picker as an Input (YYYY-MM-DD, default today) + topic Input; on "Abrir sesión / Open session" call `useEnsureSession`; then roster with a two-state toggle per member (Present = primary, Absent = destructive outline), default absent for unmarked, "Guardar / Save" → `useSaveAttendance`. Past sessions list below; tapping one loads it for editing.
- `lead/[groupId]/post.tsx`: form title/body (`announcementSchema`) → `useCreateAnnouncement` → back.
- `lead/[groupId]/upload.tsx`: Input title, Button "Elegir archivo / Choose file" (`DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })`), shows chosen name/size, Button "Subir / Upload" → `useUploadDocument` → back.
- `lead/[groupId]/report.tsx`: StatTiles (members, sessions, avg rate) from `useGroupSessionStats` + `summarizeSessions`; per-session rows (date, present/total, rate); per-member rows from `useGroupMemberStats` (name, present/sessions, rate) sorted by rate asc so the leader sees who needs follow-up.

- [ ] **Step 1: Write the files.**
- [ ] **Step 2: Typecheck + simulator check** as a leader: approve a request, take attendance, post, upload, view report.
- [ ] **Step 3: Commit** `git commit -am "Add leader screens: requests, roster, attendance, posts, uploads, report"`

---

### Task 10: Super admin screens

**Files:**
- Create: `app/(app)/admin/index.tsx`, `app/(app)/admin/groups.tsx`, `app/(app)/admin/group-form.tsx`, `app/(app)/admin/people.tsx`, `app/(app)/admin/reports.tsx`

**Behavior:**
- `admin/index.tsx` (Dashboard tab): StatTiles: groups, members (distinct memberships), leaders, pending requests, average attendance (mean of `avg_rate` over groups with sessions). Links: Groups, People, Reports.
- `admin/groups.tsx`: all groups (incl. inactive with Badge) from `useAllGroupStats`; tap → `group-form?id=`; FAB-style Button "Nuevo grupo / New group" → `group-form`.
- `admin/group-form.tsx`: fields name, description, meeting day (7 chips), time, location, is_active switch, leader picker (searchable list from `usePeople`, shows current leader) → `useUpsertGroup` then `useAssignLeader` if leader changed.
- `admin/people.tsx`: search Input; list of profiles with role Badge; tap → Alert action sheet to set role (member/leader/super_admin) via `useSetRole`.
- `admin/reports.tsx`: table-like list from `useAllGroupStats`: group, leader, members, sessions, avg rate, last session; Button "Compartir CSV / Share CSV" builds `toCsv` and writes to `FileSystem.cacheDirectory + "life-groups-report.csv"` then `Sharing.shareAsync`. Second section "Por líder / By leader" aggregating rows by `leader_name`.

- [ ] **Step 1: Write the files.**
- [ ] **Step 2: Typecheck + simulator check** as super admin: create a group, assign a leader, promote a user, share CSV.
- [ ] **Step 3: Commit** `git commit -am "Add super admin dashboard, groups, people, and reports"`

---

### Task 11: README, memory notes, final verification

**Files:**
- Create: `vine-life-groups-app/README.md`
- Modify: memory index in the Claude memory directory (project notes about the app)

- [ ] **Step 1: README** covering: prerequisites, `.env` setup, running the SQL, making the pastor super admin, enabling sign-ups, `npx expo start --ios`, EAS build/submit commands, App Store checklist (privacy policy URL on the website, account deletion present, screenshots).
- [ ] **Step 2: Run** `npx jest` and `npx tsc --noEmit`; both clean. Screenshot the welcome, home, leader attendance, and admin dashboard on the simulator and send them to the user.
- [ ] **Step 3: Commit** `git commit -am "Add README and setup notes"`

---

## Self-review

- Spec coverage: roles (T1, T5), data model + RLS + RPCs + views + storage (T1), website hardening (T1), app structure and tabs (T7–T10), sign-up/join/approve/attendance/announcements/documents/reports/delete account (T8–T10), i18n (T4), theme (T2–T3), error handling via toasts and Empty states (T7–T10), tests (T3–T4), App Store config (T2, T11). No gaps found.
- Type consistency: `Role`, `TabKey`, `tabsForRole`, `useAuth` fields, query hook names are used with the same names across tasks.
