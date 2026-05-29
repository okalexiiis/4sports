import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matches, players } from '@/shared/db/schemas'
import type { Convocatoria, ConvocatoriaResponse } from '../convocatoria.entity'
import type { IConvocatoriaRepository } from '../convocatoria.repository'
import { ConvocatoriaErrors } from '../errors'

const ENDED_STATUSES = new Set(['finished', 'disputed', 'walkover', 'cancelled'])

export interface RespondConvocatoriaInput {
  matchId: string
  // BetterAuth user id — resolved to player_id inside this use case
  userId: string
  response: ConvocatoriaResponse
}

export async function respondConvocatoria(
  repo: IConvocatoriaRepository,
  input: RespondConvocatoriaInput,
): Promise<Result<Convocatoria>> {
  const [match] = await db.select().from(matches).where(eq(matches.id, input.matchId)).limit(1)
  if (!match) return err(ConvocatoriaErrors.matchNotFound(input.matchId))

  if (ENDED_STATUSES.has(match.status)) return err(ConvocatoriaErrors.matchAlreadyEnded())

  // Resolve the player profile linked to this user
  const [player] = await db
    .select({ id: players.id })
    .from(players)
    .where(eq(players.user_id, input.userId))
    .limit(1)

  if (!player) return err(ConvocatoriaErrors.notYourConvocatoria())

  const convocatoria = await repo.findByMatchAndPlayer(input.matchId, player.id)
  if (!convocatoria) return err(ConvocatoriaErrors.notFound(`${input.matchId}/${player.id}`))

  const updated = await repo.updateResponse(convocatoria.id, input.response, new Date())
  return ok(updated)
}
