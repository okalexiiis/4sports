import { db } from '@/shared/db/client'
import { sportEventTypes } from '@/shared/db/schemas'
import { EVENT_TYPE_IDS, TOURNAMENT_IDS } from './ids'

// Sport event types for the active league: goal, yellow card, and red card
// (which forces a game ejection + a 1-match suspension). Idempotent via fixed
// PK / unique(tournament, slug).
export async function seedDummyEventTypes() {
  await db
    .insert(sportEventTypes)
    .values([
      {
        id: EVENT_TYPE_IDS.gol,
        tournament_id: TOURNAMENT_IDS.ligaApertura,
        name: 'Gol',
        slug: 'gol',
      },
      {
        id: EVENT_TYPE_IDS.amarilla,
        tournament_id: TOURNAMENT_IDS.ligaApertura,
        name: 'Tarjeta amarilla',
        slug: 'amarilla',
      },
      {
        id: EVENT_TYPE_IDS.roja,
        tournament_id: TOURNAMENT_IDS.ligaApertura,
        name: 'Tarjeta roja',
        slug: 'roja',
        forces_game_ejection: true,
        suspension_matches: 1,
      },
    ])
    .onConflictDoNothing()
}
