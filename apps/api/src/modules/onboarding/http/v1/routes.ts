import { Type } from '@sinclair/typebox'
import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleOnboardingRepository } from '../../drizzle-onboarding.repository'
import { checkSlug } from '../../use-cases/check-slug.use-case'
import { checkUsername } from '../../use-cases/check-username.use-case'
import { completeOrganizerOnboarding } from '../../use-cases/complete-organizer-onboarding.use-case'
import { completePlayerOnboarding } from '../../use-cases/complete-player-onboarding.use-case'
import {
  checkSlugDetail,
  checkUsernameDetail,
  completeOrgOnboardingDetail,
  completePlayerOnboardingDetail,
} from './docs'
import { OrgOnboardingBodySchema, PlayerOnboardingBodySchema } from './schemas'

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
  .post(
    '/onboarding/organizer',
    async (ctx) => {
      const { user } = ctx.store as { user: { id: string } }
      return toApiResponse(
        ctx,
        await completeOrganizerOnboarding(repo, { userId: user.id, data: ctx.body }),
      )
    },
    {
      beforeHandle: authGuard,
      body: OrgOnboardingBodySchema,
      detail: completeOrgOnboardingDetail,
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
  .get(
    '/check-slug',
    async (ctx) => {
      return toApiResponse(ctx, await checkSlug(repo, { slug: ctx.query.slug }))
    },
    {
      beforeHandle: authGuard,
      query: Type.Object({ slug: Type.String({ minLength: 1 }) }),
      detail: checkSlugDetail,
    },
  )
