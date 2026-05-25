import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { SlugCheckResult } from '../onboarding.entity'
import type { IOnboardingRepository } from '../onboarding.repository'

async function buildSlugSuggestions(repo: IOnboardingRepository, base: string): Promise<string[]> {
  const results: string[] = []
  let i = 2

  while (results.length < 3 && i <= 20) {
    const candidate = `${base}-${i}`
    const taken = await repo.isSlugTaken(candidate)
    if (!taken) results.push(candidate)
    i++
  }

  return results
}

export async function checkSlug(
  repo: IOnboardingRepository,
  input: { slug: string },
): Promise<Result<SlugCheckResult>> {
  const taken = await repo.isSlugTaken(input.slug)

  if (!taken) {
    return ok({ available: true, suggestions: [] })
  }

  const suggestions = await buildSlugSuggestions(repo, input.slug)
  return ok({ available: false, suggestions })
}
