import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { IOrganizationRepository } from '../organization.repository'

export async function transferOwnership(
  repo: IOrganizationRepository,
  input: {
    orgId: string
    actorMemberId: string
    actorUserId: string
    actorRole: string
    newOwnerMemberId: string
  },
): Promise<Result<null>> {
  const target = await repo.findMemberById(input.orgId, input.newOwnerMemberId)
  if (!target) {
    return err(OrgErrors.memberNotFound())
  }

  if (target.status !== 'active') {
    return err(new DomainError('ORG_CONFLICT_MEMBER_STATUS', 'Target member must be active'))
  }

  if (target.role === 'owner') {
    return err(new DomainError('ORG_CONFLICT_ALREADY_OWNER', 'This member is already the owner'))
  }

  await repo.transferOwnership(input.orgId, input.actorMemberId, input.newOwnerMemberId)

  await repo.createAuditLog({
    organization_id: input.orgId,
    actor_user_id: input.actorUserId,
    actor_role: input.actorRole,
    action: 'update',
    entity_type: 'organization_member',
    entity_id: input.actorMemberId,
    before_data: { role: 'owner' },
    after_data: { role: 'admin' },
  })

  await repo.createAuditLog({
    organization_id: input.orgId,
    actor_user_id: input.actorUserId,
    actor_role: input.actorRole,
    action: 'update',
    entity_type: 'organization_member',
    entity_id: input.newOwnerMemberId,
    before_data: { role: target.role },
    after_data: { role: 'owner' },
  })

  return ok(null)
}
