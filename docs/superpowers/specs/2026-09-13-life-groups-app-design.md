# Vine Life Groups mobile app — design

Date: 2026-09-13
Status: approved in chat (stack, backend, language, overall design)

## Goal

A public iOS/Android app, branded like thevinehouston.org, where anyone can
sign up and request to join a life group; group leaders approve requests,
see their roster, take attendance, and post announcements and documents;
members see their group's announcements and documents; and a super admin
(the pastor) sees every group's stats and pulls reports.

## Decisions already made

| Topic    | Decision                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack    | Expo SDK 57 (the sibling `../apexcommission-native` is on 55; the simulator's Expo Go required 57), expo-router, NativeWind 4, TanStack Query, supabase-js, EAS builds. |
| Backend  | The website's existing Supabase project (`yyevvpuuvilzdnhefusv`). New tables prefixed `lg_`.                                                                            |
| Language | Spanish default with English toggle, same `t(es, en)` API as the website.                                                                                               |
| Location | Sibling folder `/Users/lezdev/Desktop/Williams/vine-life-groups-app` (own git repo). SQL lives in the website repo at `supabase/life-groups.sql`.                       |
| Design   | Same tokens as the site: navy background, sky-blue primary, gold accent, Anton display, Inter body, JetBrains Mono eyebrows, square corners, `vine-logo.png`.           |

## Roles

One `public.profiles` row per auth user. `role` is one of:

- `member` (default on sign-up). Can browse groups, request to join, and see
  the portal for groups they belong to.
- `leader`. Everything a member can do, plus manage the groups where
  `lg_groups.leader_id` is them.
- `super_admin`. Everything, across all groups. Assigns roles and leaders.

Promotion happens only through the `lg_set_role` RPC (caller must be
`super_admin`). The very first super admin is set by SQL on the pastor's
existing account.

## Data model (Postgres, all in `public`)

```
profiles          id (auth.users), full_name, email, phone, role, created_at
lg_groups         id, name, description, meeting_day (0-6), meeting_time,
                  location, leader_id -> profiles, is_active, created_at, updated_at
lg_join_requests  id, group_id, user_id, message, status (pending|approved|declined),
                  decided_by, decided_at, created_at, updated_at
                  unique (group_id, user_id); re-requesting flips status back to pending
lg_memberships    id, group_id, user_id, joined_at        unique (group_id, user_id)
lg_sessions       id, group_id, session_date, topic, created_by, created_at
                  unique (group_id, session_date)
lg_attendance     id, session_id, user_id, status (present|absent), marked_at
                  unique (session_id, user_id)
lg_announcements  id, group_id, author_id, title, body, created_at, updated_at
lg_documents      id, group_id, uploader_id, title, storage_path, mime_type,
                  size_bytes, created_at
```

Storage: private bucket `lg-documents`, object path `<group_id>/<uuid>-<filename>`.
Members read via short-lived signed URLs.

### Triggers and helpers

- `handle_new_user()` on `auth.users` insert creates the `profiles` row from
  `raw_user_meta_data` (full_name, phone). Backfill existing users once.
- `set_updated_at()` already exists; reused.
- `lg_role()` returns the caller's role. `lg_is_leader_of(group_id)`,
  `lg_is_member_of(group_id)` are `security definer` helpers used in RLS.

### RPCs (`security definer`, authorization inside)

- `lg_decide_request(request_id, approve)` — leader of that group or super
  admin. On approve: set status, insert membership.
- `lg_set_role(user_id, role)` — super admin only.
- `lg_assign_leader(group_id, user_id)` — super admin only; also promotes the
  user to leader if they are a member.
- `lg_delete_my_account()` — deletes the caller's auth user. Apple requires
  in-app account deletion for apps with sign-up.

### Reporting views (`security_invoker = true`, so RLS still applies)

- `lg_session_stats` — per session: present, absent, total members, rate.
- `lg_member_stats` — per (group, member): sessions, present, rate.
- `lg_group_stats` — per group: members, pending requests, sessions, average
  rate, last session date.

### RLS summary

| Table                  | anon        | member                 | leader (own groups)        | super_admin                   |
| ---------------------- | ----------- | ---------------------- | -------------------------- | ----------------------------- |
| profiles               | –           | own row read/update    | read members of own groups | read all, update role via RPC |
| lg_groups              | read active | read active            | read active, update own    | all                           |
| lg_join_requests       | –           | insert/read/update own | read + decide via RPC      | all                           |
| lg_memberships         | –           | read own               | read own groups            | all                           |
| lg_sessions            | –           | read own groups        | CRUD own groups            | all                           |
| lg_attendance          | –           | read own rows          | CRUD own groups            | all                           |
| lg_announcements       | –           | read own groups        | CRUD own groups            | all                           |
| lg_documents           | –           | read own groups        | CRUD own groups            | all                           |
| storage `lg-documents` | –           | read own groups' paths | write own groups' paths    | all                           |

### Website hardening (same SQL file)

The website's `announcements`, `site_settings`, and `subscribers` write
policies currently allow any authenticated user. They are rewritten to
require `lg_role() = 'super_admin'` so app members cannot edit the site.
The pastor's account must be `super_admin` before the site admin is used
again. Supabase public sign-ups must be enabled for the app.

## App structure

```
vine-life-groups-app/
  app/
    _layout.tsx               providers: fonts, query, auth, language, toast
    index.tsx                 splash gate -> (public) or (app)
    (public)/                 welcome, groups, groups/[id], sign-in, sign-up
    (app)/_layout.tsx         tab bar; tabs shown by role
    (app)/home.tsx            member portal: my groups, latest announcements
    (app)/groups/             browse + detail + request to join
    (app)/group/[id]/         portal: announcements, documents, my attendance
    (app)/lead/               leaders: my groups, requests, roster,
                              attendance, post/upload, group report
    (app)/admin/              super admin: dashboard, groups CRUD, people,
                              reports + CSV share
    (app)/profile.tsx         name/phone, language, sign out, delete account
  src/
    integrations/supabase/    client (AsyncStorage session), generated types
    contexts/                 AuthContext (session + profile), LanguageContext
    lib/                      theme tokens, i18n, queries, csv, stats helpers
    components/ui/            Button, Input, Card, Badge, Eyebrow, Avatar, Empty
    components/               GroupCard, AnnouncementCard, DocumentRow,
                              AttendanceRow, StatTile
  assets/                     icon, splash, adaptive icon (logo on navy)
  supabase types generated from the project
```

Tabs by role: Home, Groups, Profile for everyone; Lead for leaders; Admin for
super admins. A super admin also sees Lead if they lead a group.

## Key flows

- **Sign-up**: full name, email, phone, password. If Supabase email
  confirmation is on, the app shows a "check your email" state. Profile row
  is created by trigger.
- **Request to join**: from a group's detail screen, optional message.
  Shows pending/approved/declined state on the card. Declined can re-request.
- **Approve**: leader's Requests tab lists pending requests for their groups
  with the requester's name and phone. Approve/decline call the RPC.
- **Attendance**: leader picks a date (default today), sees roster with
  present/absent toggles, saves in one upsert. Editing a past session works
  the same way.
- **Announcements/documents**: leader posts text; uploads via document picker
  to Storage then inserts row. Members open documents through a signed URL in
  the system browser.
- **Reports**: leader sees per-session and per-member rates for their group.
  Super admin sees totals, per-group table, per-leader table, and can share
  a CSV (expo-file-system + expo-sharing).
- **Delete account**: confirm dialog, RPC, sign out.

## Error handling

- All queries through TanStack Query with loading/empty/error states.
- Mutations show a toast on failure; RLS denials surface as "not allowed".
- Supabase env missing: app shows a configuration screen instead of crashing.
- Offline: cached queries render; mutations fail with a toast.

## Testing

- Jest (jest-expo) unit tests for pure logic: i18n selection, attendance
  rate math, CSV builder, sign-up validation schema, role-to-tabs mapping.
- Manual RLS checklist in the SQL file header: member cannot read another
  group's data, leader cannot decide a request for another group, member
  cannot edit site announcements.
- Smoke run on the iOS simulator for each role.

## App Store

- Name "Vine Life Groups", bundle id `org.thevinehouston.lifegroups`, dark
  UI style, portrait.
- EAS `development`, `preview`, `production` profiles like the sibling app.
- Needs from the user: Supabase anon key for `.env`, `eas init` login,
  Apple Developer account, and a privacy policy page on the website
  (`/privacy`) for the App Store listing. The privacy page is a separate
  small task on the website repo.

## Out of scope (for now)

Push notifications, chat, in-app group creation by leaders (super admin
creates groups), avatars, Android Play submission assets beyond the icon.
