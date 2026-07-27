# Invite Member Notifications & List Invitations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send a Resend email when a user is invited to an org, insert an in-app notification, and expose a `GET /v1/me/invitations` endpoint so users can see pending invitations.

**Architecture:** The invite use case stays pure — the route handler enqueues a BullMQ job after success, and the worker resolves org/inviter names from the DB, sends the email via Resend, and inserts the in-app notification row. The "list invitations" feature adds one repo method + one use case + one route, following the existing module pattern exactly.

**Tech Stack:** Resend SDK (`resend` npm package), BullMQ (already wired), Drizzle ORM, ElysiaJS, TypeBox

## Global Constraints

- Runtime: Bun only — no Node-only APIs
- Linting: Biome only — `bun check` must pass
- No `any` without a biome-ignore comment explaining why
- No logic in route handlers beyond calling a use case + `toApiResponse` (exception: enqueue a job after use case success — this is side-effect plumbing, not business logic)
- Use cases are pure functions: `(repo, input) => Promise<Result<T>>` — never touch BullMQ or Resend directly
- Commit format: `<type>: <subject>` (no co-author trailers)
- All new env vars added to `src/shared/env.ts` via `requireEnv()`

---

## File Map

| Action | Path |
|---|---|
| Modify | `apps/api/package.json` |
| Modify | `apps/api/src/shared/env.ts` |
| Create | `apps/api/src/shared/lib/resend.ts` |
| Modify | `apps/api/src/shared/lib/bullmq.ts` |
| Modify | `apps/api/src/shared/lib/workers.ts` |
| Modify | `apps/api/src/modules/organizations/organization.entity.ts` |
| Modify | `apps/api/src/modules/organizations/organization.repository.ts` |
| Modify | `apps/api/src/modules/organizations/drizzle-organization.repository.ts` |
| Create | `apps/api/src/modules/organizations/use-cases/list-user-invitations.use-case.ts` |
| Modify | `apps/api/src/modules/organizations/http/v1/routes.ts` |
| Modify | `apps/api/src/modules/organizations/http/v1/schemas.ts` |
| Modify | `apps/api/src/modules/organizations/http/v1/invitation-docs.ts` |
| Modify | `apps/api/src/modules/organizations/http/v1/invitation-routes.ts` |

---

### Task 1: Install Resend + env setup

**Files:**
- Modify: `apps/api/package.json`
- Modify: `apps/api/src/shared/env.ts`
- Modify: `apps/api/.env` (not committed — add `RESEND_API_KEY=re_...`)

**Interfaces:**
- Produces: `env.RESEND_API_KEY: string` — used by Task 2

- [ ] **Step 1: Install resend package**

```bash
cd apps/api && bun add resend
```

- [ ] **Step 2: Add env var to env.ts**

Open `apps/api/src/shared/env.ts` and add after `R2_PUBLIC_URL`:

```typescript
  RESEND_API_KEY: requireEnv('RESEND_API_KEY'),
```

- [ ] **Step 3: Add placeholder to .env**

Add `RESEND_API_KEY=re_your_key_here` to `apps/api/.env` (never commit this file).

- [ ] **Step 4: Typecheck**

```bash
cd apps/api && bun run typecheck
```

Expected: passes (env.ts change is additive).

- [ ] **Step 5: Commit**

```bash
git add apps/api/package.json apps/api/pnpm-lock.yaml apps/api/src/shared/env.ts
git commit -m "feat: add resend dependency and RESEND_API_KEY env var"
```

---

### Task 2: Resend client singleton

**Files:**
- Create: `apps/api/src/shared/lib/resend.ts`

**Interfaces:**
- Consumes: `env.RESEND_API_KEY` from Task 1
- Produces: `resendClient: Resend` — imported by workers.ts in Task 4

- [ ] **Step 1: Create the client file**

```typescript
// apps/api/src/shared/lib/resend.ts
import { Resend } from 'resend'
import { env } from '@/shared/env'

export const resendClient = new Resend(env.RESEND_API_KEY)
```

- [ ] **Step 2: Typecheck**

```bash
cd apps/api && bun run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/shared/lib/resend.ts
git commit -m "feat: add resend client singleton"
```

---

### Task 3: BullMQ — add invitation.sent job type

**Files:**
- Modify: `apps/api/src/shared/lib/bullmq.ts`

**Interfaces:**
- Produces: `NotificationJobData` union now includes `'invitation.sent'` with payload `{ memberId: string; orgId: string; invitedByUserId: string }`
- Downstream: workers.ts (Task 4) and routes.ts (Task 5) import this type

- [ ] **Step 1: Extend the NotificationJobData union**

In `apps/api/src/shared/lib/bullmq.ts`, the current type is:

```typescript
export interface NotificationJobData {
  type:
    | 'match.finished'
    | 'match.rescheduled'
    | 'suspension.confirmed'
    | 'dispute.opened'
    | 'dispute.resolved'
  payload: Record<string, unknown>
}
```

Replace with a discriminated union so each type carries typed payload:

```typescript
export type NotificationJobData =
  | { type: 'match.finished'; payload: { matchId: string } }
  | { type: 'match.rescheduled'; payload: { matchId: string } }
  | { type: 'suspension.confirmed'; payload: { suspensionId: string } }
  | { type: 'dispute.opened'; payload: { disputeId: string; matchId: string; openedBy: string } }
  | { type: 'dispute.resolved'; payload: { disputeId: string; openedBy: string } }
  | { type: 'invitation.sent'; payload: { memberId: string; orgId: string; invitedByUserId: string } }
```

> **Note:** Changing from `interface` to `type` alias is a TS-only change — runtime identical. The existing handlers in workers.ts cast `job.data.payload` with `as`, so they still compile. The switch exhaustiveness check improves.

- [ ] **Step 2: Typecheck**

```bash
cd apps/api && bun run typecheck
```

Expected: passes (workers.ts `as` casts are still valid).

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/shared/lib/bullmq.ts
git commit -m "feat: add invitation.sent job type to NotificationJobData"
```

---

### Task 4: Worker — handleInvitationSent

**Files:**
- Modify: `apps/api/src/shared/lib/workers.ts`

**Interfaces:**
- Consumes: `NotificationJobData` (Task 3), `resendClient` (Task 2)
- Consumes: DB tables — `organizationMembers`, `organizations`, BetterAuth `user` table (inline pgTable ref, already pattern in drizzle-organization.repository.ts)
- No new exports

- [ ] **Step 1: Add resendClient import**

At the top of `workers.ts`, after existing imports, add:

```typescript
import { pgTable, text } from 'drizzle-orm/pg-core'
import { resendClient } from './resend'
```

- [ ] **Step 2: Add betterAuthUsers reference**

After the existing imports block, before `redisConnectionFromUrl`, add:

```typescript
// Minimal read-only reference to BetterAuth's user table for name lookups
const betterAuthUsers = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
})
```

- [ ] **Step 3: Add handleInvitationSent function**

After `handleDisputeResolved` and before `handleAudit`, add:

```typescript
async function handleInvitationSent(payload: {
  memberId: string
  orgId: string
  invitedByUserId: string
}) {
  const [memberRow] = await db
    .select({
      user_id: organizationMembers.user_id,
      invited_email: organizationMembers.invited_email,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .where(eq(organizationMembers.id, payload.memberId))
    .limit(1)

  if (!memberRow) return

  const [orgRow] = await db
    .select({ name: organizations.name })
    .from(organizations)
    .where(eq(organizations.id, payload.orgId))
    .limit(1)

  const [inviterRow] = await db
    .select({ name: betterAuthUsers.name })
    .from(betterAuthUsers)
    .where(eq(betterAuthUsers.id, payload.invitedByUserId))
    .limit(1)

  const orgName = orgRow?.name ?? 'una organización'
  const inviterName = inviterRow?.name ?? 'Un administrador'
  const recipientEmail = memberRow.invited_email ?? (() => {
    // invited user already has an account — look up their email
    return null
  })()

  // Resolve email for existing-account invites
  let emailTo = memberRow.invited_email
  if (!emailTo && memberRow.user_id) {
    const [userRow] = await db
      .select({ email: betterAuthUsers.email })
      .from(betterAuthUsers)
      .where(eq(betterAuthUsers.id, memberRow.user_id))
      .limit(1)
    emailTo = userRow?.email ?? null
  }

  if (emailTo) {
    await resendClient.emails.send({
      from: 'invitaciones@4sports.app',
      to: emailTo,
      subject: `${inviterName} te invitó a ${orgName}`,
      html: `
        <p>Hola,</p>
        <p><strong>${inviterName}</strong> te ha invitado a unirte a <strong>${orgName}</strong> como <strong>${memberRow.role}</strong>.</p>
        <p>Ingresa a 4Sports para aceptar o rechazar la invitación.</p>
      `,
    })
  }

  // Insert in-app notification only if the invited user has an account
  if (memberRow.user_id) {
    await insertNotifications([memberRow.user_id], {
      title: `Invitación a ${orgName}`,
      body: `${inviterName} te invitó como ${memberRow.role}.`,
      type: 'invitation.sent',
      entity_type: 'organization',
      entity_id: payload.orgId,
    })
  }
}
```

- [ ] **Step 4: Wire in the switch statement**

In `startWorkers()`, inside the `notificationsWorker` switch, add after `dispute.resolved`:

```typescript
        case 'invitation.sent':
          await handleInvitationSent(job.data.payload)
          break
```

- [ ] **Step 5: Typecheck**

```bash
cd apps/api && bun run typecheck
```

Expected: passes. The switch now covers all union members, so TypeScript reports no missing cases.

- [ ] **Step 6: Lint**

```bash
cd apps/api && bun check
```

Fix any Biome warnings before committing.

- [ ] **Step 7: Commit**

```bash
git add apps/api/src/shared/lib/workers.ts
git commit -m "feat: handle invitation.sent job — send Resend email and in-app notification"
```

---

### Task 5: Enqueue invitation.sent from invite route

**Files:**
- Modify: `apps/api/src/modules/organizations/http/v1/routes.ts`

**Interfaces:**
- Consumes: `notificationsQueue` from `@/shared/lib/bullmq` (Task 3)
- Consumes: `OrgMember.id` returned by `inviteMember` use case

- [ ] **Step 1: Import notificationsQueue**

In `routes.ts`, add to existing imports:

```typescript
import { notificationsQueue } from '@/shared/lib/bullmq'
```

- [ ] **Step 2: Enqueue after successful invite**

Find the `POST /organizations/:orgId/members` handler. Currently:

```typescript
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await inviteMember(repo, {
          orgId: ctx.params.orgId,
          actorUserId: user.id,
          actorRole: membership?.role ?? 'admin',
          email: ctx.body.email,
          role: ctx.body.role,
          tournament_ids: ctx.body.tournament_ids,
        }),
      )
    },
```

Replace with:

```typescript
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      const result = await inviteMember(repo, {
        orgId: ctx.params.orgId,
        actorUserId: user.id,
        actorRole: membership?.role ?? 'admin',
        email: ctx.body.email,
        role: ctx.body.role,
        tournament_ids: ctx.body.tournament_ids,
      })
      if (result.ok) {
        await notificationsQueue.add('invitation.sent', {
          type: 'invitation.sent',
          payload: {
            memberId: result.value.id,
            orgId: ctx.params.orgId,
            invitedByUserId: user.id,
          },
        })
      }
      return toApiResponse(ctx, result)
    },
```

- [ ] **Step 3: Typecheck + lint**

```bash
cd apps/api && bun run typecheck && bun check
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/modules/organizations/http/v1/routes.ts
git commit -m "feat: enqueue invitation.sent job after successful member invite"
```

---

### Task 6: Entity + repository interface — UserInvitation

**Files:**
- Modify: `apps/api/src/modules/organizations/organization.entity.ts`
- Modify: `apps/api/src/modules/organizations/organization.repository.ts`

**Interfaces:**
- Produces: `UserInvitation` interface — used by Task 7, 8, 9
- Produces: `IOrganizationRepository.listInvitationsForUser(userId: string): Promise<UserInvitation[]>`

- [ ] **Step 1: Add UserInvitation to entity file**

In `organization.entity.ts`, append after the existing `AuditLogInput` interface:

```typescript
export interface UserInvitation {
  id: string
  organization: {
    id: string
    name: string
    slug: string
    logo_url: string | null
  }
  role: string
  invited_at: Date
  expires_at: Date | null
  invited_by_name: string | null
}
```

- [ ] **Step 2: Add method to repository interface**

In `organization.repository.ts`, add after `updateOrganization`:

```typescript
  listInvitationsForUser(userId: string): Promise<UserInvitation[]>
```

Also add `UserInvitation` to the import at the top.

- [ ] **Step 3: Typecheck**

```bash
cd apps/api && bun run typecheck
```

Expected: fails on `DrizzleOrganizationRepository` — "Property 'listInvitationsForUser' is missing". That error is expected and will be resolved in Task 7.

- [ ] **Step 4: Commit (even with type error — it's intentional mid-plan)**

```bash
git add apps/api/src/modules/organizations/organization.entity.ts \
        apps/api/src/modules/organizations/organization.repository.ts
git commit -m "feat: add UserInvitation entity and listInvitationsForUser to IOrganizationRepository"
```

---

### Task 7: Drizzle repo — implement listInvitationsForUser

**Files:**
- Modify: `apps/api/src/modules/organizations/drizzle-organization.repository.ts`

**Interfaces:**
- Consumes: `UserInvitation` (Task 6), `organizationMembers`, `organizations` schemas, `betterAuthUsers` inline pgTable already defined in the repo file
- Produces: `DrizzleOrganizationRepository.listInvitationsForUser` implementation

- [ ] **Step 1: Add UserInvitation to import**

In `drizzle-organization.repository.ts`, add `UserInvitation` to the entity import:

```typescript
import type {
  AuditLogInput,
  CreateOrgInput,
  InvitationRecord,
  InviteMemberInput,
  ListMembersResult,
  Organization,
  OrgMember,
  OrgWithRole,
  UpdateOrgInput,
  UpdateRoleInput,
  UserInvitation,
} from './organization.entity'
```

- [ ] **Step 2: Add the method to the class**

Append at the end of `DrizzleOrganizationRepository` (before the closing `}`):

```typescript
  async listInvitationsForUser(userId: string): Promise<UserInvitation[]> {
    const rows = await db
      .select({
        id: organizationMembers.id,
        role: organizationMembers.role,
        invited_at: organizationMembers.created_at,
        expires_at: organizationMembers.invitation_expires_at,
        org_id: organizations.id,
        org_name: organizations.name,
        org_slug: organizations.slug,
        org_logo_url: organizations.logo_url,
        inviter_name: betterAuthUsers.name,
      })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizations.id, organizationMembers.organization_id))
      .leftJoin(betterAuthUsers, sql`${betterAuthUsers.id} = ${organizationMembers.invited_by}`)
      .where(
        and(
          sql`${organizationMembers.user_id} = ${userId}`,
          eq(organizationMembers.status, 'invited'),
          isNull(organizations.deleted_at),
        ),
      )
      .orderBy(organizationMembers.created_at)

    return rows.map((r) => ({
      id: r.id,
      organization: {
        id: r.org_id,
        name: r.org_name,
        slug: r.org_slug,
        logo_url: r.org_logo_url,
      },
      role: r.role,
      invited_at: r.invited_at,
      expires_at: r.expires_at,
      invited_by_name: r.inviter_name ?? null,
    }))
  }
```

> **Note:** The `betterAuthUsers` pgTable reference is already defined at the top of this file (line 26-32). No new import needed.

You need to add `isNull` to the drizzle-orm import if not present — check the existing import line and add it:

```typescript
import { and, count, eq, isNull, or, sql } from 'drizzle-orm'
```

- [ ] **Step 3: Typecheck**

```bash
cd apps/api && bun run typecheck
```

Expected: passes (missing method resolved, types align).

- [ ] **Step 4: Lint**

```bash
cd apps/api && bun check
```

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/modules/organizations/drizzle-organization.repository.ts
git commit -m "feat: implement listInvitationsForUser in DrizzleOrganizationRepository"
```

---

### Task 8: Use case — list-user-invitations

**Files:**
- Create: `apps/api/src/modules/organizations/use-cases/list-user-invitations.use-case.ts`

**Interfaces:**
- Consumes: `IOrganizationRepository` (Task 6), `UserInvitation` (Task 6)
- Produces: `listUserInvitations(repo, input): Promise<Result<UserInvitation[]>>`

- [ ] **Step 1: Create the use case file**

```typescript
// apps/api/src/modules/organizations/use-cases/list-user-invitations.use-case.ts
import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { UserInvitation } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

export async function listUserInvitations(
  repo: IOrganizationRepository,
  input: { userId: string },
): Promise<Result<UserInvitation[]>> {
  const invitations = await repo.listInvitationsForUser(input.userId)
  return ok(invitations)
}
```

> This use case is intentionally minimal. Business logic (e.g., filtering expired ones) can be added here later without touching the route or repo.

- [ ] **Step 2: Typecheck**

```bash
cd apps/api && bun run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/modules/organizations/use-cases/list-user-invitations.use-case.ts
git commit -m "feat: add list-user-invitations use case"
```

---

### Task 9: HTTP — schema, docs, and GET /me/invitations route

**Files:**
- Modify: `apps/api/src/modules/organizations/http/v1/schemas.ts`
- Modify: `apps/api/src/modules/organizations/http/v1/invitation-docs.ts`
- Modify: `apps/api/src/modules/organizations/http/v1/invitation-routes.ts`

**Interfaces:**
- Consumes: `listUserInvitations` use case (Task 8)
- Produces: `GET /v1/me/invitations` → `200 { data: UserInvitation[] }`

- [ ] **Step 1: Add UserInvitationSchema to schemas.ts**

Append at the end of `schemas.ts`:

```typescript
export const UserInvitationSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  organization: Type.Object({
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
    slug: Type.String(),
    logo_url: Type.Union([Type.String(), Type.Null()]),
  }),
  role: Type.String(),
  invited_at: Type.String({ format: 'date-time' }),
  expires_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  invited_by_name: Type.Union([Type.String(), Type.Null()]),
})
```

- [ ] **Step 2: Add docs to invitation-docs.ts**

Append at the end of `invitation-docs.ts`:

```typescript
export const listUserInvitationsDetail = {
  summary: 'List my pending invitations',
  security: [{ cookieAuth: [] }],
  description:
    'Returns all pending (status=invited) organization invitations for the authenticated user. Only shows invitations linked to the user account (user_id match); email-only invitations become visible here after the user registers.',
  responses: {
    200: ApiResponses.success(
      Type.Array(UserInvitationSchema),
      'List of pending invitations',
    ),
    401: ApiResponses.unauthorized('No active session'),
  },
}
```

Add missing imports at top of `invitation-docs.ts`:

```typescript
import { Type } from '@sinclair/typebox'
import { UserInvitationSchema } from './schemas'
```

- [ ] **Step 3: Add route to invitation-routes.ts**

In `invitation-routes.ts`, add imports:

```typescript
import { listUserInvitations } from '../../use-cases/list-user-invitations.use-case'
import { listUserInvitationsDetail } from './invitation-docs'
```

Append after the existing `.post('/invitations/:memberId/reject', ...)` block:

```typescript
  .get(
    '/me/invitations',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(ctx, await listUserInvitations(repo, { userId: user.id }))
    },
    { beforeHandle: [authGuard], detail: listUserInvitationsDetail },
  )
```

- [ ] **Step 4: Typecheck + lint**

```bash
cd apps/api && bun run typecheck && bun check
```

Expected: passes.

- [ ] **Step 5: Manual smoke test**

Start the API:
```bash
bun dev --filter @4sports/api
```

1. Hit `GET /v1/me/invitations` without auth → expect `401`
2. Hit `GET /v1/me/invitations` with a valid session → expect `200 { data: [] }` (or list if invitations exist)
3. Invite a user via `POST /v1/organizations/:orgId/members` → check BullMQ job enqueued (check Redis or logs)
4. Check Resend dashboard (or mock) for the email
5. Check `notifications` table for in-app row if invited user has an account

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/modules/organizations/http/v1/schemas.ts \
        apps/api/src/modules/organizations/http/v1/invitation-docs.ts \
        apps/api/src/modules/organizations/http/v1/invitation-routes.ts
git commit -m "feat: add GET /me/invitations endpoint"
```

---

## Self-Review

**Spec coverage:**
- ✅ Email notification on invite → Tasks 1-5
- ✅ In-app notification on invite → Task 4
- ✅ List pending invitations endpoint → Tasks 6-9
- ✅ Keeps use case pure (BullMQ in route handler, not UC) → Task 5

**Potential gaps:**
- Resend `from` address `invitaciones@4sports.app` — needs DNS/domain verification in Resend dashboard. Document this in `.env` comments or README.
- The `handleInvitationSent` worker function resolves email via two separate queries when `user_id` is set. This is intentional to reuse the same `betterAuthUsers` pgTable reference already in the file.
- `listInvitationsForUser` only returns invitations where `user_id = $userId`. Email-only invitations (user not yet registered) are invisible to this endpoint by design — they become visible after the user registers and BetterAuth links the email to a user_id. This matches the BetterAuth account-linking flow.
- `organizations.deleted_at` is filtered with `isNull` so soft-deleted orgs don't surface.
