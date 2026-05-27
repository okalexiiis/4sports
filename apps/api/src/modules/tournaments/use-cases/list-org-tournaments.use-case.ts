import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { PaginatedTournaments, TournamentFilters } from '../tournament.entity'
import type { ITournamentRepository } from '../tournament.repository'

export async function listOrgTournaments(
  repo: ITournamentRepository,
  input: {
    orgId: string
    filters: TournamentFilters
  },
): Promise<Result<PaginatedTournaments>> {
  const result = await repo.listByOrg(input.orgId, input.filters)
  return ok(result)
}
