import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { OrgWithRole } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

export async function getOrganization(
  repo: IOrganizationRepository,
  input: { orgId: string; requestingUserId: string },
): Promise<Result<OrgWithRole>> {
  const org = await repo.findById(input.orgId, input.requestingUserId)

  if (!org) {
    return err(OrgErrors.notFound())
  }

  return ok(org)
}
