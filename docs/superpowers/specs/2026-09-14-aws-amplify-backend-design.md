# Move Life Groups (and the website) from Supabase to AWS Amplify — design

Date: 2026-09-14
Status: approved in chat (Amplify Gen 2, website too, plus a local demo mode)
Supersedes the backend section of `2026-09-13-life-groups-app-design.md`.

## Goal

Replace Supabase with AWS for the Life Groups app and, in a second phase,
for the website's announcements, live settings, subscribers and `/admin`.
Because the AWS account is not ready yet, the app must also run fully
offline in a **demo mode** backed by local storage, with seeded groups and
demo accounts for every role, so the whole app can be tried today.

## Decisions

| Topic                   | Decision                                                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS stack               | Amplify Gen 2: Cognito (auth), Amplify Data on DynamoDB (API), S3 (storage), Lambda functions for privileged operations.                                                                     |
| Where the backend lives | `vine-life-groups-app/amplify/`. One backend serves the app and the website. The website receives a copy of `amplify_outputs.json`.                                                          |
| Roles                   | Cognito groups `LEADERS` and `ADMINS`. Everyone else is a member. `Profile.role` mirrors the group for display and querying.                                                                 |
| Demo mode               | `EXPO_PUBLIC_BACKEND=demo` (or no `amplify_outputs.json`) selects a local backend in AsyncStorage. A "Try the demo" entry on the welcome screen signs in as a demo member, leader, or admin. |
| Supabase                | Removed from the app now and from the website in phase 2. `supabase/life-groups.sql` is deleted.                                                                                             |

## Backend interface (app side)

All screens keep using the existing TanStack Query hooks in
`src/lib/queries/*`. Those hooks stop calling supabase-js and instead call a
`Backend` object from `src/lib/backend/`:

```
Backend {
  auth:   signUp, confirmSignUp, signIn, signOut, currentUser, deleteAccount
  me:     getProfile, updateProfile
  groups: listActive, get, listMine, listLed, upsert(admin), assignLeader(admin)
  requests: mine, requestJoin, pendingForLeader, decide
  members: list(groupId), remove
  sessions: list, ensure, attendance(sessionId), save, myAttendance
  announcements: list, feed, create, delete
  documents: list, upload, url, delete
  stats: groupSessions, groupMembers, allGroups, overview
  people: list(search), setRole
}
```

Two implementations:

- `backend/demo.ts` — state in memory, persisted to AsyncStorage under one
  key, seeded on first run (3 groups, 1 leader, 6 members, 4 past
  sessions with attendance, announcements, one document). Demo accounts:
  `member@demo`, `leader@demo`, `admin@demo` (any password). Sign-up in
  demo mode creates a local member. Uploads store the picked file's URI.
  A "Reset demo data" button lives on the Profile screen in demo mode.
- `backend/amplify.ts` — `aws-amplify` v6 `generateClient<Schema>()` for
  models and the custom operations below; `Auth` for Cognito; `Storage`
  is only touched from Lambda (presigned URLs).

`backend/index.ts` picks the implementation from `EXPO_PUBLIC_BACKEND`
(`demo` | `amplify`, default `amplify` when `amplify_outputs.json` exists,
otherwise `demo`). The root layout shows a small "DEMO" badge when demo mode
is active.

## Amplify backend

### Auth (`amplify/auth/resource.ts`)

Email login; required attributes `name`, `phone_number`. Groups
`LEADERS`, `ADMINS`. Trigger `postConfirmation` creates the `Profile`.
Account deletion goes through `deleteMyAccount` (Lambda,
`AdminDeleteUser` + record cleanup) so Apple's requirement is met.

### Data (`amplify/data/resource.ts`)

All group-scoped records carry `groupId` and a denormalised `leaderId`
(the group's leader at write time). Owner rules on `leaderId` give a
leader exact access to their own groups.

| Model            | Fields                                                                       | Rules                                                                                      |
| ---------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Profile          | id = Cognito sub, fullName, email, phone, role                               | owner read/update (not `role`); authenticated read `fullName`; ADMINS all                  |
| Group            | name, description, meetingDay, meetingTime, location, leaderId, isActive     | public (API key) + authenticated read; `ownerDefinedIn(leaderId)` update; ADMINS all       |
| JoinRequest      | groupId, leaderId, userId, message, status, decidedBy, decidedAt             | owner(userId) read; `ownerDefinedIn(leaderId)` read; ADMINS all; writes only via functions |
| Membership       | groupId, leaderId, userId, joinedAt                                          | owner(userId) read; `ownerDefinedIn(leaderId)` read/delete; ADMINS all                     |
| Session          | groupId, leaderId, sessionDate, topic                                        | `ownerDefinedIn(leaderId)` all; ADMINS all                                                 |
| Attendance       | sessionId, groupId, leaderId, userId, status                                 | owner(userId) read; `ownerDefinedIn(leaderId)` all; ADMINS all                             |
| Announcement     | groupId, leaderId, authorId, title, body                                     | `ownerDefinedIn(leaderId)` all; ADMINS all; members read via `groupPortal`                 |
| Document         | groupId, leaderId, title, s3Key, mimeType, sizeBytes                         | `ownerDefinedIn(leaderId)` all; ADMINS all; members read via `groupPortal`                 |
| SiteAnnouncement | title, body, eventDate, eventTime, linkUrl, linkLabel, isPinned, isPublished | public read where published (filtered in query); ADMINS all                                |
| SiteSetting      | key, value                                                                   | public read; ADMINS all                                                                    |
| Subscriber       | email                                                                        | public create; ADMINS read/delete                                                          |

Secondary indexes: `Group.byLeader`, `JoinRequest.byGroup`, `Membership.byGroup`,
`Membership.byUser`, `Session.byGroup`, `Attendance.bySession`,
`Attendance.byUser`, `Announcement.byGroup`, `Document.byGroup`.

### Custom operations (Lambda handlers, authorization checked in code)

| Operation                                | Who                                  | Does                                                                                |
| ---------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| `requestJoin(groupId, message)`          | authenticated                        | upsert JoinRequest as pending with the group's leaderId                             |
| `decideRequest(requestId, approve)`      | leader of that group or ADMINS       | set status; on approve create Membership                                            |
| `assignLeader(groupId, userId)`          | ADMINS                               | set Group.leaderId, rewrite leaderId on that group's records, add user to `LEADERS` |
| `setRole(userId, role)`                  | ADMINS                               | add/remove Cognito groups, update Profile.role                                      |
| `saveAttendance(sessionId, marks[])`     | leader of that group or ADMINS       | upsert Attendance rows                                                              |
| `groupPortal(groupId)`                   | member of that group, leader, ADMINS | announcements, documents, sessions with my attendance                               |
| `documentUrl(documentId)`                | member/leader/ADMINS of that group   | presigned S3 GET URL (5 min)                                                        |
| `uploadUrl(groupId, fileName, mimeType)` | leader/ADMINS                        | presigned S3 PUT URL + key; client then creates Document                            |
| `groupReport(groupId)`                   | leader/ADMINS                        | per-session and per-member rates                                                    |
| `adminOverview()`                        | ADMINS                               | totals + per-group rows                                                             |
| `deleteMyAccount()`                      | authenticated                        | delete Cognito user and the caller's records                                        |
| `feed()`                                 | authenticated                        | latest announcements across my groups                                               |

Functions use the data client with IAM auth (`allow.resource(fn)`), the
Cognito admin API for group changes, and the S3 SDK for presigned URLs.

### Storage (`amplify/storage/resource.ts`)

Bucket `lg-documents`; path `groups/{groupId}/*` accessible only to the
functions. Clients never get direct bucket access.

## App changes

- Remove `@supabase/supabase-js`, `src/integrations/supabase`.
- Add `aws-amplify`, `@aws-amplify/react-native`,
  `react-native-get-random-values`, `react-native-url-polyfill`, and dev
  deps `@aws-amplify/backend`, `@aws-amplify/backend-cli`, `aws-cdk-lib`,
  `constructs`, `esbuild`, `tsx`.
- `AuthContext` reads the user from `Backend.auth`; `role` from Cognito
  groups (or the demo user), `leadsAnyGroup` from `groups.listLed`.
- Sign-up gains a confirmation-code screen (`(public)/confirm.tsx`).
- Welcome screen gets a "Try the demo" link (demo mode only) that opens a
  chooser: member, leader, admin.
- Profile screen gets "Reset demo data" in demo mode.
- Types: `Schema` from `amplify/data/resource` replaces the hand-written
  Supabase types; shared row types live in `src/lib/backend/types.ts` so
  the demo backend and the UI share them.

## Website changes (phase 2)

- Remove `src/integrations/supabase`, `drizzle/`, `supabase/`.
- Add `aws-amplify`; configure with the copied `amplify_outputs.json`.
- `src/lib/announcements.ts`, `settings.ts`, `subscribers.ts` call the
  Amplify data client. Server loaders use the API key auth mode; `/admin`
  uses Cognito user-pool auth and requires the `ADMINS` group.
- `/admin` login uses `signIn` from `aws-amplify/auth`; everything else on
  the admin page keeps its current UI.

## Testing

- Unit tests (jest): the demo backend's authorization behaviour (member
  cannot decide a request, leader cannot decide another group's request),
  stats math, and the role mapping from Cognito groups.
- Simulator run in demo mode through every role: browse, request, approve,
  attendance, post, upload, reports, role change, account delete.
- Once credentials work: `npx ampx sandbox`, create test users, repeat the
  role walkthrough against the sandbox.

## Out of scope

Push notifications, offline sync for the Amplify mode, migrating any
existing Supabase data (there is none in production).
