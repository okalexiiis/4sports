import { and, eq, or } from 'drizzle-orm'
import type { Context } from 'elysia'
import { db } from '@/shared/db/client'
import {
  type organizationMembers,
  organizerSubscriptions,
  subscriptionPlans,
} from '@/shared/db/schemas'

/**
 * Validates that the active organization's subscription plan includes the
 * requested feature. Must run after orgGuard (requires ctx.store.membership).
 *
 * Allows both 'active' and 'trialing' subscriptions — trialing users have
 * full access to the features they signed up for.
 *
 * Usage: { beforeHandle: [authGuard, orgGuard('organizer'), featureGuard('can_use_world_cup_format')] }
 */
export function featureGuard(feature: string) {
  return async (ctx: Context) => {
    const store = ctx.store as Record<string, unknown>
    const membership = store.membership as typeof organizationMembers.$inferSelect | undefined

    if (!membership) {
      ctx.set.status = 403
      return {
        error: {
          code: 'FORBIDDEN',
          message: 'Contexto de organización no disponible. Asegúrate de llamar orgGuard primero.',
        },
      }
    }

    const [result] = await db
      .select({ features: subscriptionPlans.features, status: organizerSubscriptions.status })
      .from(organizerSubscriptions)
      .innerJoin(subscriptionPlans, eq(organizerSubscriptions.plan_id, subscriptionPlans.id))
      .where(
        and(
          eq(organizerSubscriptions.organization_id, membership.organization_id),
          or(
            eq(organizerSubscriptions.status, 'active'),
            eq(organizerSubscriptions.status, 'trialing'),
          ),
        ),
      )
      .limit(1)

    if (!result) {
      ctx.set.status = 403
      return {
        error: {
          code: 'SUBSCRIPTION_REQUIRED',
          message: 'Se requiere una suscripción activa.',
        },
      }
    }

    const features = result.features as Record<string, unknown>

    if (!features[feature]) {
      ctx.set.status = 403
      return {
        error: {
          code: 'FEATURE_NOT_AVAILABLE',
          message: `El feature '${feature}' no está disponible en tu plan actual.`,
        },
      }
    }
  }
}
