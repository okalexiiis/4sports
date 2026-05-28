import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { and, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matches, playerStatValues, playerSuspensions, sportEventTypes } from '@/shared/db/schemas'
import { MatchErrors } from '../errors'
import type { Match } from '../match.entity'
import type { IMatchRepository } from '../match.repository'

export interface FinishMatchInput {
  matchId: string
  actorId: string
}

export interface FinishMatchResult {
  match: Match
  // false until D2 implements the full standings rebuild inside the transaction
  standingsUpdated: boolean
}

function rowToMatch(row: typeof matches.$inferSelect): Match {
  return {
    id: row.id,
    tournament_id: row.tournament_id,
    home_team_id: row.home_team_id,
    away_team_id: row.away_team_id,
    venue_id: row.venue_id,
    round_id: row.round_id,
    status: row.status as Match['status'],
    home_score: row.home_score,
    away_score: row.away_score,
    winner_team_id: row.winner_team_id,
    scheduled_at: row.scheduled_at,
    started_at: row.started_at,
    ended_at: row.ended_at,
    referee_session_token: row.referee_session_token,
    next_match_id: row.next_match_id,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function finishMatch(
  repo: IMatchRepository,
  input: FinishMatchInput,
): Promise<Result<FinishMatchResult>> {
  const match = await repo.findById(input.matchId)
  if (!match) return err(MatchErrors.notFound(input.matchId))

  if (match.status !== 'live') {
    return err(MatchErrors.invalidStatusTransition(match.status, 'finished'))
  }

  const updatedRow = await db.transaction(async (tx) => {
    // Step 1 — Calculate score from player_stat_values joined with sport_event_types slug='goal'.
    // Score is always derived from events; never accepted as caller input.
    const goalEvents = await tx
      .select({ team_id: playerStatValues.team_id })
      .from(playerStatValues)
      .innerJoin(sportEventTypes, eq(playerStatValues.event_type_id, sportEventTypes.id))
      .where(and(eq(playerStatValues.match_id, input.matchId), eq(sportEventTypes.slug, 'goal')))

    let homeScore = 0
    let awayScore = 0
    for (const e of goalEvents) {
      if (e.team_id === match.home_team_id) homeScore++
      else if (e.team_id === match.away_team_id) awayScore++
    }

    // Step 2 — Determine winner. Draws remain null; advanced tiebreaker logic
    // (tournament.settings.tiebreaker_rules) is handled by the standings engine (D2).
    let winnerTeamId: string | null = null
    if (homeScore > awayScore) winnerTeamId = match.home_team_id
    else if (awayScore > homeScore) winnerTeamId = match.away_team_id

    // Step 3 — Update match row.
    const [row] = await tx
      .update(matches)
      .set({
        status: 'finished',
        home_score: homeScore,
        away_score: awayScore,
        winner_team_id: winnerTeamId,
        ended_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(matches.id, input.matchId))
      .returning()

    // Step 4 — Standings recalculation delegated to D2.
    // TODO(D2): await recalculateStandings(tx, match.tournament_id)

    // Step 5 — Confirm draft suspensions created during the live match.
    await tx
      .update(playerSuspensions)
      .set({ is_draft: false, confirmed_by: input.actorId, confirmed_at: new Date() })
      .where(
        and(eq(playerSuspensions.match_id, input.matchId), eq(playerSuspensions.is_draft, true)),
      )

    // Step 7 — Bracket advancement: assign winner to the reserved slot in the next match.
    if (match.next_match_id && winnerTeamId) {
      const [nextMatch] = await tx
        .select()
        .from(matches)
        .where(eq(matches.id, match.next_match_id))
        .limit(1)

      if (nextMatch) {
        // The slot holding one of the current match's teams was reserved for the winner.
        const isHomeSlot =
          nextMatch.home_team_id === match.home_team_id ||
          nextMatch.home_team_id === match.away_team_id

        await tx
          .update(matches)
          .set(
            isHomeSlot
              ? { home_team_id: winnerTeamId, updated_at: new Date() }
              : { away_team_id: winnerTeamId, updated_at: new Date() },
          )
          .where(eq(matches.id, match.next_match_id))
      }
    }

    // biome-ignore lint/style/noNonNullAssertion: update on existing row always returns one row
    return row!
  })

  // Step 6 — Enqueue BullMQ job outside the transaction so it only fires after commit.
  // TODO(H1): await matchFinishedQueue.add('match.finished', { matchId: input.matchId })

  return ok({ match: rowToMatch(updatedRow), standingsUpdated: false })
}
