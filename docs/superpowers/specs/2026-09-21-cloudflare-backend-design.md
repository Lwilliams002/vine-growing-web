# Life Groups backend on Cloudflare — design

Date: 2026-09-21
Status: approved in chat (Cloudflare instead of AWS Amplify; free plan)
Supersedes `2026-09-14-aws-amplify-backend-design.md`. The demo mode and the
`Backend` interface from that spec stay exactly as they are.

## Goal

Run the Life Groups app against a real backend on the church's existing
Cloudflare account (the one that hosts thevineapostolic.com), on the free
plan, with no AWS. Phase 2 later moves the website's announcements, live
settings, subscribers and `/admin` onto the same API and database.

## Decisions

| Topic    | Decision                                                                                                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compute  | One Cloudflare Worker, Hono router, TypeScript. Lives in the app repo at `vine-life-groups-app/api/`.                                                                                                                                        |
| Database | D1 (SQLite). Plain SQL migrations in `api/migrations/`, prepared statements, no ORM.                                                                                                                                                         |
| Files    | R2 bucket `vine-lg-documents`. Uploads and downloads go through the Worker, so no S3 keys or presigned URLs are needed.                                                                                                                      |
| Auth     | Hand-rolled email + password: PBKDF2-SHA256 (100k iterations, WebCrypto) password hashes, random bearer session tokens stored hashed, 90-day expiry. No email verification for now (Resend can be added later for codes and password reset). |
| Roles    | `users.role` = member / leader / super_admin. First super admin is set with one SQL statement; after that the People screen.                                                                                                                 |
| URL      | `https://api.thevineapostolic.com` (custom domain route on the Worker).                                                                                                                                                                      |
| App      | New `src/lib/backend/cloudflare/index.ts` implementing `Backend` over fetch. `EXPO_PUBLIC_BACKEND=cloudflare` and `EXPO_PUBLIC_API_URL` select it. The Amplify backend and `amplify/` folder are deleted.                                    |
| Tests    | Vitest with `@cloudflare/vitest-pool-workers`: the API runs against a real local D1 and R2 in tests; the role rules are asserted the same way the demo backend tests do.                                                                     |

## Why hand-rolled auth

better-auth works on Workers but its default scrypt hashing exceeds the free
plan's 10 ms CPU budget and it needs an ORM adapter. Email + password with
PBKDF2 through WebCrypto (native, a few ms) plus a sessions table is about
150 lines, fully testable, and gives Apple the in-app account deletion it
requires.

## Database schema (D1)

```
users          id TEXT pk, email UNIQUE, password_hash, password_salt, full_name, phone,
               gender (male|female|unspecified), is_baptized INTEGER, role, created_at
sessions       token_hash TEXT pk, user_id, expires_at, created_at
groups         id, name, description, meeting_day INTEGER null, meeting_time, location,
               leader_id null, is_active INTEGER, created_at, updated_at
join_requests  id, group_id, user_id, message, status, decided_by, decided_at, created_at
               UNIQUE(group_id, user_id)
memberships    id, group_id, user_id, joined_at          UNIQUE(group_id, user_id)
sessions_lg    id, group_id, session_date, topic, created_by, created_at   UNIQUE(group_id, session_date)
attendance     id, session_id, group_id, user_id, status, marked_at        UNIQUE(session_id, user_id)
announcements  id, group_id, author_id, title, body, created_at
documents      id, group_id, uploader_id, title, r2_key, mime_type, size_bytes, created_at
```

`sessions_lg` is the meeting sessions table (named to avoid the auth
`sessions` table). Ids are `crypto.randomUUID()`. Dates are ISO strings.

## API

All routes return JSON; errors are `{ error: code, message }` with codes
`not_signed_in` (401), `not_allowed` (403), `not_found` (404), `invalid` (400).
Authenticated routes read `Authorization: Bearer <token>`.

| Route                                                                                                                                        | Who                 | Backend method                     |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------------------------------- |
| POST /auth/sign-up, /auth/sign-in, /auth/sign-out, DELETE /auth/account, GET /auth/me                                                        | – / user            | auth.*                             |
| GET/PATCH /me                                                                                                                                | user                | me.getProfile / updateProfile      |
| GET /groups, GET /groups/:id                                                                                                                 | anyone              | groups.listActive / get            |
| GET /groups/mine, GET /groups/led                                                                                                            | user                | groups.listMine / listLed          |
| POST /groups, PATCH /groups/:id, PUT /groups/:id/leader                                                                                      | super_admin         | groups.upsert / assignLeader       |
| GET /requests/mine, POST /groups/:id/requests                                                                                                | user                | requests.mine / requestJoin        |
| GET /requests/pending, POST /requests/:id/decide                                                                                             | leader/admin        | requests.pendingForLeader / decide |
| GET /groups/:id/members, DELETE /memberships/:id                                                                                             | leader/admin        | members.*                          |
| GET /groups/:id/sessions, PUT /groups/:id/sessions (ensure), GET /sessions/:id/attendance, PUT /sessions/:id/attendance                      | leader/admin        | sessions.*                         |
| GET /groups/:id/attendance/mine                                                                                                              | member              | sessions.myAttendance              |
| GET /groups/:id/announcements (member/leader), GET /announcements/feed, POST /groups/:id/announcements, DELETE /announcements/:id            |                     | announcements.*                    |
| GET /groups/:id/documents, POST /groups/:id/documents (multipart), GET /documents/:id/url, GET /documents/:id/file?t=, DELETE /documents/:id |                     | documents.*                        |
| GET /groups/:id/report, GET /stats/groups, GET /stats/overview                                                                               | leader/admin, admin | stats.*                            |
| GET /people?q=, PUT /people/:id/role                                                                                                         | super_admin         | people.*                           |

Document downloads: `/documents/:id/url` returns a link to
`/documents/:id/file?t=<HMAC token, 5 min>`; the file route verifies the token
and streams the R2 object, so the phone's browser can open it without a
bearer header.

Authorization helpers in the Worker mirror the demo backend:
`isAdmin(user)`, `assertLeaderOf(db, user, groupId)`,
`assertPortalAccess(db, user, groupId)` (member, leader, or admin).

## App changes

- `backend/cloudflare/index.ts`: thin fetch client; token in AsyncStorage
  under `vine-session`; `auth.onChange` fires after sign-in/out.
- `backend/index.ts` mode selection: `demo` | `cloudflare` (default
  `cloudflare` when `EXPO_PUBLIC_API_URL` is set, else `demo`).
- Sign-up no longer needs the confirmation screen; it is kept for a later
  email-verification feature but skipped (`needsConfirmation: false`).
- Delete `src/lib/backend/amplify`, `amplify/`, and the aws-amplify
  dependencies.

## Deployment

- `api/wrangler.jsonc`: worker `vine-life-groups-api`, D1 binding `DB`, R2
  binding `DOCS`, secret `SESSION_SECRET` (HMAC key for file links).
- `npx wrangler d1 create vine-life-groups`, `npx wrangler r2 bucket create vine-lg-documents`,
  `npx wrangler d1 migrations apply vine-life-groups --remote`, `npx wrangler deploy`.
- Custom domain `api.thevineapostolic.com` added in the dashboard or via
  `routes` in wrangler config.
- Free-plan headroom: 100k requests/day, D1 5 GB, R2 10 GB; well beyond a
  church's usage.

## Phase 2 (website, later)

Add tables `site_announcements`, `site_settings`, `subscribers` and routes
`/site/*` to the same Worker; the website's loaders call the API with fetch
(public reads) and `/admin` signs in with the same email + password auth,
requiring `super_admin`. That removes Lovable Cloud / Supabase from the site.

## Testing

- Worker tests (vitest-pool-workers): sign-up/sign-in round trip; member
  cannot decide a request or read another group's announcements; leader can
  approve and take attendance; admin overview totals; document upload,
  signed link, and download.
- App: existing 22 unit tests keep passing; simulator run against
  `wrangler dev` (local D1) through every role, then against the deployed API.
