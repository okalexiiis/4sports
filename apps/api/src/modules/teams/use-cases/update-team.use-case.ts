import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import type { Team, UpdateTeamInput } from '../team.entity'
import type { ITeamRepository } from '../team.repository'

export async function updateTeam(
  repo: ITeamRepository,
  input: {
    teamId: string
    actorUserId: string
    data: UpdateTeamInput
  },
): Promise<Result<Team>> {
  const team = await repo.findById(input.teamId)
  if (!team) {
    return err(new DomainError('TEAM_NOT_FOUND', 'Equipo no encontrado'))
  }

  const isCaptain = await repo.isCaptain(input.teamId, input.actorUserId)
  if (!isCaptain) {
    return err(new DomainError('FORBIDDEN', 'Solo el capitán puede actualizar el equipo'))
  }

  const updated = await repo.update(input.teamId, input.data)
  return ok(updated)
}
