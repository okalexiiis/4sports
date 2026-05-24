import { and, eq } from 'drizzle-orm'
import type { Context } from 'elysia'
import { db } from '@/shared/db/client'
import { redis } from '@/shared/db/redis'
import { organizationMembers } from '@/shared/db/schemas'

const ROLE_HIERARCHY = { viewer: 0, organizer: 1, admin: 2, owner: 3 } as const

type OrgRole = keyof typeof ROLE_HIERARCHY

type ActiveContext = { organization_id: string; role: string }

/**
 * Validates that the requesting user:
 * 1. Has an active context in Redis matching the :orgId path param
 * 2. Is an active member of that organization
 * 3. Has at least the required role
 *
 * Must run after authGuard (requires ctx.store.user).
 * Attaches `membership` to ctx.store on success.
 *
 * Usage: { beforeHandle: [authGuard, orgGuard('admin')] }
 */
export function orgGuard(minRole: OrgRole) {
  return async (ctx: Context) => {
    const store = ctx.store as Record<string, unknown>
    const user = store.user as { id: string } | undefined

    if (!user) {
      ctx.set.status = 401
      return {
        error: { code: 'UNAUTHORIZED', message: 'Se requiere sesión activa.' },
      }
    }

    const orgId = (ctx.params as Record<string, string | undefined>).orgId

    if (!orgId) {
      ctx.set.status = 400
      return {
        error: { code: 'BAD_REQUEST', message: 'Se requiere parámetro orgId.' },
      }
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

    if (activeContext.organization_id !== orgId) {
      ctx.set.status = 403
      return {
        error: {
          code: 'CONTEXT_MISMATCH',
          message: 'El contexto activo no coincide con la organización solicitada.',
        },
      }
    }

    const [membership] = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, orgId),
          eq(organizationMembers.user_id, user.id),
        ),
      )
      .limit(1)

    if (!membership || membership.status !== 'active') {
      ctx.set.status = 403
      return {
        error: {
          code: 'ORG_NOT_MEMBER',
          message: 'No eres miembro activo de esta organización.',
        },
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
