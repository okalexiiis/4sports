import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { SportErrors } from '../errors/index'
import type { Sport } from '../sports.entity'
import type { ISportsRepository } from '../sports.repository'

export async function getSport(repo: ISportsRepository, id: string): Promise<Result<Sport>> {
  const sport = await repo.findById(id)
  if (!sport) return err(SportErrors.notFound(id))
  return ok(sport)
}
