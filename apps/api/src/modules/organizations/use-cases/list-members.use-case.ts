import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { ListMembersResult } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

export async function listMembers(
  repo: IOrganizationRepository,
  input: { orgId: string; page: number; limit: number; status?: string },
): Promise<Result<ListMembersResult>> {
  const result = await repo.listMembers(input.orgId, input.page, input.limit, input.status)
  return ok(result)
}
