import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { MatchErrors } from '../errors'
import type { Match } from '../match.entity'
import type { IMatchRepository } from '../match.repository'

export async function getMatch(
  repo: IMatchRepository,
  input: { matchId: string },
): Promise<Result<Match>> {
  const match = await repo.findById(input.matchId)
  if (!match) {
    return err(MatchErrors.notFound(input.matchId))
  }
  return ok(match)
}
