import type { InfraLogMeta } from '@4sports/logger'
import { Redis } from 'ioredis'
import { env } from '@/shared/env'
import { logger } from '@/shared/logger'

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
})

redis.on('error', (err) => {
  logger.error('redis connection error', {
    type: 'infra',
    component: 'redis',
    error_message: err.message,
  } satisfies InfraLogMeta)
})
