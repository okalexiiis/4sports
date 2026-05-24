import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleAuthRepository } from '../../drizzle-auth.repository'
import { getMe } from '../../use-cases/get-me.use-case'
import { getMeDetail } from './docs'

const repo = new DrizzleAuthRepository()

export const authV1Routes = new Elysia({ prefix: '/auth', tags: ['Auth'] }).get(
  '/me',
  async (ctx) => {
    const { user } = ctx.store as { user: { id: string; email: string; name: string } }
    return toApiResponse(ctx, await getMe(repo, { userId: user.id, user }))
  },
  { beforeHandle: authGuard, detail: getMeDetail },
)
