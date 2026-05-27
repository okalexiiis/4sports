import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { TeamErrors } from '../errors'
import type { TeamMember } from '../team.entity'
import type { ITeamRepository } from '../team.repository'

export async function listTeamMembers(
  repo: ITeamRepository,
  input: { teamId: string },
): Promise<Result<TeamMember[]>> {
  const team = await repo.findById(input.teamId)
  if (!team) {
    return err(TeamErrors.notFound(input.teamId))
  }

  const members = await repo.listMembers(input.teamId)
  return ok(members)
}
