import { Elysia } from 'elysia'
import { logger } from '@/shared/logger'

export const requestLogger = new Elysia({ name: 'request-logger' })
  .derive({ as: 'global' }, () => ({ requestStartedAt: Date.now() }))
  .onAfterResponse({ as: 'global' }, ({ request, set, requestStartedAt }) => {
    const { pathname } = new URL(request.url)
    const status = (set.status as number | undefined) ?? 200
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    logger[level](`${request.method} ${pathname}`, {
      status,
      ms: Date.now() - requestStartedAt,
    })
  })
