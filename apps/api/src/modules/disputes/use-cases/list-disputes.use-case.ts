import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { Dispute } from '../dispute.entity'
import type { IDisputeRepository } from '../dispute.repository'

export async function listDisputes(
  repo: IDisputeRepository,
  matchId: string,
): Promise<Result<Dispute[]>> {
  const disputes = await repo.listByMatch(matchId)
  return ok(disputes)
}
