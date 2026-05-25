import { Type } from '@sinclair/typebox'
import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleOnboardingRepository } from '../../drizzle-onboarding.repository'
import { checkUsername } from '../../use-cases/check-username.use-case'
import { completePlayerOnboarding } from '../../use-cases/complete-player-onboarding.use-case'
import { checkUsernameDetail, completePlayerOnboardingDetail } from './docs'
import { PlayerOnboardingBodySchema } from './schemas'

const repo = new DrizzleOnboardingRepository()

export const onboardingV1Routes = new Elysia({ tags: ['Onboarding'] })
  .post(
    '/onboarding/player',
    async (ctx) => {
      const { user } = ctx.store as { user: { id: string } }
      return toApiResponse(
        ctx,
        await completePlayerOnboarding(repo, { userId: user.id, data: ctx.body }),
      )
    },
    {
      beforeHandle: authGuard,
      body: PlayerOnboardingBodySchema,
      detail: completePlayerOnboardingDetail,
    },
  )
  .get(
    '/check-username',
    async (ctx) => {
      return toApiResponse(ctx, await checkUsername(repo, { username: ctx.query.username }))
    },
    {
      beforeHandle: authGuard,
      query: Type.Object({ username: Type.String({ minLength: 1 }) }),
      detail: checkUsernameDetail,
    },
  )
