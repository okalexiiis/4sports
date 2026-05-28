import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { ListMatchesFilters, Match } from '../match.entity'
import type { IMatchRepository } from '../match.repository'

export async function listMatches(
  repo: IMatchRepository,
  input: { tournamentId: string; filters?: ListMatchesFilters },
): Promise<Result<Match[]>> {
  const matches = await repo.listByTournament(input.tournamentId, input.filters)
  return ok(matches)
}
