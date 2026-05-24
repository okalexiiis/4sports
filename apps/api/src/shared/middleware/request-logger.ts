import type { RequestLogMeta } from '@4sports/logger'
import { Elysia } from 'elysia'
import { logger } from '@/shared/logger'

export const requestLogger = new Elysia({ name: 'request-logger' })
  .derive({ as: 'global' }, () => ({
    requestId: crypto.randomUUID(),
    requestStartedAt: Date.now(),
  }))
  .onAfterResponse({ as: 'global' }, ({ request, set, requestId, requestStartedAt }) => {
    if (!request.url) return
    const { pathname } = new URL(request.url)
    const { requestStartedAt, requestId } = store as { requestStartedAt: number; requestId: string }
    const status = (set.status as number | undefined) ?? 200
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    logger[level]('http request', {
      type: 'request',
      request_id: requestId,
      method: request.method,
      path: pathname,
      status,
      duration_ms: Date.now() - requestStartedAt,
    } satisfies RequestLogMeta)
  })
