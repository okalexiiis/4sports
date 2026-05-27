import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzlePlayerClaimRepository } from '../../drizzle-player-claim.repository'
import { requestClaim } from '../../use-cases/request-claim.use-case'
import { reviewClaim } from '../../use-cases/review-claim.use-case'
import { requestClaimDetail, reviewClaimDetail } from './docs'
import { ReviewClaimBodySchema } from './schemas'

const claimRepo = new DrizzlePlayerClaimRepository()

type AuthStore = { user: { id: string } }

export const playersV1Routes = new Elysia({ tags: ['Players'] })
  .post(
    '/players/:playerId/claim',
    async (ctx) => {
      const { user } = ctx.store as AuthStore

      const result = await requestClaim(claimRepo, {
        playerId: ctx.params.playerId,
        claimantUserId: user.id,
      })

      if (result.ok) ctx.set.status = 201
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard],
      detail: requestClaimDetail,
    },
  )
  .put(
    '/players/:playerId/claim/:claimId',
    async (ctx) => {
      const { user } = ctx.store as AuthStore

      return toApiResponse(
        ctx,
        await reviewClaim(claimRepo, {
          playerId: ctx.params.playerId,
          claimId: ctx.params.claimId,
          newStatus: ctx.body.status,
          reviewedBy: user.id,
        }),
      )
    },
    {
      beforeHandle: [authGuard],
      body: ReviewClaimBodySchema,
      detail: reviewClaimDetail,
    },
  )
