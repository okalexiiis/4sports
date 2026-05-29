import { Queue } from 'bullmq'
import { env } from '@/shared/env'

// BullMQ requires its own Redis connection (separate from the pub/sub connection).
// Parsed from REDIS_URL so we don't duplicate config.
function redisConnectionFromUrl(url: string) {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
    db: parsed.pathname ? Number(parsed.pathname.slice(1)) || 0 : 0,
    tls: parsed.protocol === 'rediss:' ? {} : undefined,
  }
}

const connection = redisConnectionFromUrl(env.REDIS_URL)

// Job data shapes
export interface NotificationJobData {
  type:
    | 'match.finished'
    | 'match.rescheduled'
    | 'suspension.confirmed'
    | 'dispute.opened'
    | 'dispute.resolved'
  payload: Record<string, unknown>
}

export interface AuditJobData {
  action: string
  entity_type: string
  entity_id: string
  user_id: string
  meta?: Record<string, unknown>
}

export const notificationsQueue = new Queue<NotificationJobData>('notifications', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 200 },
  },
})

export const auditQueue = new Queue<AuditJobData>('audit', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 500 },
  },
})
