import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matchResults } from '@/shared/db/schemas'
import { MatchErrors } from '../errors'
import type { IMatchRepository } from '../match.repository'

export interface PeriodInput {
  period_label: string
  period_index: number
  home_score: number
  away_score: number
}

export interface MatchResult {
  id: string
  match_id: string
  period_label: string
  period_index: number
  home_score: number
  away_score: number
  created_at: Date
}

export interface RegisterPeriodResultsInput {
  matchId: string
  periods: PeriodInput[]
}

export async function registerPeriodResults(
  repo: IMatchRepository,
  input: RegisterPeriodResultsInput,
): Promise<Result<MatchResult[]>> {
  const match = await repo.findById(input.matchId)
  if (!match) return err(MatchErrors.notFound(input.matchId))

  const periodIndexes = input.periods.map((p) => p.period_index)

  // Delete existing rows for the given period indexes then bulk-insert updated ones.
  // match_results has no unique constraint on (match_id, period_index), so
  // we can't use onConflictDoUpdate — clean replace is the safest approach.
  await db
    .delete(matchResults)
    .where(
      and(
        eq(matchResults.match_id, input.matchId),
        inArray(matchResults.period_index, periodIndexes),
      ),
    )

  const inserted = await db
    .insert(matchResults)
    .values(
      input.periods.map((p) => ({
        match_id: input.matchId,
        period_label: p.period_label,
        period_index: p.period_index,
        home_score: p.home_score,
        away_score: p.away_score,
      })),
    )
    .returning()

  return ok(
    inserted.map((row) => ({
      id: row.id,
      match_id: row.match_id,
      period_label: row.period_label,
      period_index: row.period_index,
      home_score: row.home_score,
      away_score: row.away_score,
      created_at: row.created_at,
    })),
  )
}
