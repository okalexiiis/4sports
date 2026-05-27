import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { CreateTeamInput, Team } from '../team.entity'
import type { ITeamRepository } from '../team.repository'

export async function createTeam(
  repo: ITeamRepository,
  input: {
    userId: string
    captainDisplayName: string
    data: CreateTeamInput
  },
): Promise<Result<Team>> {
  const team = await repo.create(input.userId, input.captainDisplayName, input.data)
  return ok(team)
}
