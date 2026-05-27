import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { TournamentFormat } from '../tournament-format.entity'
import type { ITournamentFormatRepository } from '../tournament-format.repository'

export async function listTournamentFormats(
  repo: ITournamentFormatRepository,
): Promise<Result<TournamentFormat[]>> {
  return ok(await repo.listAll())
}
