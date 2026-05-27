import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OnboardingErrors } from '../errors'
import type { PlayerOnboardingInput, PlayerProfile } from '../onboarding.entity'
import type { IOnboardingRepository } from '../onboarding.repository'

async function buildUsernameSuggestions(
  repo: IOnboardingRepository,
  base: string,
): Promise<string[]> {
  const candidates = [`${base}_2`, `${base}_mx`, `${base}99`, `${base}123`, `${base}_pro`]
  const results: string[] = []

  for (const candidate of candidates) {
    if (results.length === 3) break
    const taken = await repo.isUsernameTaken(candidate)
    if (!taken) results.push(candidate)
  }

  return results
}

export async function completePlayerOnboarding(
  repo: IOnboardingRepository,
  input: { userId: string; data: PlayerOnboardingInput },
): Promise<Result<PlayerProfile>> {
  const alreadyExists = await repo.existsProfile(input.userId)
  if (alreadyExists) {
    return err(OnboardingErrors.alreadyComplete())
  }

  const usernameTaken = await repo.isUsernameTaken(input.data.username)
  if (usernameTaken) {
    const suggestions = await buildUsernameSuggestions(repo, input.data.username)
    return err(OnboardingErrors.usernameTaken(suggestions))
  }

  const profile = await repo.createPlayerProfile(input.userId, input.data)
  return ok(profile)
}
