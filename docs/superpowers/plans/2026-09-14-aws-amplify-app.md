# Life Groups App on AWS Amplify + Demo Mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Supabase in the Life Groups app with an AWS Amplify Gen 2 backend, behind a `Backend` interface that also has a local-storage demo implementation with seeded data and demo accounts.

**Architecture:** Screens keep calling the TanStack Query hooks in `src/lib/queries/*`; the hooks call a `Backend` object instead of supabase-js. `backend/demo.ts` keeps all state in one AsyncStorage document and enforces the same role rules in code. `backend/amplify.ts` uses `aws-amplify` v6 against models and Lambda-backed custom operations defined in `amplify/`. Authorization for anything group-scoped is checked inside Lambda handlers, mirroring the old SQL RPCs.

**Tech Stack:** Expo SDK 57, TanStack Query 5, AsyncStorage, aws-amplify 6.20, @aws-amplify/react-native 1.3, @aws-amplify/backend 1.25, @aws-amplify/backend-cli 1.10, aws-cdk-lib 2, @aws-sdk/client-cognito-identity-provider, @aws-sdk/client-s3 + s3-request-presigner, jest-expo.

**Spec:** `docs/superpowers/specs/2026-09-14-aws-amplify-backend-design.md` (website repo).

## Global Constraints

- App repo: `/Users/lezdev/Desktop/Williams/vine-life-groups-app`. Backend definition in `amplify/` inside it.
- `EXPO_PUBLIC_BACKEND=demo` | `amplify`; default `amplify` when `amplify_outputs.json` exists at the repo root, otherwise `demo`.
- Demo accounts: `member@demo`, `leader@demo`, `admin@demo`, any password. AsyncStorage key `vine-demo-v1`.
- Roles: `member` | `leader` | `super_admin` in the UI; Cognito groups `LEADERS` / `ADMINS` map to `leader` / `super_admin`.
- Row types shared by UI, demo and Amplify live in `src/lib/backend/types.ts`. Hook names and return shapes in `src/lib/queries/*` stay the same so screens do not change (except sign-up confirmation and the demo entry points).
- All copy through `t(es, en)`. Tests via `npx jest`; typecheck via `npx tsc --noEmit`. Commit after each task.
- Supabase packages and `src/integrations/supabase` are deleted in Task 6; `vine-growing-web/supabase/life-groups.sql` is deleted in Task 8.

---

## File map

- `src/lib/backend/types.ts` — row types (`Profile`, `Group`, `JoinRequest`, `Membership`, `Session`, `Attendance`, `Announcement`, `Document`, stats rows) and the `Backend` interface.
- `src/lib/backend/errors.ts` — `BackendError` with codes `not_allowed`, `not_found`, `not_signed_in`, `confirm_required`.
- `src/lib/backend/demo/seed.ts` — seed document builder.
- `src/lib/backend/demo/store.ts` — load/save the document in AsyncStorage.
- `src/lib/backend/demo/index.ts` — `createDemoBackend()`.
- `src/lib/backend/amplify/index.ts` — `createAmplifyBackend()`.
- `src/lib/backend/index.ts` — `backend`, `backendMode`, `isDemo`.
- `amplify/backend.ts`, `amplify/auth/resource.ts`, `amplify/data/resource.ts`, `amplify/storage/resource.ts`, `amplify/functions/<name>/resource.ts` + `handler.ts` for: `post-confirmation`, `request-join`, `decide-request`, `assign-leader`, `set-role`, `save-attendance`, `group-portal`, `document-url`, `upload-url`, `group-report`, `admin-overview`, `delete-my-account`, `feed`; shared `amplify/functions/shared/{client,authz}.ts`.
- `src/lib/queries/*.ts` — rewritten on top of `backend`.
- `src/contexts/AuthContext.tsx` — rewritten on top of `backend.auth`.
- `app/(public)/confirm.tsx`, welcome demo chooser, profile reset button, `DemoBadge` in root layout.
- `__tests__/demo-backend.test.ts`, `__tests__/roles.test.ts` (extend).

---

### Task 1: Backend types and interface

**Files:**
- Create: `src/lib/backend/types.ts`, `src/lib/backend/errors.ts`

**Interfaces (Produces):**

```ts
export type Role = "member" | "leader" | "super_admin";
export type Profile = { id: string; fullName: string; email: string; phone: string; role: Role; createdAt: string };
export type Group = { id: string; name: string; description: string; meetingDay: number | null; meetingTime: string; location: string; leaderId: string | null; isActive: boolean; createdAt: string; leader?: { fullName: string; phone: string } | null };
export type RequestStatus = "pending" | "approved" | "declined";
export type JoinRequest = { id: string; groupId: string; leaderId: string | null; userId: string; message: string; status: RequestStatus; decidedBy: string | null; decidedAt: string | null; createdAt: string };
export type PendingRequest = JoinRequest & { profile: { fullName: string; phone: string; email: string } | null; group: { name: string } | null };
export type Membership = { id: string; groupId: string; leaderId: string | null; userId: string; joinedAt: string };
export type Member = Membership & { profile: { fullName: string; phone: string; email: string } | null };
export type Session = { id: string; groupId: string; sessionDate: string; topic: string; createdAt: string };
export type AttendanceStatus = "present" | "absent";
export type Announcement = { id: string; groupId: string; authorId: string | null; title: string; body: string; createdAt: string; group?: { name: string } | null };
export type Document = { id: string; groupId: string; title: string; storagePath: string; mimeType: string; sizeBytes: number; createdAt: string };
export type SessionStats = { sessionId: string; groupId: string; sessionDate: string; topic: string; present: number; absent: number; members: number; rate: number };
export type MemberStats = { groupId: string; userId: string; fullName: string; phone: string; joinedAt: string; sessions: number; present: number; rate: number };
export type GroupStats = { groupId: string; name: string; leaderId: string | null; leaderName: string | null; isActive: boolean; members: number; pending: number; sessions: number; lastSession: string | null; avgRate: number };
export type Overview = { groups: number; activeGroups: number; members: number; leaders: number; pending: number; avgRate: number };
export type MySessionAttendance = Session & { status: AttendanceStatus | null };
export type AuthUser = { id: string; email: string; role: Role };
export type SignUpInput = { fullName: string; email: string; phone: string; password: string };
export type GroupInput = { id?: string; name: string; description: string; meetingDay: number | null; meetingTime: string; location: string; isActive: boolean };
export type UploadInput = { groupId: string; title: string; uri: string; name: string; mimeType: string; size: number };

export interface Backend {
  mode: "demo" | "amplify";
  auth: {
    currentUser(): Promise<AuthUser | null>;
    signIn(email: string, password: string): Promise<AuthUser>;
    signUp(input: SignUpInput): Promise<{ needsConfirmation: boolean }>;
    confirmSignUp(email: string, code: string): Promise<void>;
    signOut(): Promise<void>;
    deleteAccount(): Promise<void>;
    onChange(cb: () => void): () => void;
  };
  me: { getProfile(): Promise<Profile | null>; updateProfile(input: { fullName: string; phone: string }): Promise<Profile> };
  groups: {
    listActive(): Promise<Group[]>; get(id: string): Promise<Group | null>;
    listMine(): Promise<(Group & { joinedAt: string })[]>; listLed(): Promise<(Group & { memberCount: number })[]>;
    upsert(input: GroupInput): Promise<Group>; assignLeader(groupId: string, userId: string | null): Promise<void>;
  };
  requests: {
    mine(): Promise<Record<string, RequestStatus>>; requestJoin(groupId: string, message: string): Promise<void>;
    pendingForLeader(): Promise<PendingRequest[]>; decide(requestId: string, approve: boolean): Promise<void>;
  };
  members: { list(groupId: string): Promise<Member[]>; remove(membershipId: string): Promise<void> };
  sessions: {
    list(groupId: string): Promise<Session[]>; ensure(groupId: string, date: string, topic: string): Promise<Session>;
    attendance(sessionId: string): Promise<Record<string, AttendanceStatus>>;
    save(sessionId: string, marks: { userId: string; status: AttendanceStatus }[]): Promise<void>;
    myAttendance(groupId: string): Promise<MySessionAttendance[]>;
  };
  announcements: { list(groupId: string): Promise<Announcement[]>; feed(): Promise<Announcement[]>; create(groupId: string, title: string, body: string): Promise<Announcement>; delete(id: string): Promise<void> };
  documents: { list(groupId: string): Promise<Document[]>; upload(input: UploadInput): Promise<Document>; url(doc: Document): Promise<string>; delete(doc: Document): Promise<void> };
  stats: { groupSessions(groupId: string): Promise<SessionStats[]>; groupMembers(groupId: string): Promise<MemberStats[]>; allGroups(): Promise<GroupStats[]>; overview(): Promise<Overview> };
  people: { list(search: string): Promise<Profile[]>; setRole(userId: string, role: Role): Promise<void> };
  demo?: { reset(): Promise<void>; accounts: { email: string; role: Role; label: { es: string; en: string } }[] };
}
```

`errors.ts`:
```ts
export type BackendErrorCode = "not_allowed" | "not_found" | "not_signed_in" | "confirm_required" | "invalid";
export class BackendError extends Error { constructor(public code: BackendErrorCode, message?: string) { super(message ?? code); this.name = "BackendError"; } }
```

- [ ] Step 1: Write both files exactly as above. Step 2: `npx tsc --noEmit` clean. Step 3: commit `git commit -m "Add Backend interface and row types"`.

---

### Task 2: Demo backend (TDD)

**Files:**
- Create: `src/lib/backend/demo/seed.ts`, `store.ts`, `index.ts`
- Test: `__tests__/demo-backend.test.ts`

**Interfaces:**
- Consumes: Task 1 types.
- Produces: `createDemoBackend(opts?: { storage?: { get(): Promise<string|null>; set(v: string): Promise<void> } }): Backend` (storage defaults to AsyncStorage under `vine-demo-v1`; tests pass an in-memory storage). `DEMO_ACCOUNTS`.

**Seed** (`seed.ts`): ids are fixed strings (`u-leader`, `u-admin`, `u-member`, `u-m2`..`u-m6`, `g-norte`, `g-centro`, `g-jovenes`). Groups: "Grupo Norte" (Tue 7:00 PM, leader `u-leader`), "Grupo Centro" (Thu 7:30 PM, leader `u-leader`), "Jóvenes" (Sat 6:00 PM, leader `u-admin`). Memberships: `u-member`, `u-m2`, `u-m3`, `u-m4` in Norte; `u-m5`, `u-m6` in Centro. One pending request from `u-m5` to Norte with a message. Four Norte sessions on the last four Tuesdays with attendance (`u-member` present 3/4, `u-m2` 4/4, `u-m3` 2/4, `u-m4` 1/4). Two Norte announcements, one Centro announcement, one Norte document (`storagePath: "demo://guia-estudio.pdf"`). Profiles for every user, roles: `u-leader` → leader, `u-admin` → super_admin, others member. Emails `member@demo`, `leader@demo`, `admin@demo`, `m2@demo`…

**Document shape** (`store.ts`): `{ version: 1; currentUserId: string | null; profiles; groups; requests; memberships; sessions; attendance; announcements; documents; passwords: Record<string,string> }` with arrays of the Task 1 row types (Group without `leader`). `load()` returns the parsed doc or the seed; `save(doc)` stringifies.

**Rules** enforced in `index.ts` (throw `BackendError("not_allowed")`):
- `requests.decide`: caller must be leader of the request's group or super_admin.
- `groups.upsert`, `groups.assignLeader`, `people.setRole`, `stats.overview`, `stats.allGroups`, `people.list`: super_admin only (`people.list` also allowed for leaders? no — super_admin only; leaders get member profiles through `members.list`).
- `sessions.ensure/save`, `announcements.create/delete`, `documents.upload/delete`, `members.remove`, `stats.groupSessions/groupMembers`: leader of that group or super_admin.
- `announcements.list`, `documents.list`, `sessions.myAttendance`: member of group, its leader, or super_admin.
- `auth.signIn`: demo accounts accept any password; sign-ups store the password and must match.
- `auth.signUp` in demo: creates profile with role member, signs in immediately, `needsConfirmation: false`.
- `auth.deleteAccount`: removes profile, memberships, requests, attendance of current user; signs out.
- `assignLeader`: sets group.leaderId, rewrites `leaderId` on that group's requests/memberships, promotes the user to leader if member.
- Stats computed like the old SQL views (rates rounded, `avgRate` over sessions).
- `demo.reset()`: overwrite the doc with the seed (keeping nobody signed in).

- [ ] **Step 1: Failing tests**

```ts
import { createDemoBackend } from "@/lib/backend/demo";
function mem() { let v: string | null = null; return { get: async () => v, set: async (s: string) => { v = s; } }; }
async function backendAs(email: string) { const b = createDemoBackend({ storage: mem() }); await b.auth.signIn(email, "x"); return b; }

test("member browses active groups and requests to join", async () => {
  const b = await backendAs("member@demo");
  const groups = await b.groups.listActive();
  expect(groups.map((g) => g.name)).toEqual(["Grupo Centro", "Grupo Norte", "Jóvenes"]);
  await b.requests.requestJoin("g-centro", "hola");
  expect((await b.requests.mine())["g-centro"]).toBe("pending");
});

test("leader sees only their pending requests and can approve", async () => {
  const b = await backendAs("leader@demo");
  const pending = await b.requests.pendingForLeader();
  expect(pending.map((r) => r.userId)).toEqual(["u-m5"]);
  await b.requests.decide(pending[0]!.id, true);
  expect((await b.members.list("g-norte")).some((m) => m.userId === "u-m5")).toBe(true);
});

test("member cannot decide a request or read another group's announcements", async () => {
  const b = await backendAs("member@demo");
  await expect(b.requests.decide("r-1", true)).rejects.toMatchObject({ code: "not_allowed" });
  await expect(b.announcements.list("g-centro")).rejects.toMatchObject({ code: "not_allowed" });
  expect((await b.announcements.list("g-norte")).length).toBe(2);
});

test("attendance stats match the seed", async () => {
  const b = await backendAs("leader@demo");
  const sessions = await b.stats.groupSessions("g-norte");
  expect(sessions).toHaveLength(4);
  const members = await b.stats.groupMembers("g-norte");
  expect(members[0]!.rate).toBe(25);
});

test("admin overview and role change", async () => {
  const b = await backendAs("admin@demo");
  const o = await b.stats.overview();
  expect(o.groups).toBe(3);
  await b.people.setRole("u-m2", "leader");
  expect((await b.people.list("m2")).find((p) => p.id === "u-m2")?.role).toBe("leader");
});

test("state persists through storage", async () => {
  const storage = mem();
  const a = createDemoBackend({ storage });
  await a.auth.signIn("member@demo", "x");
  await a.requests.requestJoin("g-centro", "");
  const b = createDemoBackend({ storage });
  expect((await b.auth.currentUser())?.id).toBe("u-member");
  expect((await b.requests.mine())["g-centro"]).toBe("pending");
});
```
Run `npx jest demo-backend` → FAIL (module missing).

- [ ] **Step 2: Implement** `seed.ts`, `store.ts`, `index.ts` per the rules above. Ids for new rows: `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`. Every mutating method ends with `await save(doc)`. Every read method starts with `const doc = await load()`.
- [ ] **Step 3:** `npx jest demo-backend` → PASS. `npx tsc --noEmit` clean.
- [ ] **Step 4:** Commit `"Add demo backend with seed data and role rules"`.

---

### Task 3: Backend selector and query hooks rewired to the interface

**Files:**
- Create: `src/lib/backend/index.ts`, `src/lib/backend/amplify/index.ts` (stub that throws `BackendError("invalid", "Amplify backend not configured")` from every method, replaced in Task 5)
- Modify: every file in `src/lib/queries/`, `src/contexts/AuthContext.tsx`

**Interfaces:**
- Produces: `backend: Backend`, `backendMode`, `isDemo`. Hooks keep their names; `useAuth()` keeps `{ session, user, profile, role, leadsAnyGroup, loading, signIn, signUp, signOut, refreshProfile }` and adds `confirmSignUp(email, code)`. `session` becomes `AuthUser | null`; `user` the same object.

- [ ] Step 1: `index.ts`:
```ts
import { createDemoBackend } from "./demo";
import { createAmplifyBackend } from "./amplify";
let outputs: unknown = null;
try { outputs = require("../../../amplify_outputs.json"); } catch { outputs = null; }
const requested = process.env.EXPO_PUBLIC_BACKEND;
export const backendMode: "demo" | "amplify" = requested === "demo" ? "demo" : requested === "amplify" ? "amplify" : outputs ? "amplify" : "demo";
export const isDemo = backendMode === "demo";
export const backend = backendMode === "demo" ? createDemoBackend() : createAmplifyBackend(outputs);
```
(Metro resolves the `require` at bundle time; when the file is absent the try/catch must be around a `require` of a literal path, and a `amplify_outputs.json` placeholder is NOT committed. Add `amplify_outputs.json` to `.gitignore`.)
- [ ] Step 2: Rewrite hooks: each `queryFn` becomes a one-line call, e.g. `useActiveGroups → backend.groups.listActive()`, `useMyGroups(uid) → backend.groups.listMine()` (uid only gates `enabled`), `useRequestJoin → backend.requests.requestJoin(groupId, message)`, `useUploadDocument(groupId) → backend.documents.upload({ groupId, ...input })`, `useOpenDocument → WebBrowser.openBrowserAsync(await backend.documents.url(doc))` — for demo `demo://` paths show an Alert "Demo document" instead of opening. Keep invalidation keys. Field names change to camelCase (`fullName`, `meetingDay`, `sessionDate`, `joinedAt`, `createdAt`, `storagePath`, `sizeBytes`, `isActive`, `leaderId`, `userId`, `groupId`, `avgRate`, `lastSession`, `leaderName`); update every screen and component that reads a row field (GroupCard `meeting_day → meetingDay`, etc.).
- [ ] Step 3: `AuthContext`: on mount `backend.auth.currentUser()`, then `backend.me.getProfile()` and `backend.groups.listLed()`; subscribe with `backend.auth.onChange`. `signIn/signUp/confirmSignUp/signOut` delegate.
- [ ] Step 4: `npx tsc --noEmit` clean; `npx jest` passes. Simulator: `EXPO_PUBLIC_BACKEND=demo` in `.env`; sign in as `member@demo` and walk Home, Groups, group portal. Commit `"Route all data access through the Backend interface"`.

---

### Task 4: Demo entry points and confirmation screen

**Files:**
- Create: `app/(public)/confirm.tsx`, `src/components/DemoBadge.tsx`
- Modify: `app/(public)/welcome.tsx`, `app/(public)/sign-up.tsx`, `app/(app)/profile.tsx`, `app/_layout.tsx`, `src/lib/i18n` (nothing), `.env.example`

- [ ] Step 1: Welcome: when `isDemo`, add a ghost button "Probar la demo / Try the demo" that opens an `Alert.alert` chooser with `backend.demo!.accounts` (Miembro, Líder, Administrador); choosing one calls `signIn(email, "demo")` and replaces to `/(app)/home`.
- [ ] Step 2: `DemoBadge`: absolute top-left pill "DEMO" in mono on accent; rendered in `_layout.tsx` when `isDemo`. Replace the Supabase "not configured" screen with nothing (demo always works).
- [ ] Step 3: Sign-up: when `needsConfirmation`, `router.replace({ pathname: "/(public)/confirm", params: { email, next } })`. `confirm.tsx`: 6-digit code Input, "Confirmar / Confirm" → `confirmSignUp(email, code)` then `signIn` is not possible without the password, so show "Cuenta confirmada, inicia sesión / Account confirmed, sign in" and route to sign-in with `email` prefilled (`params.email` → default value).
- [ ] Step 4: Profile: when `isDemo`, secondary button "Reiniciar datos demo / Reset demo data" → `backend.demo!.reset()` then `signOut()`.
- [ ] Step 5: `.env.example` gains `EXPO_PUBLIC_BACKEND=demo`. Typecheck, simulator walkthrough of all three demo accounts. Commit `"Add demo mode entry points and sign-up confirmation"`.

---

### Task 5: Amplify backend definition

**Files:**
- Create: `amplify/backend.ts`, `amplify/auth/resource.ts`, `amplify/data/resource.ts`, `amplify/storage/resource.ts`, `amplify/functions/shared/client.ts`, `amplify/functions/shared/authz.ts`, and for each of `post-confirmation`, `request-join`, `decide-request`, `assign-leader`, `set-role`, `save-attendance`, `group-portal`, `document-url`, `upload-url`, `group-report`, `admin-overview`, `delete-my-account`, `feed`: `amplify/functions/<name>/resource.ts` and `handler.ts`
- Modify: `package.json` (deps), `tsconfig.json` (exclude `amplify/**` from the app typecheck; amplify has its own `amplify/tsconfig.json`), `.gitignore` (`.amplify/`, `amplify_outputs.json`)

**Deps:** `npm i aws-amplify @aws-amplify/react-native react-native-get-random-values react-native-url-polyfill` and `npm i -D @aws-amplify/backend @aws-amplify/backend-cli aws-cdk-lib constructs esbuild tsx @aws-sdk/client-cognito-identity-provider @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`.

- [ ] Step 1: `auth/resource.ts`:
```ts
import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "../functions/post-confirmation/resource";
export const auth = defineAuth({
  loginWith: { email: true },
  userAttributes: { fullname: { required: true, mutable: true }, phoneNumber: { required: true, mutable: true } },
  groups: ["LEADERS", "ADMINS"],
  triggers: { postConfirmation },
  access: (allow) => [allow.resource(postConfirmation).to(["addUserToGroup"])],
});
```
- [ ] Step 2: `data/resource.ts`: models from the spec table with `a.model({...}).secondaryIndexes(...)` and `.authorization((allow) => [...])`; custom operations as `a.mutation()/a.query()` with `.arguments({...})`, `.returns(a.json())` (or typed `a.ref`), `.authorization((allow) => [allow.authenticated()])`, `.handler(a.handler.function(fn))`. Schema authorization grants each function access: `schema.authorization((allow) => [allow.resource(fn1), ...])`. Default auth mode `userPool`, API key enabled (30 days expiry) for public reads.
- [ ] Step 3: `storage/resource.ts`: `defineStorage({ name: "lg-documents", access: (allow) => ({ "groups/*": [allow.resource(documentUrl).to(["read"]), allow.resource(uploadUrl).to(["write"]), allow.resource(deleteDocument?).to(["delete"])] }) })` — deletes happen inside `documentUrl`'s sibling? No: add a 14th function `delete-document` (leader/ADMINS) that removes the S3 object and the row.
- [ ] Step 4: `functions/shared/client.ts`: `getDataClient()` using `Amplify.configure(getAmplifyDataClientConfig(env))` + `generateClient<Schema>()` with IAM auth, per the Amplify Gen 2 "data from function" docs. `authz.ts`: `callerId(event)`, `callerGroups(event)`, `isAdmin`, `assertLeaderOf(groupId)` (fetches Group, compares `leaderId`), `assertMemberOf(groupId)`.
- [ ] Step 5: Each handler implements exactly the behaviour listed in the spec's operations table, throwing `Error("not_allowed")`.
- [ ] Step 6: `amplify/backend.ts` wires `auth`, `data`, `storage`, and grants Cognito admin actions to `set-role`, `assign-leader`, `delete-my-account` via `backend.<fn>.resources.lambda.addToRolePolicy(...)` on the user pool ARN.
- [ ] Step 7: `npx ampx sandbox --once` deploys when credentials work (`aws sts get-caller-identity` first). Until then: `npx tsc -p amplify/tsconfig.json --noEmit` must pass. Commit `"Add Amplify Gen 2 backend definition"`.

---

### Task 6: Amplify client backend and Supabase removal

**Files:**
- Modify: `src/lib/backend/amplify/index.ts` (real implementation), `app/_layout.tsx` (polyfills + `Amplify.configure(outputs)` when in amplify mode), `package.json`
- Delete: `src/integrations/supabase/*`, `@supabase/supabase-js`

- [ ] Step 1: Implement `createAmplifyBackend(outputs)`: `Amplify.configure(outputs)`; `auth.*` via `aws-amplify/auth` (`signUp` with `userAttributes: { name, phone_number }` in E.164 — normalise US numbers by prefixing `+1` when 10 digits), `fetchAuthSession` for groups → role; models via `client.models.X.list/get/create/update/delete` with the secondary index queries (`client.models.Membership.listMembershipByUserId`); custom ops via `client.mutations.decideRequest({...})` / `client.queries.groupPortal({...})`; `documents.upload` = `uploadUrl` → `fetch(url, { method: "PUT", body: await new File(uri).arrayBuffer() })` → `Document.create`; `documents.url` = `documentUrl`.
- [ ] Step 2: `_layout.tsx` top: `import "react-native-get-random-values"; import "react-native-url-polyfill/auto";`.
- [ ] Step 3: Remove Supabase files and dependency; grep for `supabase` returns nothing. Typecheck + jest. Commit `"Add Amplify client backend; remove Supabase"`.

---

### Task 7: Live verification against a sandbox (needs credentials)

- [ ] Step 1: `aws sts get-caller-identity` succeeds. `npx ampx sandbox` (leave running) → writes `amplify_outputs.json`.
- [ ] Step 2: Set `EXPO_PUBLIC_BACKEND=amplify` in `.env`, restart Expo with `--clear`.
- [ ] Step 3: Sign up a member on the simulator (confirmation code arrives by email; use a real inbox), create the pastor user, add to ADMINS: `aws cognito-idp admin-add-user-to-group --user-pool-id <id> --username <email> --group-name ADMINS`.
- [ ] Step 4: Walk every role flow from the spec's Testing section. Fix and commit as needed.

---

### Task 8: Docs and cleanup

- [ ] Step 1: README rewrite (demo mode, sandbox, production deploy `npx ampx pipeline-deploy` / Amplify Hosting branch, adding the pastor to ADMINS, App Store notes unchanged).
- [ ] Step 2: Website repo: delete `supabase/life-groups.sql`, update memory notes. Commit both repos.

## Self-review

- Spec coverage: interface (T1), demo (T2, T4), selector + hooks (T3), Amplify auth/data/storage/functions (T5), client + Supabase removal (T6), live test (T7), docs (T8). Website phase is a separate plan.
- Types: hook return shapes reference Task 1 names; `Backend` method names match between T2, T3, T5/T6.
