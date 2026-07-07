import { Queue } from 'bullmq'
import { env } from '@/shared/env'

export const notificationsQueue = new Queue('notifications', {
  connection: { url: env.REDIS_URL },
})

export const auditQueue = new Queue('audit', {
  connection: { url: env.REDIS_URL },
})
