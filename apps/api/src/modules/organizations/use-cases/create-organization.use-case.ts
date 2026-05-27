import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import type { OrgWithRole } from '../organization.entity'
import type { IOrganizationRepository } from '../organization.repository'

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

async function buildSlugSuggestions(
  repo: IOrganizationRepository,
  base: string,
): Promise<string[]> {
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

export async function createOrganization(
  repo: IOrganizationRepository,
  input: {
    userId: string
    name: string
    slug?: string
    description?: string
    city?: string
    country_code?: string
    plan: string
  },
): Promise<Result<OrgWithRole>> {
  const resolvedSlug = input.slug || slugify(input.name)

  const slugTaken = await repo.isSlugTaken(resolvedSlug)
  if (slugTaken) {
    const suggestions = await buildSlugSuggestions(repo, resolvedSlug)
    return err(
      new DomainError('ORG_CONFLICT_SLUG_TAKEN', 'This slug is already in use', { suggestions }),
    )
  }

  const planId = await repo.findPlanIdBySlug(input.plan)
  if (!planId) {
    return err(new DomainError('ORG_NOT_FOUND_PLAN', 'Plan not found'))
  }

  const org = await repo.createOrganization(
    input.userId,
    {
      name: input.name,
      slug: resolvedSlug,
      description: input.description,
      city: input.city,
      country_code: input.country_code,
      plan: input.plan,
    },
    planId,
  )

  return ok(org)
}
