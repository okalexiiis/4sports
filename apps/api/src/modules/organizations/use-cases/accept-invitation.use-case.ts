import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { OrgMember } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

export async function acceptInvitation(
  repo: IOrganizationRepository,
  input: {
    memberId: string
    requestingUserId: string
  },
): Promise<Result<OrgMember>> {
  const invitation = await repo.findInvitationById(input.memberId)
  if (!invitation) {
    return err(OrgErrors.invitationNotFound())
  }

  if (invitation.user_id !== input.requestingUserId) {
    return err(OrgErrors.invitationForbidden())
  }

  if (invitation.status !== 'invited') {
    return err(OrgErrors.invitationAlreadyProcessed())
  }

  if (invitation.invitation_expires_at && invitation.invitation_expires_at < new Date()) {
    return err(OrgErrors.invitationExpired())
  }

  const member = await repo.acceptInvitation(input.memberId, input.requestingUserId)
  return ok(member)
}
