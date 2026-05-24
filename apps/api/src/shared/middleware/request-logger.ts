import { Elysia } from 'elysia'
import { logger } from '@/shared/logger'

export const requestLogger = new Elysia({ name: 'request-logger' }).onAfterResponse(
  { as: 'global' },
  ({ request, set, store }) => {
    if (!request.url) return
    const { pathname } = new URL(request.url)
    const { requestStartedAt, requestId } = store as { requestStartedAt: number; requestId: string }
    const status = (set.status as number | undefined) ?? 200
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    logger[level](`${request.method} ${pathname}`, {
      requestId,
      status,
      ms: Date.now() - requestStartedAt,
    })
  },
)
