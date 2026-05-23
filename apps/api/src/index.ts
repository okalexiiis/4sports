import { openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'
import { noteV1Routes } from '@/_sandbox/note/http/v1/routes'
import { auth } from '@/shared/lib/auth'
import { logger } from '@/shared/logger'
import { v1 } from '@/v1/index'

new Elysia()
  .derive({ as: 'global' }, () => ({
    requestStartedAt: Date.now(),
    requestId: crypto.randomUUID(),
  }))
  .onAfterResponse({ as: 'global' }, ({ request, set, requestStartedAt, requestId }) => {
    if (!request.url) return
    const { pathname } = new URL(request.url)
    const status = (set.status as number | undefined) ?? 200
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    logger[level](`${request.method} ${pathname}`, {
      requestId,
      status,
      ms: Date.now() - requestStartedAt,
    })
  })
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

    set.status = 500
    return { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }
  })
  .use(openapi({ path: '/openapi' }))
  .use(v1)
  .use(noteV1Routes)
  .all('/auth/*', async (ctx) => auth.handler(ctx.request))
  .listen(process.env.PORT ?? 4000)

logger.info('API server running', { url: `http://localhost:${process.env.PORT ?? 4000}` })
logger.info('OpenAPI docs', { url: `http://localhost:${process.env.PORT ?? 4000}/openapi` })

const somethingBadLinted =
  'This is a very long string that should trigger a linting error because it exceeds the maximum line length defined in the Biome configuration file. It is important to keep lines of code within a reasonable length to improve readability and maintainability of the codebase.'
