import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { LineupEntry } from '../lineup.entity'
import type { ILineupRepository } from '../lineup.repository'

export interface GetLineupInput {
  matchId: string
  teamId?: string
}

export async function getLineup(
  repo: ILineupRepository,
  input: GetLineupInput,
): Promise<Result<LineupEntry[]>> {
  const entries = await repo.listByMatch(input.matchId, input.teamId)
  return ok(entries)
}
