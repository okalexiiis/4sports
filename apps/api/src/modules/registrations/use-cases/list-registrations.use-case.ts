import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { PaginatedRegistrations, RegistrationFilters } from '../registration.entity'
import type { IRegistrationRepository } from '../registration.repository'

export async function listRegistrations(
  repo: IRegistrationRepository,
  input: {
    tournamentId: string
    filters: RegistrationFilters
  },
): Promise<Result<PaginatedRegistrations>> {
  const result = await repo.list(input.tournamentId, input.filters)
  return ok(result)
}
