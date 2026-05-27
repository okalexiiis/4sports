import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { TournamentErrors } from '../errors'
import type { Tournament } from '../tournament.entity'
import type { ITournamentRepository } from '../tournament.repository'

export async function getTournament(
  repo: ITournamentRepository,
  input: {
    tournamentId: string
    actorOrgId?: string
  },
): Promise<Result<Tournament>> {
  const tournament = await repo.findById(input.tournamentId)
  if (!tournament) {
    return err(TournamentErrors.notFound(input.tournamentId))
  }

  const isOrganizer = input.actorOrgId && tournament.organization_id === input.actorOrgId

  if (!isOrganizer && (!tournament.is_public || tournament.status === 'draft')) {
    return err(TournamentErrors.notFound(input.tournamentId))
  }

  return ok(tournament)
}
