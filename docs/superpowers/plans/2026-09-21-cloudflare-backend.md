# Life Groups API on Cloudflare — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Cloudflare Worker (Hono + D1 + R2) that serves the Life Groups app through the existing `Backend` interface, with hand-rolled email/password auth, tested against a local D1, and deployed to `api.thevineapostolic.com`.

**Architecture:** `vine-life-groups-app/api/` is a self-contained Worker project. `src/index.ts` mounts Hono routers (`auth`, `groups`, `requests`, `members`, `sessions`, `announcements`, `documents`, `stats`, `people`). `src/lib/db.ts` wraps D1 queries; `src/lib/auth.ts` does PBKDF2 hashing and bearer sessions; `src/lib/authz.ts` holds the role checks used by every router. The app gets `src/lib/backend/cloudflare/index.ts`, a fetch client that maps 1:1 onto the routes.

**Tech Stack:** wrangler 4, hono 4, D1, R2, @cloudflare/vitest-pool-workers + vitest for Worker tests, TypeScript; app side: expo-file-system `File` for multipart uploads.

**Spec:** `docs/superpowers/specs/2026-09-21-cloudflare-backend-design.md`

## Global Constraints

- API folder: `/Users/lezdev/Desktop/Williams/vine-life-groups-app/api` with its own `package.json` (npm), `wrangler.jsonc`, `tsconfig.json`, `vitest.config.ts`.
- Bindings: `DB` (D1 `vine-life-groups`), `DOCS` (R2 `vine-lg-documents`), var/secret `SESSION_SECRET`.
- Error JSON `{ error, message }` with codes `not_signed_in` 401, `not_allowed` 403, `not_found` 404, `invalid` 400.
- Row shapes returned by the API use the app's camelCase types from `src/lib/backend/types.ts` exactly (`fullName`, `meetingDay`, `sessionDate`, `joinedAt`, `storagePath`, …).
- Roles `member | leader | super_admin`. Time in ISO strings; dates `YYYY-MM-DD`.
- Tests: `npm test` in `api/` runs vitest in the Workers pool. Commit after every task.

---

### Task 1: Worker scaffold, schema, auth library (TDD)

**Files:** `api/package.json`, `api/wrangler.jsonc`, `api/tsconfig.json`, `api/vitest.config.ts`, `api/migrations/0001_init.sql`, `api/src/lib/auth.ts`, `api/src/lib/db.ts`, `api/src/lib/errors.ts`, `api/src/index.ts` (health route), `api/test/auth.test.ts`

**Interfaces (Produces):**

- `hashPassword(pw): Promise<{hash, salt}>`, `verifyPassword(pw, hash, salt): Promise<boolean>` (PBKDF2-SHA256, 100 000 iterations, 32-byte salt, base64).
- `createSession(db, userId): Promise<string token>`; `userFromToken(db, token): Promise<User|null>`; `revokeSession(db, token)`.
- `signFileToken(secret, documentId, expiresAt)`, `verifyFileToken(secret, token): documentId|null` (HMAC-SHA256).
- `ApiError(code, message)`; Hono `onError` maps it to status.
- `Env = { DB: D1Database; DOCS: R2Bucket; SESSION_SECRET: string }`.
- Migration creates the nine tables from the spec.

Steps: write `auth.test.ts` (hash/verify round trip, wrong password false, session create → lookup → revoke, file token verify/expire) → run, fail → implement → pass → commit.

### Task 2: Auth + profile routes

**Files:** `api/src/routes/auth.ts`, `api/src/routes/me.ts`, `api/test/api.test.ts` (shared helper `signUpAs(app, env, {...})` returning a token)

Routes: `POST /auth/sign-up` (fullName, email, phone, password, gender, isBaptized → creates user role member → `{ token, user }`), `POST /auth/sign-in`, `POST /auth/sign-out`, `DELETE /auth/account` (deletes user rows: memberships, requests, attendance, sessions; nulls `groups.leader_id`), `GET /auth/me` → `{ id, email, role }`, `GET /me` → Profile, `PATCH /me` → Profile.
Tests: sign-up then me; duplicate email 400; wrong password 401; delete account then me 401.

### Task 3: Groups, requests, members

**Files:** `api/src/lib/authz.ts`, `api/src/routes/groups.ts`, `requests.ts`, `members.ts`; tests appended to `api/test/api.test.ts` with a seeded fixture (`seed(env)` inserting admin, leader, 2 members, 2 groups, one membership, one pending request).

Rules exactly as the demo backend (`assertAdmin`, `assertLeaderOf`, `assertPortalAccess`). Group rows include `leader: { fullName, phone } | null`.
Tests: member browses groups; member requests join → pending; leader sees only own pending; leader approves → membership exists; member cannot decide (403); admin creates group and assigns leader → user promoted.

### Task 4: Meetings, attendance, announcements, documents, stats, people

**Files:** `api/src/routes/sessions.ts`, `announcements.ts`, `documents.ts`, `stats.ts`, `people.ts`; tests appended.

Documents: `POST /groups/:id/documents` reads `multipart/form-data` (`file`, `title`) and `DOCS.put(key, stream)`; `GET /documents/:id/url` → `{ url }` with a 5-minute HMAC token; `GET /documents/:id/file?t=` verifies and streams with `Content-Type`/`Content-Disposition`.
Stats computed in SQL/JS like the demo backend; `GET /stats/overview` returns `Overview`, `GET /stats/groups` returns `GroupStats[]`, `GET /groups/:id/report` returns `{ sessions, members }`.
Tests: leader ensures session + saves attendance → report rates; member cannot read other group's announcements; upload → url → file round trip; admin overview totals; setRole.

### Task 5: App client backend

**Files:** `src/lib/backend/cloudflare/index.ts`, modify `src/lib/backend/index.ts`, `.env.example`; delete `src/lib/backend/amplify`, `amplify/`, Amplify deps; `app/_layout.tsx` polyfill imports removed.

`createCloudflareBackend(apiUrl)`: `request(path, { method, body, auth })` adds bearer from AsyncStorage `vine-session`, throws `BackendError(code)` from error JSON. Map every `Backend` method to the route table in the spec. `documents.upload` builds `FormData` with `{ uri, name, type }` (React Native file object) — no manual byte reading needed.
Typecheck + jest pass; simulator run against `npx wrangler dev` (`EXPO_PUBLIC_API_URL=http://localhost:8787`).

### Task 6: Deploy

`npx wrangler login` (user) → `d1 create`, `r2 bucket create`, write ids into `wrangler.jsonc`, `d1 migrations apply --remote`, `secret put SESSION_SECRET`, `wrangler deploy`, add custom domain `api.thevineapostolic.com`, make the pastor super_admin via `d1 execute`. App `.env` → cloudflare mode; EAS build env → `EXPO_PUBLIC_BACKEND=cloudflare`, `EXPO_PUBLIC_API_URL`. README update.

## Self-review

Spec coverage: schema/auth (T1–2), authorization and every route group (T3–4), app client + Amplify removal (T5), deployment/domain/first admin (T6). Phase 2 website intentionally excluded.
