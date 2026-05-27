import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { IOrganizationRepository } from '../organization.repository'

export async function rejectInvitation(
  repo: IOrganizationRepository,
  input: {
    memberId: string
    requestingUserId: string
  },
): Promise<Result<null>> {
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

  await repo.rejectInvitation(input.memberId)
  return ok(null)
}
