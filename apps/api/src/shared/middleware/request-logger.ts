import { logger } from '@4sports/utils/logger'
import { Elysia } from 'elysia'

const httpLogger = logger.child({ scope: 'http' })

export function requestLogger() {
  return new Elysia({ name: '@4sports/request-logger' })
    .onRequest(({ store }) => {
      // store is mutable per-request state — record start time for duration calculation
      ;(store as Record<string, unknown>)['_requestStart'] = Date.now()
    })
    .onAfterResponse(({ request, set, store }) => {
      const start = (store as Record<string, unknown>)['_requestStart']
      const durationMs = typeof start === 'number' ? Date.now() - start : -1
      const url = new URL(request.url)
      const status = typeof set.status === 'number' ? set.status : 200
      const requestId = request.headers.get('x-request-id') ?? undefined

      httpLogger.info(`${request.method} ${url.pathname} ${status} ${durationMs}ms`, {
        method: request.method,
        path: url.pathname,
        status,
        durationMs,
        ...(requestId !== undefined ? { requestId } : {}),
      })
    })
}
