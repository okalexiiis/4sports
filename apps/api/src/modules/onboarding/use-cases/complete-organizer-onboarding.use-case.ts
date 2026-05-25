import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OnboardingErrors } from '../errors'
import type { OrgCreated, OrgOnboardingInput } from '../onboarding.entity'
import type { IOnboardingRepository } from '../onboarding.repository'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

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

export async function completeOrganizerOnboarding(
  repo: IOnboardingRepository,
  input: { userId: string; data: OrgOnboardingInput },
): Promise<Result<OrgCreated>> {
  const alreadyExists = await repo.existsProfile(input.userId)
  if (alreadyExists) {
    return err(OnboardingErrors.alreadyComplete())
  }

  const usernameTaken = await repo.isUsernameTaken(input.data.profile.username)
  if (usernameTaken) {
    const suggestions = await buildUsernameSuggestions(repo, input.data.profile.username)
    return err(OnboardingErrors.usernameTaken(suggestions))
  }

  const resolvedSlug = input.data.organization.slug || slugify(input.data.organization.name)
  const slugTaken = await repo.isSlugTaken(resolvedSlug)
  if (slugTaken) {
    const suggestions = await buildSlugSuggestions(repo, resolvedSlug)
    return err(OnboardingErrors.slugTaken(suggestions))
  }

  const planId = await repo.findPlanIdBySlug(input.data.plan)
  if (!planId) {
    return err(OnboardingErrors.planNotFound())
  }

  const dataWithSlug: OrgOnboardingInput = {
    ...input.data,
    organization: { ...input.data.organization, slug: resolvedSlug },
  }

  const result = await repo.createOrgWithOwner(input.userId, dataWithSlug, planId)
  return ok(result)
}
