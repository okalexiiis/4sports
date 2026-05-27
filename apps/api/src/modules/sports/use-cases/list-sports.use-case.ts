import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { Sport } from '../sports.entity'
import type { ISportsRepository } from '../sports.repository'

export async function listSports(repo: ISportsRepository): Promise<Result<Sport[]>> {
  return ok(await repo.listAll())
}
