import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleAuthRepository } from '../../drizzle-auth.repository'
import { getMe } from '../../use-cases/get-me.use-case'
import { setContext } from '../../use-cases/set-context.use-case'
import { getMeDetail, setContextDetail } from './docs'
import { ContextBodySchema } from './schemas'

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
