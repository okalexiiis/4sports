import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { IOrganizationRepository } from '../organization.repository'

export async function removeMember(
  repo: IOrganizationRepository,
  input: {
    orgId: string
    memberId: string
    actorUserId: string
    actorRole: string
  },
): Promise<Result<null>> {
  const member = await repo.findMemberById(input.orgId, input.memberId)
  if (!member) {
    return err(OrgErrors.memberNotFound())
  }

  // admin cannot remove another admin
  if (member.role === 'admin') {
    return err(OrgErrors.insufficientRole())
  }

  // cannot remove the only active owner
  if (member.role === 'owner') {
    const ownerCount = await repo.countActiveOwners(input.orgId)
    if (ownerCount <= 1) {
      return err(OrgErrors.insufficientRole())
    }
  }

  await repo.removeMember(input.memberId)

  await repo.createAuditLog({
    organization_id: input.orgId,
    actor_user_id: input.actorUserId,
    actor_role: input.actorRole,
    action: 'delete',
    entity_type: 'organization_member',
    entity_id: input.memberId,
    before_data: { role: member.role, status: member.status },
    after_data: { status: 'left' },
  })

  return ok(null)
}
