import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { IOrganizationRepository } from '../organization.repository'

export async function transferOwnership(
  repo: IOrganizationRepository,
  input: {
    orgId: string
    newOwnerMemberId: string
    actorUserId: string
    actorRole: string
  },
): Promise<Result<null>> {
  const newOwner = await repo.findMemberById(input.orgId, input.newOwnerMemberId)
  if (!newOwner || newOwner.status !== 'active') {
    return err(OrgErrors.memberNotFound())
  }

  if (newOwner.role === 'owner') {
    return err(OrgErrors.alreadyOwner())
  }

  await repo.transferOwnership(input.orgId, input.newOwnerMemberId, input.actorUserId)

  await repo.createAuditLog({
    organization_id: input.orgId,
    actor_user_id: input.actorUserId,
    actor_role: input.actorRole,
    action: 'update',
    entity_type: 'organization',
    entity_id: input.orgId,
    before_data: { owner_user_id: input.actorUserId },
    after_data: { owner_member_id: input.newOwnerMemberId },
  })

  return ok(null)
}
