import { logger } from '@4sports/utils/logger'
import { Elysia } from 'elysia'
import { auth } from '@/shared/lib/auth'
import { requestLogger } from '@/shared/middleware/request-logger'

const app = new Elysia()
  .use(requestLogger())
  .all('/auth/*', async (ctx) => {
    return auth.handler(ctx.request)
  })
  .listen(process.env['PORT'] ?? 4000)

logger.info(`API corriendo en ${app.server?.hostname}:${app.server?.port}`)
