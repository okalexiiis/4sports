import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matches } from '@/shared/db/schemas'
import { LineupErrors } from '../errors'
import type { LineupEntry, LineupPlayerInput } from '../lineup.entity'
import type { ILineupRepository } from '../lineup.repository'

const ENDED_STATUSES = new Set(['finished', 'disputed', 'walkover', 'cancelled'])

export interface PublishLineupInput {
  matchId: string
  teamId: string
  players: LineupPlayerInput[]
}

export async function publishLineup(
  repo: ILineupRepository,
  input: PublishLineupInput,
): Promise<Result<LineupEntry[]>> {
  const [match] = await db.select().from(matches).where(eq(matches.id, input.matchId)).limit(1)
  if (!match) return err(LineupErrors.matchNotFound(input.matchId))

  if (ENDED_STATUSES.has(match.status)) return err(LineupErrors.matchAlreadyEnded())

  if (match.home_team_id !== input.teamId && match.away_team_id !== input.teamId) {
    return err(LineupErrors.invalidTeam(input.teamId))
  }

  const entries = await repo.replaceTeamLineup(
    input.matchId,
    input.teamId,
    input.players,
    new Date(),
  )
  return ok(entries)
}
