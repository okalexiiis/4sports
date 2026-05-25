import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { OrgMember } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

const RESTRICTED_ROLES = new Set(['admin', 'owner'])

export async function updateMemberRole(
  repo: IOrganizationRepository,
  input: {
    orgId: string
    memberId: string
    actorUserId: string
    actorRole: string
    role: string
    tournament_ids: string[]
  },
): Promise<Result<OrgMember>> {
  const member = await repo.findMemberById(input.orgId, input.memberId)
  if (!member) {
    return err(OrgErrors.memberNotFound())
  }

  // admin cannot promote to admin or owner
  if (RESTRICTED_ROLES.has(input.role)) {
    return err(OrgErrors.insufficientRole())
  }

  // cannot demote the only active owner
  if (member.role === 'owner') {
    const ownerCount = await repo.countActiveOwners(input.orgId)
    if (ownerCount <= 1) {
      return err(OrgErrors.insufficientRole())
    }
  }

  const updated = await repo.updateMemberRole(input.memberId, {
    role: input.role,
    tournament_ids: input.tournament_ids,
  })

  await repo.createAuditLog({
    organization_id: input.orgId,
    actor_user_id: input.actorUserId,
    actor_role: input.actorRole,
    action: 'update',
    entity_type: 'organization_member',
    entity_id: input.memberId,
    before_data: { role: member.role },
    after_data: { role: input.role },
  })

  return ok(updated)
}
