import { db } from '@/shared/db/client'
import { standingEntries, standings } from '@/shared/db/schemas'
import { STANDING_IDS, TEAM_IDS, TOURNAMENT_IDS } from './ids'
import { FINISHED } from './matches'

interface Row {
  team_id: string
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
}

// Standings for Liga Apertura, computed from the finished matches so the table
// always matches the results. Idempotent via fixed PK / unique(standing, team).
export async function seedDummyStandings() {
  const table = new Map<string, Row>()
  for (const id of Object.values(TEAM_IDS)) {
    table.set(id, {
      team_id: id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
    })
  }

  for (const m of FINISHED) {
    const home = table.get(m.home)
    const away = table.get(m.away)
    if (!home || !away) continue

    home.played++
    away.played++
    home.goals_for += m.homeScore
    home.goals_against += m.awayScore
    away.goals_for += m.awayScore
    away.goals_against += m.homeScore

    if (m.homeScore > m.awayScore) {
      home.won++
      away.lost++
    } else if (m.homeScore < m.awayScore) {
      away.won++
      home.lost++
    } else {
      home.drawn++
      away.drawn++
    }
  }

  const ranked = [...table.values()]
    .map((r) => ({
      ...r,
      goal_difference: r.goals_for - r.goals_against,
      points: r.won * 3 + r.drawn,
    }))
    .sort(
      (a, b) =>
        b.points - a.points || b.goal_difference - a.goal_difference || b.goals_for - a.goals_for,
    )

  await db
    .insert(standings)
    .values({
      id: STANDING_IDS.ligaApertura,
      tournament_id: TOURNAMENT_IDS.ligaApertura,
      calculated_at: new Date(),
    })
    .onConflictDoNothing()

  await db
    .insert(standingEntries)
    .values(
      ranked.map((r, i) => ({
        standing_id: STANDING_IDS.ligaApertura,
        team_id: r.team_id,
        position: i + 1,
        played: r.played,
        won: r.won,
        drawn: r.drawn,
        lost: r.lost,
        goals_for: r.goals_for,
        goals_against: r.goals_against,
        goal_difference: r.goal_difference,
        points: r.points,
      })),
    )
    .onConflictDoNothing()
}
