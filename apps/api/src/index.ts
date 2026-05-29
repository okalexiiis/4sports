import type { ErrorLogMeta, StartupLogMeta } from '@4sports/logger'
import { openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'
import { noteV1Routes } from '@/_sandbox/note/http/v1/routes'
import { matchWsRoutes } from '@/modules/matches/ws/match.ws'
import { auth } from '@/shared/lib/auth'
import { setBunServer } from '@/shared/lib/bun-server'
import { startWorkers } from '@/shared/lib/workers'
import { logger } from '@/shared/logger'
import { requestLogger } from '@/shared/middleware/request-logger'
import { v1 } from '@/v1/index'

const app = new Elysia()
  .use(requestLogger)
  .onError({ as: 'global' }, (ctx) => {
    const { error, set, code } = ctx
    const requestId = (ctx as unknown as { requestId?: string }).requestId

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
      logger.debug('validation error', {
        type: 'error',
        request_id: requestId,
        error_code: 'VALIDATION',
        error_message: message,
        ...(details ? { details } : {}),
      } satisfies ErrorLogMeta)
      return { error: { code: 'VALIDATION', message, details } }
    }

    if (code === 'NOT_FOUND') {
      set.status = 404
      logger.debug('route not found', {
        type: 'error',
        request_id: requestId,
        error_code: 'NOT_FOUND',
        error_message: 'Route not found',
      } satisfies ErrorLogMeta)
      return { error: { code: 'NOT_FOUND', message: 'Route not found' } }
    }

    if (code === 'PARSE') {
      set.status = 400
      logger.debug('parse error', {
        type: 'error',
        request_id: requestId,
        error_code: 'PARSE_ERROR',
        error_message: 'Invalid request body',
      } satisfies ErrorLogMeta)
      return { error: { code: 'PARSE_ERROR', message: 'Invalid request body' } }
    }

    logger.error('unhandled error', {
      type: 'error',
      request_id: requestId,
      error_code: 'INTERNAL_ERROR',
      error_message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    } satisfies ErrorLogMeta)
    set.status = 500
    return { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }
  })
  .use(
    openapi({
      path: '/openapi',
      documentation: {
        info: { title: '4Sports API', version: '1' },
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'better-auth.session_token',
              description:
                'Session cookie issued by BetterAuth. Obtain via POST /auth/sign-in/email',
            },
          },
        },
      },
    }),
  )
  .use(v1)
  .use(noteV1Routes)
  .use(matchWsRoutes)
  .all('/auth/*', async (ctx) => auth.handler(ctx.request))
  .listen(process.env.PORT ?? 4000)

if (app.server) setBunServer(app.server)
startWorkers()

const port = Number(process.env.PORT ?? 4000)
logger.info('server ready', { type: 'startup', port } satisfies StartupLogMeta)
