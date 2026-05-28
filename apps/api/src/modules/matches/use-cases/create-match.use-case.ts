import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { MatchErrors } from '../errors'
import type { CreateMatchInput, Match } from '../match.entity'
import type { IMatchRepository } from '../match.repository'

export async function createMatch(
  repo: IMatchRepository,
  input: CreateMatchInput,
): Promise<Result<Match>> {
  if (input.home_team_id === input.away_team_id) {
    return err(MatchErrors.invalidTeams())
  }

  const match = await repo.create(input)
  return ok(match)
}
