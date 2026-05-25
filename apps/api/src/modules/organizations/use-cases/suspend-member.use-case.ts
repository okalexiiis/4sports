import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { IOrganizationRepository } from '../organization.repository'

export async function suspendMember(
  repo: IOrganizationRepository,
  input: {
    orgId: string
    memberId: string
    actorUserId: string
    actorRole: string
    action: 'suspend' | 'reactivate'
  },
): Promise<Result<null>> {
  const member = await repo.findMemberById(input.orgId, input.memberId)
  if (!member) {
    return err(OrgErrors.memberNotFound())
  }

  if (input.action === 'suspend') {
    // owner cannot be suspended
    if (member.role === 'owner') {
      return err(OrgErrors.insufficientRole())
    }

    // admin can only be suspended by owner
    if (member.role === 'admin' && input.actorRole !== 'owner') {
      return err(OrgErrors.insufficientRole())
    }

    await repo.updateMemberStatus(input.memberId, 'suspended')
  } else {
    await repo.updateMemberStatus(input.memberId, 'active')
  }

  await repo.createAuditLog({
    organization_id: input.orgId,
    actor_user_id: input.actorUserId,
    actor_role: input.actorRole,
    action: 'update',
    entity_type: 'organization_member',
    entity_id: input.memberId,
    before_data: { status: member.status },
    after_data: { status: input.action === 'suspend' ? 'suspended' : 'active' },
  })

  return ok(null)
}
