import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { OrgMember } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

export async function inviteMember(
  repo: IOrganizationRepository,
  input: {
    orgId: string
    actorUserId: string
    actorRole: string
    email: string
    role: string
    tournament_ids: string[]
  },
): Promise<Result<OrgMember>> {
  // owner is never assignable via invite (only via transfer-ownership)
  if (input.role === 'owner') {
    return err(OrgErrors.insufficientRole())
  }

  // admin cannot invite another admin — only owner can
  if (input.role === 'admin' && input.actorRole !== 'owner') {
    return err(OrgErrors.insufficientRole())
  }

  // organizer role requires at least one tournament
  if (input.role === 'organizer' && input.tournament_ids.length === 0) {
    return err(
      new DomainError(
        'ORG_VALIDATION_TOURNAMENT_REQUIRED',
        'Organizer role requires at least one tournament_id',
      ),
    )
  }

  const targetUser = await repo.findUserByEmail(input.email)
  if (!targetUser) {
    return err(new DomainError('ORG_NOT_FOUND', 'No user found with that email address'))
  }

  const existing = await repo.findMemberByEmail(input.orgId, input.email)

  if (existing) {
    if (existing.status === 'active') {
      return err(
        new DomainError('ORG_CONFLICT_ALREADY_MEMBER', 'This user is already an active member', {
          can_resend: false,
        }),
      )
    }
    if (existing.status === 'invited') {
      return err(
        new DomainError(
          'ORG_CONFLICT_INVITE_PENDING',
          'An invitation is already pending for this email',
          { can_resend: true },
        ),
      )
    }
  }

  const member = await repo.inviteMember(input.orgId, targetUser.id, {
    role: input.role,
    tournament_ids: input.tournament_ids,
    invitedBy: input.actorUserId,
  })

  return ok(member)
}
