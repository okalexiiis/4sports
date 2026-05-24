import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import { redis } from '@/shared/db/redis'
import type { ActiveContext, MeData, UserIdentity } from '../auth.entity'
import type { IAuthRepository } from '../auth.repository'

export async function getMe(
  repo: IAuthRepository,
  input: { userId: string; user: UserIdentity },
): Promise<Result<MeData>> {
  const [profile, organizations] = await Promise.all([
    repo.findProfile(input.userId),
    repo.findMemberships(input.userId),
  ])

  const redisKey = `context:${input.userId}`
  let active_context: ActiveContext | null = null

  const cached = await redis.get(redisKey)
  if (cached) {
    active_context = JSON.parse(cached) as ActiveContext
  } else if (organizations.length === 1 && organizations[0]) {
    active_context = { organization_id: organizations[0].id, role: organizations[0].role }
    await redis.set(redisKey, JSON.stringify(active_context))
  }

  return ok({
    user: input.user,
    profile,
    organizations,
    active_context,
    onboarding_pending: profile === null,
  })
}
