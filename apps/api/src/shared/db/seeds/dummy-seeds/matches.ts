import { db } from '@/shared/db/client'
import { matches, matchResults } from '@/shared/db/schemas'
import { MATCH_IDS, TEAM_IDS, TOURNAMENT_IDS, VENUE_IDS } from './ids'

const DAY = 24 * 60 * 60 * 1000

// The three finished results, also consumed by the standings + stats seeds so
// everything stays consistent. Scores split into two halves for match_results.
export const FINISHED = [
  {
    id: MATCH_IDS.tigresVsRayados,
    home: TEAM_IDS.tigres,
    away: TEAM_IDS.rayados,
    homeScore: 2,
    awayScore: 1,
    halves: [
      { home: 1, away: 0 },
      { home: 1, away: 1 },
    ],
  },
  {
    id: MATCH_IDS.pumasVsAguilas,
    home: TEAM_IDS.pumas,
    away: TEAM_IDS.aguilas,
    homeScore: 0,
    awayScore: 0,
    halves: [
      { home: 0, away: 0 },
      { home: 0, away: 0 },
    ],
  },
  {
    id: MATCH_IDS.tigresVsPumas,
    home: TEAM_IDS.tigres,
    away: TEAM_IDS.pumas,
    homeScore: 3,
    awayScore: 0,
    halves: [
      { home: 1, away: 0 },
      { home: 2, away: 0 },
    ],
  },
] as const

const SCHEDULED = [
  { id: MATCH_IDS.rayadosVsAguilas, home: TEAM_IDS.rayados, away: TEAM_IDS.aguilas, inDays: 3 },
  { id: MATCH_IDS.tigresVsAguilas, home: TEAM_IDS.tigres, away: TEAM_IDS.aguilas, inDays: 5 },
  { id: MATCH_IDS.rayadosVsPumas, home: TEAM_IDS.rayados, away: TEAM_IDS.pumas, inDays: 7 },
] as const

function winner(m: (typeof FINISHED)[number]) {
  if (m.homeScore > m.awayScore) return m.home
  if (m.awayScore > m.homeScore) return m.away
  return null
}

// Round-robin slate for Liga Apertura: 3 finished + 3 upcoming scheduled
// matches. Idempotent via fixed PKs.
export async function seedDummyMatches() {
  const now = Date.now()

  const finishedRows = FINISHED.map((m, i) => {
    const kickoff = now - (12 - i * 3) * DAY
    return {
      id: m.id,
      tournament_id: TOURNAMENT_IDS.ligaApertura,
      home_team_id: m.home,
      away_team_id: m.away,
      venue_id: VENUE_IDS.estadioNorte,
      status: 'finished' as const,
      home_score: m.homeScore,
      away_score: m.awayScore,
      winner_team_id: winner(m),
      scheduled_at: new Date(kickoff),
      started_at: new Date(kickoff),
      ended_at: new Date(kickoff + 2 * 60 * 60 * 1000),
    }
  })

  const scheduledRows = SCHEDULED.map((m) => ({
    id: m.id,
    tournament_id: TOURNAMENT_IDS.ligaApertura,
    home_team_id: m.home,
    away_team_id: m.away,
    venue_id: VENUE_IDS.canchaSur,
    status: 'scheduled' as const,
    scheduled_at: new Date(now + m.inDays * DAY),
  }))

  await db
    .insert(matches)
    .values([...finishedRows, ...scheduledRows])
    .onConflictDoNothing()

  // match_results has no unique constraint, so derive fixed PKs (match #, period)
  // for idempotency: 0000000a-...-0000000<match><period>.
  const resultRows = FINISHED.flatMap((m, mi) =>
    m.halves.map((h, idx) => ({
      id: `0000000a-0000-4000-8000-0000000000${mi + 1}${idx + 1}`,
      match_id: m.id,
      period_label: idx === 0 ? '1er Tiempo' : '2do Tiempo',
      period_index: idx + 1,
      home_score: h.home,
      away_score: h.away,
    })),
  )

  await db.insert(matchResults).values(resultRows).onConflictDoNothing()
}
