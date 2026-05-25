import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { OrgErrors } from '../errors'
import type { CreatedOrg, CreateOrgInput } from '../organization.entity'
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

async function resolveSlug(repo: IOrganizationRepository, base: string): Promise<string> {
  if (!(await repo.isSlugTaken(base))) return base

  for (let i = 2; i <= 20; i++) {
    const candidate = `${base}-${i}`
    if (!(await repo.isSlugTaken(candidate))) return candidate
  }

  return `${base}-${Date.now()}`
}

export async function createOrganization(
  repo: IOrganizationRepository,
  input: { userId: string; data: CreateOrgInput },
): Promise<Result<CreatedOrg>> {
  const hasProfile = await repo.hasProfile(input.userId)
  if (!hasProfile) {
    return err(OrgErrors.profileNotFound())
  }

  const baseSlug = input.data.slug || slugify(input.data.name)
  const slugTaken = await repo.isSlugTaken(baseSlug)
  if (slugTaken) {
    const resolvedSlug = await resolveSlug(repo, baseSlug)
    input.data.slug = resolvedSlug
  } else {
    input.data.slug = baseSlug
  }

  const plan = await repo.findPlanBySlug(input.data.plan)
  if (!plan) {
    return err(OrgErrors.planNotFound())
  }

  const org = await repo.createOrg(input.userId, input.data, plan.id)
  return ok(org)
}
