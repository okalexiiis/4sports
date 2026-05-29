import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleDisputeRepository } from '../../drizzle-dispute.repository'
import { listDisputes } from '../../use-cases/list-disputes.use-case'
import { openDispute } from '../../use-cases/open-dispute.use-case'
import { resolveDispute } from '../../use-cases/resolve-dispute.use-case'
import { listDisputesDetail, openDisputeDetail, resolveDisputeDetail } from './docs'
import { OpenDisputeBodySchema, ResolveDisputeBodySchema } from './schemas'

const repo = new DrizzleDisputeRepository()

type AuthStore = { user: { id: string } }

export const disputesV1Routes = new Elysia({ tags: ['Disputes'] })
  .post(
    '/matches/:matchId/disputes',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await openDispute(repo, {
        matchId: ctx.params.matchId,
        userId: user.id,
        reason: ctx.body.reason,
        description: ctx.body.description,
        evidenceUrls: ctx.body.evidence_urls,
      })
      if (result.ok) ctx.set.status = 201
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard],
      body: OpenDisputeBodySchema,
      detail: openDisputeDetail,
    },
  )
  .get(
    '/matches/:matchId/disputes',
    async (ctx) => {
      const result = await listDisputes(repo, ctx.params.matchId)
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard],
      detail: listDisputesDetail,
    },
  )
  .patch(
    '/matches/:matchId/disputes/:disputeId',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await resolveDispute(repo, {
        disputeId: ctx.params.disputeId,
        resolvedBy: user.id,
        resolutionNotes: ctx.body.resolution_notes,
        finalScoreOverride: ctx.body.final_score_override,
      })
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('admin')],
      body: ResolveDisputeBodySchema,
      detail: resolveDisputeDetail,
    },
  )
