import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { OrgMember } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

const RESTRICTED_ROLES = new Set(['owner', 'admin'])

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
  // admin cannot invite owner or another admin
  if (RESTRICTED_ROLES.has(input.role)) {
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

  const targetUser = await repo.findUserByEmail(input.email)

  const member = await repo.inviteMember(input.orgId, targetUser?.id ?? null, {
    role: input.role,
    tournament_ids: input.tournament_ids,
    invitedBy: input.actorUserId,
    invited_email: targetUser === null ? input.email : undefined,
  })

  return ok(member)
}
