import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matches } from '@/shared/db/schemas'
import type { Convocatoria } from '../convocatoria.entity'
import type { IConvocatoriaRepository } from '../convocatoria.repository'
import { ConvocatoriaErrors } from '../errors'

const ENDED_STATUSES = new Set(['finished', 'disputed', 'walkover', 'cancelled'])

export interface SendConvocatoriaInput {
  matchId: string
  teamId: string
  playerIds: string[]
}

export async function sendConvocatoria(
  repo: IConvocatoriaRepository,
  input: SendConvocatoriaInput,
): Promise<Result<Convocatoria[]>> {
  const [match] = await db.select().from(matches).where(eq(matches.id, input.matchId)).limit(1)
  if (!match) return err(ConvocatoriaErrors.matchNotFound(input.matchId))

  if (ENDED_STATUSES.has(match.status)) return err(ConvocatoriaErrors.matchAlreadyEnded())

  if (match.home_team_id !== input.teamId && match.away_team_id !== input.teamId) {
    return err(ConvocatoriaErrors.invalidTeam(input.teamId))
  }

  const convocatorias = await repo.upsertMany(
    input.playerIds.map((playerId) => ({
      match_id: input.matchId,
      player_id: playerId,
      team_id: input.teamId,
    })),
  )

  return ok(convocatorias)
}
