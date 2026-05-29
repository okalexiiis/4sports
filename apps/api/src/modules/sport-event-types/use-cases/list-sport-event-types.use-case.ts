import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { SportEventType } from '../sport-event-type.entity'
import type { ISportEventTypeRepository } from '../sport-event-type.repository'

export async function listSportEventTypes(
  repo: ISportEventTypeRepository,
  tournamentId: string,
): Promise<Result<SportEventType[]>> {
  const types = await repo.listByTournament(tournamentId)
  return ok(types)
}
