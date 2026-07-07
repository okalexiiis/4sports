import { db } from '@/shared/db/client'
import { playerStatValues } from '@/shared/db/schemas'
import { EVENT_TYPE_IDS, MATCH_IDS, PLAYER_IDS, TEAM_IDS } from './ids'
import { type UserIds, userId } from './users'

interface EventSpec {
  matchId: string
  playerId: string
  teamId: string
  eventTypeId: string
  minute: number
  period: number
}

// Goal/card events consistent with the finished-match scores:
//   tigresVsRayados 2-1, pumasVsAguilas 0-0, tigresVsPumas 3-0
const EVENTS: EventSpec[] = [
  // Tigres 2 - 1 Rayados
  {
    matchId: MATCH_IDS.tigresVsRayados,
    playerId: PLAYER_IDS.tigres4,
    teamId: TEAM_IDS.tigres,
    eventTypeId: EVENT_TYPE_IDS.gol,
    minute: 15,
    period: 1,
  },
  {
    matchId: MATCH_IDS.tigresVsRayados,
    playerId: PLAYER_IDS.tigres4,
    teamId: TEAM_IDS.tigres,
    eventTypeId: EVENT_TYPE_IDS.gol,
    minute: 70,
    period: 2,
  },
  {
    matchId: MATCH_IDS.tigresVsRayados,
    playerId: PLAYER_IDS.rayados4,
    teamId: TEAM_IDS.rayados,
    eventTypeId: EVENT_TYPE_IDS.gol,
    minute: 80,
    period: 2,
  },
  // Pumas 0 - 0 Aguilas (just cards)
  {
    matchId: MATCH_IDS.pumasVsAguilas,
    playerId: PLAYER_IDS.pumas2,
    teamId: TEAM_IDS.pumas,
    eventTypeId: EVENT_TYPE_IDS.amarilla,
    minute: 40,
    period: 1,
  },
  {
    matchId: MATCH_IDS.pumasVsAguilas,
    playerId: PLAYER_IDS.aguilas2,
    teamId: TEAM_IDS.aguilas,
    eventTypeId: EVENT_TYPE_IDS.amarilla,
    minute: 60,
    period: 2,
  },
  // Tigres 3 - 0 Pumas
  {
    matchId: MATCH_IDS.tigresVsPumas,
    playerId: PLAYER_IDS.tigres4,
    teamId: TEAM_IDS.tigres,
    eventTypeId: EVENT_TYPE_IDS.gol,
    minute: 20,
    period: 1,
  },
  {
    matchId: MATCH_IDS.tigresVsPumas,
    playerId: PLAYER_IDS.tigres3,
    teamId: TEAM_IDS.tigres,
    eventTypeId: EVENT_TYPE_IDS.gol,
    minute: 55,
    period: 2,
  },
  {
    matchId: MATCH_IDS.tigresVsPumas,
    playerId: PLAYER_IDS.tigres4,
    teamId: TEAM_IDS.tigres,
    eventTypeId: EVENT_TYPE_IDS.gol,
    minute: 75,
    period: 2,
  },
]

// Confirmed (is_draft=false) player events for the finished matches.
// player_stat_values has no unique constraint, so use fixed PKs for idempotency.
export async function seedDummyStats(userIds: UserIds) {
  const createdBy = userId(userIds, 'organizer')
  const rows = EVENTS.map((e, i) => ({
    id: `0000000b-0000-4000-8000-0000000000${String(i + 1).padStart(2, '0')}`,
    match_id: e.matchId,
    player_id: e.playerId,
    team_id: e.teamId,
    event_type_id: e.eventTypeId,
    minute: e.minute,
    period_index: e.period,
    is_draft: false,
    registered_by: createdBy,
  }))

  await db.insert(playerStatValues).values(rows).onConflictDoNothing()
}
