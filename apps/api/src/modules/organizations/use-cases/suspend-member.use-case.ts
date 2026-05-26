import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { OrgMember } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

export async function suspendMember(
  repo: IOrganizationRepository,
  input: {
    orgId: string
    memberId: string
    actorUserId: string
    actorRole: string
  },
): Promise<Result<OrgMember>> {
  const member = await repo.findMemberById(input.orgId, input.memberId)
  if (!member) {
    return err(OrgErrors.memberNotFound())
  }

  if (member.role === 'owner') {
    return err(OrgErrors.insufficientRole())
  }

  if (member.status !== 'active') {
    return err(
      new DomainError('ORG_CONFLICT_MEMBER_STATUS', 'Only active members can be suspended'),
    )
  }

  const updated = await repo.suspendMember(input.memberId)

  await repo.createAuditLog({
    organization_id: input.orgId,
    actor_user_id: input.actorUserId,
    actor_role: input.actorRole,
    action: 'update',
    entity_type: 'organization_member',
    entity_id: input.memberId,
    before_data: { status: 'active' },
    after_data: { status: 'suspended' },
  })

  return ok(updated)
}
