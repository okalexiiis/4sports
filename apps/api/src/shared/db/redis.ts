import { Redis } from 'ioredis'
import { env } from '@/shared/env'

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
})

import { logger } from '@/shared/logger'

redis.on('error', (err) => {
  logger.error('Redis error', { error: err.message })
})
