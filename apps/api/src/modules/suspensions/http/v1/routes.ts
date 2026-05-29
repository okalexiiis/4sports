import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleSuspensionRepository } from '../../drizzle-suspension.repository'
import { confirmSuspension } from '../../use-cases/confirm-suspension.use-case'
import { listSuspensions } from '../../use-cases/list-suspensions.use-case'
import { confirmSuspensionDetail, listSuspensionsDetail } from './docs'
import { ConfirmSuspensionBodySchema, ListSuspensionsQuerySchema } from './schemas'

const repo = new DrizzleSuspensionRepository()

type AuthStore = { user: { id: string } }

export const suspensionsV1Routes = new Elysia({ tags: ['Suspensions'] })
  .get(
    '/organizations/:orgId/suspensions',
    async (ctx) => {
      const isDraftRaw = ctx.query.is_draft
      const isDraft = isDraftRaw === 'true' ? true : isDraftRaw === 'false' ? false : undefined
      const result = await listSuspensions(repo, {
        organizationId: ctx.params.orgId,
        tournamentId: ctx.query.tournament_id,
        isDraft,
      })
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      query: ListSuspensionsQuerySchema,
      detail: listSuspensionsDetail,
    },
  )
  .patch(
    '/organizations/:orgId/suspensions/:suspensionId',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await confirmSuspension(repo, {
        suspensionId: ctx.params.suspensionId,
        confirmedBy: user.id,
        suspensionMatches: ctx.body.suspension_matches,
        justification: ctx.body.justification,
      })
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('admin')],
      body: ConfirmSuspensionBodySchema,
      detail: confirmSuspensionDetail,
    },
  )
