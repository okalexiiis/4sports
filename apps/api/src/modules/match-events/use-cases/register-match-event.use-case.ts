import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { playerSuspensions, sportEventTypes } from '@/shared/db/schemas'
import type { IMatchRepository } from '../../matches/match.repository'
import { MatchEventErrors } from '../errors'
import type { MatchEvent } from '../match-event.entity'
import type { IMatchEventRepository } from '../match-event.repository'

export interface RegisterMatchEventInput {
  matchId: string
  eventTypeId: string
  playerId: string
  teamId: string
  minute?: number
  periodIndex: number
  actorId: string
}

export async function registerMatchEvent(
  matchRepo: IMatchRepository,
  eventRepo: IMatchEventRepository,
  input: RegisterMatchEventInput,
): Promise<Result<MatchEvent>> {
  const match = await matchRepo.findById(input.matchId)
  if (!match) {
    return err(MatchEventErrors.matchNotLive('not_found'))
  }

  if (match.status !== 'live') {
    return err(MatchEventErrors.matchNotLive(match.status))
  }

  if (match.home_team_id !== input.teamId && match.away_team_id !== input.teamId) {
    return err(MatchEventErrors.playerNotInMatch(input.playerId))
  }

  const existingEjection = await eventRepo.findEjectionByMatchAndPlayer(
    input.matchId,
    input.playerId,
  )
  if (existingEjection) {
    return err(MatchEventErrors.playerAlreadyEjected(input.playerId))
  }

  const event = await eventRepo.create({
    match_id: input.matchId,
    player_id: input.playerId,
    team_id: input.teamId,
    event_type_id: input.eventTypeId,
    minute: input.minute,
    period_index: input.periodIndex,
    created_by: input.actorId,
  })

  // If the event causes ejection, create a draft suspension for the sanctions engine.
  const [eventType] = await db
    .select({
      forces_game_ejection: sportEventTypes.forces_game_ejection,
      suspension_matches: sportEventTypes.suspension_matches,
    })
    .from(sportEventTypes)
    .where(eq(sportEventTypes.id, input.eventTypeId))
    .limit(1)

  if (eventType?.forces_game_ejection) {
    await db.insert(playerSuspensions).values({
      player_id: input.playerId,
      tournament_id: match.tournament_id,
      match_id: input.matchId,
      event_type_id: input.eventTypeId,
      suspension_matches: eventType.suspension_matches,
      is_draft: true,
    })
  }

  return ok(event)
}
