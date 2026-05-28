import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { Convocatoria } from '../convocatoria.entity'
import type { IConvocatoriaRepository } from '../convocatoria.repository'

export async function listConvocatorias(
  repo: IConvocatoriaRepository,
  matchId: string,
): Promise<Result<Convocatoria[]>> {
  const convocatorias = await repo.listByMatch(matchId)
  return ok(convocatorias)
}
