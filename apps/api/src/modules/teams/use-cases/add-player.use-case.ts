import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { TeamErrors } from '../errors'
import type {
  AddGuestPlayerInput,
  InviteUserInput,
  TeamInvitation,
  TeamMember,
} from '../team.entity'
import type { ITeamRepository } from '../team.repository'

export async function addGuestPlayer(
  repo: ITeamRepository,
  input: {
    teamId: string
    actorUserId: string
    data: AddGuestPlayerInput
  },
): Promise<Result<TeamMember>> {
  const team = await repo.findById(input.teamId)
  if (!team) {
    return err(TeamErrors.notFound(input.teamId))
  }

  const isCaptain = await repo.isCaptain(input.teamId, input.actorUserId)
  if (!isCaptain) {
    return err(TeamErrors.forbidden())
  }

  const member = await repo.addGuestPlayer(input.teamId, input.data, input.actorUserId)
  return ok(member)
}

export async function inviteUser(
  repo: ITeamRepository,
  input: {
    teamId: string
    actorUserId: string
    data: InviteUserInput
  },
): Promise<Result<TeamInvitation>> {
  const team = await repo.findById(input.teamId)
  if (!team) {
    return err(TeamErrors.notFound(input.teamId))
  }

  const isCaptain = await repo.isCaptain(input.teamId, input.actorUserId)
  if (!isCaptain) {
    return err(TeamErrors.forbidden())
  }

  const invitation = await repo.inviteUser(input.teamId, input.data, input.actorUserId)
  return ok(invitation)
}
