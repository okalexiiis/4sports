import type { ErrorLogMeta, StartupLogMeta } from '@4sports/logger'
import { openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'
import { noteV1Routes } from '@/_sandbox/note/http/v1/routes'
import { auth } from '@/shared/lib/auth'
import { logger } from '@/shared/logger'
import { requestLogger } from '@/shared/middleware/request-logger'
import { v1 } from '@/v1/index'

new Elysia()
  .use(requestLogger)
  .onError({ as: 'global' }, ({ error, set, code }) => {
    if (code === 'VALIDATION') {
      set.status = 422
      let message = 'Validation failed'
      let details: Record<string, unknown> | undefined
      try {
        const parsed = JSON.parse(error.message) as {
          message?: string
          on?: string
          property?: string
        }
        message = parsed.message ?? message
        if (parsed.on ?? parsed.property) details = { on: parsed.on, field: parsed.property }
      } catch {
        // malformed validation message — use the fallback
      }
      return { error: { code: 'VALIDATION', message, details } }
    }

    if (code === 'NOT_FOUND') {
      set.status = 404
      return { error: { code: 'NOT_FOUND', message: 'Route not found' } }
    }

    if (code === 'PARSE') {
      set.status = 400
      return { error: { code: 'PARSE_ERROR', message: 'Invalid request body' } }
    }

    logger.error('unhandled error', {
      type: 'error',
      error_code: 'INTERNAL_ERROR',
      error_message: error.message,
    } satisfies ErrorLogMeta)
    set.status = 500
    return { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }
  })
  .use(openapi({ path: '/openapi' }))
  .use(v1)
  .use(noteV1Routes)
  .all('/auth/*', async (ctx) => auth.handler(ctx.request))
  .listen(process.env.PORT ?? 4000)

const port = Number(process.env.PORT ?? 4000)
logger.info('server ready', { type: 'startup', port } satisfies StartupLogMeta)
