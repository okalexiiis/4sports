import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { notificationsQueue } from '@/shared/lib/bullmq'
import { MatchErrors } from '../errors'
import type { Match, MatchStatus } from '../match.entity'
import type { IMatchRepository } from '../match.repository'

// Defines which target statuses are reachable from each source status.
// Unlisted statuses (walkover, cancelled) are terminal — no outgoing transitions.
const VALID_TRANSITIONS: Partial<Record<MatchStatus, MatchStatus[]>> = {
  scheduled: ['live', 'postponed', 'walkover', 'cancelled'],
  postponed: ['scheduled', 'cancelled'],
  live: ['finished', 'suspended'],
  suspended: ['live', 'walkover'],
  finished: ['disputed'],
  disputed: ['finished'],
}

export interface TransitionMatchStatusInput {
  matchId: string
  newStatus: MatchStatus
  actorId: string
  reason?: string
  // Required when transitioning to 'walkover'.
  // Caller reads this from tournaments.settings.walkover_score — never hardcode here.
  // Format: "home-away" e.g. "3-0"
  walkoverScore?: string
  // Required when transitioning to 'walkover' to record the winning team.
  winnerTeamId?: string
}

function parseWalkoverScore(raw: string): { home: number; away: number } | null {
  const parts = raw.split('-')
  if (parts.length !== 2) return null
  const home = Number(parts[0])
  const away = Number(parts[1])
  if (Number.isNaN(home) || Number.isNaN(away)) return null
  return { home, away }
}

export async function transitionMatchStatus(
  repo: IMatchRepository,
  input: TransitionMatchStatusInput,
): Promise<Result<Match>> {
  const match = await repo.findById(input.matchId)
  if (!match) {
    return err(MatchErrors.notFound(input.matchId))
  }

  const allowed = VALID_TRANSITIONS[match.status] ?? []
  if (!allowed.includes(input.newStatus)) {
    return err(MatchErrors.invalidStatusTransition(match.status, input.newStatus))
  }

  const extra: Parameters<IMatchRepository['updateStatus']>[2] = {}

  if (input.newStatus === 'live') {
    extra.started_at = new Date()
  }

  if (input.newStatus === 'finished') {
    extra.ended_at = new Date()
  }

  if (input.newStatus === 'walkover') {
    if (!input.walkoverScore) {
      return err(
        MatchErrors.invalidStatusTransition(
          match.status,
          'walkover — walkoverScore is required (read from tournament.settings.walkover_score)',
        ),
      )
    }
    const score = parseWalkoverScore(input.walkoverScore)
    if (!score) {
      return err(
        MatchErrors.invalidStatusTransition(
          match.status,
          'walkover — invalid walkoverScore format, expected "N-N"',
        ),
      )
    }
    extra.home_score = score.home
    extra.away_score = score.away
    extra.winner_team_id = input.winnerTeamId ?? null
    extra.ended_at = new Date()
  }

  const updated = await repo.updateStatus(input.matchId, input.newStatus, extra)

  if (input.newStatus === 'postponed') {
    await notificationsQueue.add('match.rescheduled', {
      type: 'match.rescheduled',
      payload: { matchId: input.matchId },
    })
  }

  return ok(updated)
}
