import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { TournamentErrors } from '../errors'
import type { Tournament, UpdateTournamentInput } from '../tournament.entity'
import type { ITournamentRepository } from '../tournament.repository'

export async function updateTournament(
  repo: ITournamentRepository,
  input: {
    tournamentId: string
    actorOrgId: string
    data: UpdateTournamentInput
  },
): Promise<Result<Tournament>> {
  const tournament = await repo.findById(input.tournamentId)
  if (!tournament) {
    return err(TournamentErrors.notFound(input.tournamentId))
  }

  if (tournament.organization_id !== input.actorOrgId) {
    return err(TournamentErrors.forbidden())
  }

  if (tournament.status !== 'draft') {
    return err(TournamentErrors.notDraft())
  }

  const updated = await repo.update(input.tournamentId, input.data)
  return ok(updated)
}
