import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import type { Organization, UpdateOrgInput } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

export async function updateOrganization(
  repo: IOrganizationRepository,
  input: {
    orgId: string
    requestingUserId: string
    data: UpdateOrgInput
  },
): Promise<Result<Organization>> {
  const org = await repo.findById(input.orgId, input.requestingUserId)
  if (!org) {
    return err(new DomainError('ORG_NOT_FOUND', 'Organización no encontrada'))
  }

  const updated = await repo.updateOrganization(input.orgId, input.data)
  return ok(updated)
}
