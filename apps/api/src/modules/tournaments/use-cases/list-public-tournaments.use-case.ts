import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { PaginatedTournaments, PublicTournamentFilters } from '../tournament.entity'
import type { ITournamentRepository } from '../tournament.repository'

export async function listPublicTournaments(
  repo: ITournamentRepository,
  input: {
    filters: PublicTournamentFilters
  },
): Promise<Result<PaginatedTournaments>> {
  const result = await repo.listPublic(input.filters)
  return ok(result)
}
