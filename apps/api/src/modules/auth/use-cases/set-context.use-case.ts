import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { redis } from '@/shared/db/redis'
import type { ActiveContext } from '../auth.entity'
import type { IAuthRepository } from '../auth.repository'
import { AuthErrors } from '../errors'

export async function setContext(
  repo: IAuthRepository,
  input: { userId: string; organizationId: string | null },
): Promise<Result<ActiveContext | null>> {
  const redisKey = `context:${input.userId}`

  if (input.organizationId === null) {
    await redis.del(redisKey)
    return ok(null)
  }

  const membership = await repo.findMembership(input.userId, input.organizationId)

  if (membership === null) {
    // org might not exist or user is not a member — check which
    return err(AuthErrors.orgForbidden())
  }

  const context: ActiveContext = {
    organization_id: input.organizationId,
    role: membership.role,
  }
  await redis.set(redisKey, JSON.stringify(context))

  return ok(context)
}
