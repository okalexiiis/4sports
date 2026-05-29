import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { MatchEvent } from '../match-event.entity'
import type { IMatchEventRepository } from '../match-event.repository'

export async function listMatchEvents(
  repo: IMatchEventRepository,
  matchId: string,
): Promise<Result<MatchEvent[]>> {
  const events = await repo.listByMatch(matchId)
  return ok(events)
}
