import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matchResults } from '@/shared/db/schemas'
import { MatchErrors } from '../errors'
import type { IMatchRepository } from '../match.repository'
import type { MatchResult } from './register-period-results.use-case'

export interface MatchResultsOutput {
  final: { home: number | null; away: number | null }
  periods: MatchResult[]
}

export async function getMatchResults(
  repo: IMatchRepository,
  matchId: string,
): Promise<Result<MatchResultsOutput>> {
  const match = await repo.findById(matchId)
  if (!match) return err(MatchErrors.notFound(matchId))

  const periods = await db
    .select()
    .from(matchResults)
    .where(eq(matchResults.match_id, matchId))
    .orderBy(asc(matchResults.period_index))

  return ok({
    final: { home: match.home_score, away: match.away_score },
    periods: periods.map((row) => ({
      id: row.id,
      match_id: row.match_id,
      period_label: row.period_label,
      period_index: row.period_index,
      home_score: row.home_score,
      away_score: row.away_score,
      created_at: row.created_at,
    })),
  })
}
