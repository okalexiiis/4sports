import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { and, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { playerSuspensions, sportEventTypes } from '@/shared/db/schemas'
import type { IMatchRepository } from '../../matches/match.repository'
import { MatchEventErrors } from '../errors'
import type { IMatchEventRepository } from '../match-event.repository'

export interface DeleteMatchEventInput {
  matchId: string
  eventId: string
}

export async function deleteMatchEvent(
  matchRepo: IMatchRepository,
  eventRepo: IMatchEventRepository,
  input: DeleteMatchEventInput,
): Promise<Result<void>> {
  const match = await matchRepo.findById(input.matchId)
  if (!match) {
    return err(MatchEventErrors.matchNotLive('not_found'))
  }

  if (match.status !== 'live') {
    return err(MatchEventErrors.matchNotLive(match.status))
  }

  const event = await eventRepo.findById(input.eventId)
  if (!event) {
    return err(MatchEventErrors.notFound(input.eventId))
  }

  if (event.match_id !== input.matchId) {
    return err(MatchEventErrors.wrongMatch(input.eventId, input.matchId))
  }

  // If this was an ejection event, remove the draft suspension it created.
  const [eventType] = await db
    .select({ forces_game_ejection: sportEventTypes.forces_game_ejection })
    .from(sportEventTypes)
    .where(eq(sportEventTypes.id, event.event_type_id))
    .limit(1)

  if (eventType?.forces_game_ejection) {
    await db
      .delete(playerSuspensions)
      .where(
        and(
          eq(playerSuspensions.match_id, input.matchId),
          eq(playerSuspensions.player_id, event.player_id),
          eq(playerSuspensions.is_draft, true),
        ),
      )
  }

  await eventRepo.delete(input.eventId)
  return ok(undefined)
}
