import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleAuthRepository } from '../../drizzle-auth.repository'
import { getMe } from '../../use-cases/get-me.use-case'
import { setContext } from '../../use-cases/set-context.use-case'
import { updateProfile } from '../../use-cases/update-profile.use-case'
import { getMeDetail, setContextDetail, updateProfileDetail } from './docs'
import { ContextBodySchema, UpdateProfileBodySchema } from './schemas'

const repo = new DrizzleAuthRepository()

export const authV1Routes = new Elysia({ tags: ['Auth'] })
  .get(
    '/me',
    async (ctx) => {
      const { user } = ctx.store as { user: { id: string; email: string; name: string } }
      return toApiResponse(ctx, await getMe(repo, { userId: user.id, user }))
    },
    { beforeHandle: authGuard, detail: getMeDetail },
  )
  .patch(
    '/me/profile',
    async (ctx) => {
      const { user } = ctx.store as { user: { id: string } }
      return toApiResponse(
        ctx,
        await updateProfile(repo, {
          userId: user.id,
          data: {
            avatar_url: ctx.body.avatar_url,
            city: ctx.body.city,
            country_code: ctx.body.country_code,
            phone: ctx.body.phone,
          },
        }),
      )
    },
    { beforeHandle: authGuard, body: UpdateProfileBodySchema, detail: updateProfileDetail },
  )
  .put(
    '/context',
    async (ctx) => {
      const { user } = ctx.store as { user: { id: string } }
      return toApiResponse(
        ctx,
        await setContext(repo, { userId: user.id, organizationId: ctx.body.organization_id }),
      )
    },
    { beforeHandle: authGuard, body: ContextBodySchema, detail: setContextDetail },
  )
