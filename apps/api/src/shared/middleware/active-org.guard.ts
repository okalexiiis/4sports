import { and, eq } from 'drizzle-orm'
import type { Context } from 'elysia'
import { db } from '@/shared/db/client'
import { redis } from '@/shared/db/redis'
import { organizationMembers } from '@/shared/db/schemas'

const ROLE_HIERARCHY = { viewer: 0, organizer: 1, admin: 2, owner: 3 } as const

type OrgRole = keyof typeof ROLE_HIERARCHY
type ActiveContext = { organization_id: string; role: string }

/**
 * Like orgGuard but reads the org from the user's active Redis context instead
 * of a URL :orgId param. Use this for routes that are scoped to a resource
 * (tournament, team) rather than directly to an org.
 *
 * Attaches `membership` to ctx.store on success.
 *
 * Usage: { beforeHandle: [authGuard, activeOrgGuard('organizer')] }
 */
export function activeOrgGuard(minRole: OrgRole) {
  return async (ctx: Context) => {
    const store = ctx.store as Record<string, unknown>
    const user = store.user as { id: string } | undefined

    if (!user) {
      ctx.set.status = 401
      return { error: { code: 'UNAUTHORIZED', message: 'Se requiere sesión activa.' } }
    }

    const contextRaw = await redis.get(`context:${user.id}`)
    if (!contextRaw) {
      ctx.set.status = 403
      return {
        error: {
          code: 'NO_ACTIVE_CONTEXT',
          message: 'No hay contexto de organización activo. Selecciona una organización primero.',
        },
      }
    }

    const activeContext = JSON.parse(contextRaw) as ActiveContext

    const [membership] = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, activeContext.organization_id),
          eq(organizationMembers.user_id, user.id),
        ),
      )
      .limit(1)

    if (!membership || membership.status !== 'active') {
      ctx.set.status = 403
      return {
        error: { code: 'ORG_NOT_MEMBER', message: 'No eres miembro activo de esta organización.' },
      }
    }

    const memberLevel = ROLE_HIERARCHY[membership.role as OrgRole] ?? -1
    const requiredLevel = ROLE_HIERARCHY[minRole]

    if (memberLevel < requiredLevel) {
      ctx.set.status = 403
      return {
        error: {
          code: 'INSUFFICIENT_ROLE',
          message: 'No tienes permisos suficientes para esta acción.',
        },
      }
    }

    ctx.store = { ...store, membership }
  }
}
