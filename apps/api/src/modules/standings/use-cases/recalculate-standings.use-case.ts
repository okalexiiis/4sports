import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matches, standingEntries, standings, tournaments } from '@/shared/db/schemas'
import type { StandingEntry } from '../standing.entity'

export interface RecalculateStandingsInput {
  tournamentId: string
  // Null for single-group (league) tournaments
  groupId?: string | null
}

interface TournamentSettings {
  points_win?: number
  points_draw?: number
  points_loss?: number
  tiebreaker?: string[]
}

interface TeamStats {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  // h2h map: teamId → { gf, ga } used for head-to-head tiebreaker
  h2h: Map<string, { gf: number; ga: number }>
}

// Default tiebreaker order when tournament settings don't specify one.
const DEFAULT_TIEBREAKERS = ['pts', 'dg', 'gf', 'h2h']

function buildTeamStats(
  teamIds: string[],
  finishedMatches: (typeof matches.$inferSelect)[],
  pointsWin: number,
  pointsDraw: number,
  pointsLoss: number,
): Map<string, TeamStats> {
  const statsMap = new Map<string, TeamStats>()

  for (const teamId of teamIds) {
    statsMap.set(teamId, {
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      h2h: new Map(),
    })
  }

  for (const match of finishedMatches) {
    const home = statsMap.get(match.home_team_id)
    const away = statsMap.get(match.away_team_id)
    if (!home || !away) continue

    const hg = match.home_score ?? 0
    const ag = match.away_score ?? 0

    home.played++
    away.played++
    home.goalsFor += hg
    home.goalsAgainst += ag
    away.goalsFor += ag
    away.goalsAgainst += hg

    // Update h2h maps
    const homeH2h = home.h2h.get(match.away_team_id) ?? { gf: 0, ga: 0 }
    home.h2h.set(match.away_team_id, { gf: homeH2h.gf + hg, ga: homeH2h.ga + ag })
    const awayH2h = away.h2h.get(match.home_team_id) ?? { gf: 0, ga: 0 }
    away.h2h.set(match.home_team_id, { gf: awayH2h.gf + ag, ga: awayH2h.ga + hg })

    if (match.winner_team_id === match.home_team_id) {
      home.won++
      home.points += pointsWin
      away.lost++
      away.points += pointsLoss
    } else if (match.winner_team_id === match.away_team_id) {
      away.won++
      away.points += pointsWin
      home.lost++
      home.points += pointsLoss
    } else {
      // Draw (winner_team_id IS NULL)
      home.drawn++
      home.points += pointsDraw
      away.drawn++
      away.points += pointsDraw
    }
  }

  for (const stats of statsMap.values()) {
    stats.goalDifference = stats.goalsFor - stats.goalsAgainst
  }

  return statsMap
}

function h2hDiff(a: TeamStats, b: TeamStats): number {
  const aVsB = a.h2h.get(b.teamId)
  const bVsA = b.h2h.get(a.teamId)
  const aGf = aVsB?.gf ?? 0
  const bGf = bVsA?.gf ?? 0
  return aGf - bGf
}

function sortTeams(entries: TeamStats[], tiebreakers: string[]): TeamStats[] {
  return [...entries].sort((a, b) => {
    for (const criterion of tiebreakers) {
      let diff = 0
      if (criterion === 'pts') diff = b.points - a.points
      else if (criterion === 'dg') diff = b.goalDifference - a.goalDifference
      else if (criterion === 'gf') diff = b.goalsFor - a.goalsFor
      else if (criterion === 'h2h') diff = h2hDiff(b, a)
      if (diff !== 0) return diff
    }
    return 0
  })
}

export async function recalculateStandings(
  input: RecalculateStandingsInput,
): Promise<Result<StandingEntry[]>>
export async function recalculateStandings(
  input: RecalculateStandingsInput,
  // biome-ignore lint/suspicious/noExplicitAny: Drizzle transaction type varies — use any to allow both tx and db
  tx: any,
): Promise<Result<StandingEntry[]>>
export async function recalculateStandings(
  input: RecalculateStandingsInput,
  // biome-ignore lint/suspicious/noExplicitAny: Drizzle transaction type varies — use any to allow both tx and db
  tx?: any,
): Promise<Result<StandingEntry[]>> {
  const client = tx ?? db

  // Fetch tournament settings for points config and tiebreakers
  const [tournament] = await client
    .select({ settings: tournaments.settings })
    .from(tournaments)
    .where(eq(tournaments.id, input.tournamentId))
    .limit(1)

  const settings = (tournament?.settings ?? {}) as TournamentSettings
  const pointsWin = settings.points_win ?? 3
  const pointsDraw = settings.points_draw ?? 1
  const pointsLoss = settings.points_loss ?? 0
  const tiebreakers = settings.tiebreaker ?? DEFAULT_TIEBREAKERS

  // Step 1 — Load all finished/walkover matches for this tournament/group
  const completedStatuses = ['finished', 'walkover'] as const

  // For group-mode tournaments, round_id acts as a group identifier
  const matchConditions = [
    eq(matches.tournament_id, input.tournamentId),
    inArray(matches.status, completedStatuses),
  ]
  if (input.groupId) {
    matchConditions.push(eq(matches.round_id, input.groupId))
  }

  const completedMatches = await client
    .select()
    .from(matches)
    .where(and(...matchConditions))

  // Step 2 — Gather all participating team IDs
  const teamIdSet = new Set<string>()
  for (const m of completedMatches) {
    teamIdSet.add(m.home_team_id)
    teamIdSet.add(m.away_team_id)
  }
  const teamIds = [...teamIdSet]

  if (teamIds.length === 0) {
    return ok([])
  }

  // Step 3 — Build stats for each team
  const statsMap = buildTeamStats(teamIds, completedMatches, pointsWin, pointsDraw, pointsLoss)

  // Step 4 — Sort by tiebreaker criteria
  const sorted = sortTeams([...statsMap.values()], tiebreakers)

  // Step 5 — Upsert standings row (one per tournament/group)
  const groupId = input.groupId ?? null

  const [standingRow] = await client
    .insert(standings)
    .values({
      tournament_id: input.tournamentId,
      group_id: groupId,
      calculated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [standings.tournament_id, standings.group_id],
      set: { calculated_at: new Date() },
    })
    .returning()

  // Step 6 — Delete existing entries then bulk insert updated ones (clean full rebuild)
  await client.delete(standingEntries).where(eq(standingEntries.standing_id, standingRow.id))

  const entriesToInsert = sorted.map((stats, idx) => ({
    standing_id: standingRow.id,
    team_id: stats.teamId,
    position: idx + 1,
    played: stats.played,
    won: stats.won,
    drawn: stats.drawn,
    lost: stats.lost,
    goals_for: stats.goalsFor,
    goals_against: stats.goalsAgainst,
    goal_difference: stats.goalDifference,
    points: stats.points,
  }))

  const insertedEntries = await client.insert(standingEntries).values(entriesToInsert).returning()

  return ok(
    insertedEntries.map((row: typeof standingEntries.$inferSelect) => ({
      id: row.id,
      standing_id: row.standing_id,
      team_id: row.team_id,
      position: row.position,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goals_for: row.goals_for,
      goals_against: row.goals_against,
      goal_difference: row.goal_difference,
      points: row.points,
    })),
  )
}
