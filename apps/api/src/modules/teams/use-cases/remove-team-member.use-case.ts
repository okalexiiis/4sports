import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { TeamErrors } from '../errors'
import type { ITeamRepository } from '../team.repository'

export async function removeTeamMember(
  repo: ITeamRepository,
  input: {
    teamId: string
    memberId: string
    actorUserId: string
  },
): Promise<Result<void>> {
  const team = await repo.findById(input.teamId)
  if (!team) {
    return err(TeamErrors.notFound(input.teamId))
  }

  const isCaptain = await repo.isCaptain(input.teamId, input.actorUserId)
  if (!isCaptain) {
    return err(TeamErrors.forbidden())
  }

  const members = await repo.listMembers(input.teamId)
  const target = members.find((m) => m.id === input.memberId)
  if (!target) {
    return err(TeamErrors.memberNotFound(input.memberId))
  }

  if (target.role === 'captain') {
    const captainCount = await repo.captainCount(input.teamId)
    if (captainCount <= 1) {
      return err(TeamErrors.lastCaptain())
    }
  }

  await repo.removeMember(input.teamId, input.memberId)
  return ok(undefined)
}
