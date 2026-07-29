import { and, eq } from 'drizzle-orm'
import type { Context } from 'elysia'
import { db } from '@/shared/db/client'
import { redis } from '@/shared/db/redis'
import { organizationMembers } from '@/shared/db/schemas'
import { auth } from '@/shared/lib/auth'

type ActiveContext = { organization_id: string; role: string }

/**
 * Non-blocking membership population. Attaches `membership` to ctx.store if
 * the request carries a valid session with an active org context. Never blocks —
 * unauthenticated or context-less requests pass through silently.
 *
 * Use for routes that are public but grant extra access to org members
 * (e.g. GET /tournaments/:tournamentId — public for published, org-only for draft).
 */
export async function tryActiveOrgGuard(ctx: Context) {
  const session = await auth.api.getSession({ headers: ctx.request.headers })
  if (!session?.user) return

  const contextRaw = await redis.get(`context:${session.user.id}`)
  if (!contextRaw) return

  const activeContext = JSON.parse(contextRaw) as ActiveContext

  const [membership] = await db
    .select()
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organization_id, activeContext.organization_id),
        eq(organizationMembers.user_id, session.user.id),
      ),
    )
    .limit(1)

  if (!membership || membership.status !== 'active') return

  ctx.store = { ...(ctx.store as Record<string, unknown>), membership }
}
