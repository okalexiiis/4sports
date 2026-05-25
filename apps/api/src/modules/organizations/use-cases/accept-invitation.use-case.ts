import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { IOrganizationRepository } from '../organization.repository'

export async function acceptInvitation(
  repo: IOrganizationRepository,
  input: { orgId: string; userId: string },
): Promise<Result<null>> {
  const invitation = await repo.findInvitationByUser(input.orgId, input.userId)
  if (!invitation) {
    return err(OrgErrors.invitationNotFound())
  }

  if (invitation.invitation_expires_at && invitation.invitation_expires_at < new Date()) {
    return err(OrgErrors.invitationExpired())
  }

  await repo.acceptInvitation(invitation.id)
  return ok(null)
}
