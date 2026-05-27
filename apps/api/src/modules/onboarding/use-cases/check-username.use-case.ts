import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { UsernameCheckResult } from '../onboarding.entity'
import type { IOnboardingRepository } from '../onboarding.repository'

async function buildSuggestions(repo: IOnboardingRepository, base: string): Promise<string[]> {
  const candidates = [`${base}_2`, `${base}_mx`, `${base}99`, `${base}123`, `${base}_pro`]
  const results: string[] = []

  for (const candidate of candidates) {
    if (results.length === 3) break
    const taken = await repo.isUsernameTaken(candidate)
    if (!taken) results.push(candidate)
  }

  return results
}

export async function checkUsername(
  repo: IOnboardingRepository,
  input: { username: string },
): Promise<Result<UsernameCheckResult>> {
  const taken = await repo.isUsernameTaken(input.username)

  if (!taken) {
    return ok({ available: true, suggestions: [] })
  }

  const suggestions = await buildSuggestions(repo, input.username)
  return ok({ available: false, suggestions })
}
