import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { eq } from 'drizzle-orm'
import { recalculateStandings } from '@/modules/standings/use-cases/recalculate-standings.use-case'
import { db } from '@/shared/db/client'
import { matches } from '@/shared/db/schemas'
import type { Dispute } from '../dispute.entity'
import type { IDisputeRepository } from '../dispute.repository'
import { DisputeErrors } from '../errors'

export interface ResolveDisputeInput {
  disputeId: string
  resolvedBy: string
  resolutionNotes: string
  finalScoreOverride?: { home: number; away: number }
}

export async function resolveDispute(
  repo: IDisputeRepository,
  input: ResolveDisputeInput,
): Promise<Result<Dispute>> {
  const dispute = await repo.findById(input.disputeId)
  if (!dispute) return err(DisputeErrors.notFound(input.disputeId))
  if (dispute.status !== 'open') return err(DisputeErrors.notOpen(input.disputeId))

  const resolved = await repo.resolve(input.disputeId, {
    resolution_notes: input.resolutionNotes,
    final_score_override: input.finalScoreOverride,
    resolved_by: input.resolvedBy,
    resolved_at: new Date(),
  })

  // Apply score override and restore match to finished
  const [match] = await db.select().from(matches).where(eq(matches.id, dispute.match_id)).limit(1)

  if (match) {
    const scoreUpdate = input.finalScoreOverride
      ? {
          status: 'finished' as const,
          home_score: input.finalScoreOverride.home,
          away_score: input.finalScoreOverride.away,
          winner_team_id: deriveWinner(match, input.finalScoreOverride),
        }
      : { status: 'finished' as const }

    await db.update(matches).set(scoreUpdate).where(eq(matches.id, dispute.match_id))

    if (input.finalScoreOverride) {
      await recalculateStandings({ tournamentId: match.tournament_id, groupId: null })
    }
  }

  return ok(resolved)
}

function deriveWinner(
  match: { home_team_id: string; away_team_id: string },
  score: { home: number; away: number },
): string | null {
  if (score.home > score.away) return match.home_team_id
  if (score.away > score.home) return match.away_team_id
  return null
}
