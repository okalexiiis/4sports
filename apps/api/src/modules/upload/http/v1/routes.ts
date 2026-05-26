import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { getPresignedUrl } from '../../use-cases/get-presigned-url.use-case'
import { getPresignedUrlDetail } from './docs'
import { PresignedUrlBodySchema } from './schemas'

type AuthStore = { user: { id: string } }

export const uploadV1Routes = new Elysia({ tags: ['Upload'] }).post(
  '/upload/presigned',
  async (ctx) => {
    const { user } = ctx.store as AuthStore
    return toApiResponse(
      ctx,
      await getPresignedUrl({
        userId: user.id,
        fileName: ctx.body.file_name,
        contentType: ctx.body.content_type,
        context: ctx.body.context,
      }),
    )
  },
  { beforeHandle: [authGuard], body: PresignedUrlBodySchema, detail: getPresignedUrlDetail },
)
