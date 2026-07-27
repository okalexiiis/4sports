import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { UserInvitation } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

export async function listUserInvitations(
  repo: IOrganizationRepository,
  input: { userId: string },
): Promise<Result<UserInvitation[]>> {
  const invitations = await repo.listInvitationsForUser(input.userId)
  return ok(invitations)
}
