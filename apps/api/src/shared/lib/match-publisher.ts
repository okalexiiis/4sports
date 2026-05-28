import { redis } from '@/shared/db/redis'

export type MatchWsPayload =
  | {
      type: 'match:event'
      payload: {
        id: string
        event_type_id: string
        player_id: string
        team_id: string
        minute: number | null
        period_index: number
      }
    }
  | {
      type: 'match:score'
      payload: { home_score: number | null; away_score: number | null }
    }
  | { type: 'match:status'; payload: { status: string; reason?: string } }
  | { type: 'match:lineup'; payload: { team_id: string; lineup: unknown[] } }

export async function publishToMatch(matchId: string, event: MatchWsPayload): Promise<void> {
  await redis.publish(`match:${matchId}`, JSON.stringify(event))
}
