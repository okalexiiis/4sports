import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { Suspension } from '../suspension.entity'
import type { ISuspensionRepository, ListSuspensionsFilter } from '../suspension.repository'

export async function listSuspensions(
  repo: ISuspensionRepository,
  filter: ListSuspensionsFilter,
): Promise<Result<Suspension[]>> {
  const suspensions = await repo.listByOrganization(filter)
  return ok(suspensions)
}
