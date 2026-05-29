import { Elysia } from 'elysia'
import { Redis } from 'ioredis'
import { env } from '@/shared/env'
import { getBunServer } from '@/shared/lib/bun-server'

// Dedicated subscriber connection — ioredis subscriber connections cannot issue
// regular Redis commands, so this must be separate from the shared redis client.
const redisSub = new Redis(env.REDIS_URL, { lazyConnect: false })

// Subscribe to all match channels with a pattern so we don't need per-match
// subscribe/unsubscribe on Redis side. Bun's built-in WS pub/sub handles
// per-client fanout within the process.
redisSub.psubscribe('match:*', (err) => {
  if (err) console.error('[match-ws] Redis psubscribe error', err)
})

redisSub.on('pmessage', (_pattern: string, channel: string, message: string) => {
  getBunServer()?.publish(channel, message)
})

export const matchWsRoutes = new Elysia().ws('/ws/matches/:matchId', {
  open(ws) {
    ws.subscribe(`match:${ws.data.params.matchId}`)
  },
  close(ws) {
    ws.unsubscribe(`match:${ws.data.params.matchId}`)
  },
})
