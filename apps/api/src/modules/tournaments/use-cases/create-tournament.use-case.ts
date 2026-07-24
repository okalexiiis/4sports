import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import type { ITournamentFormatRepository } from '@/modules/tournament-formats/tournament-format.repository'
import { TournamentErrors } from '../errors'
import type { Tournament } from '../tournament.entity'
import type { ITournamentRepository } from '../tournament.repository'

const PLAN_RANK: Record<string, number> = { free: 0, starter: 1, pro: 2, elite: 3 }

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

async function resolveSlug(
  repo: ITournamentRepository,
  base: string,
  orgId: string,
): Promise<string> {
  const taken = await repo.isSlugTaken(base, orgId)
  if (!taken) return base

  for (let i = 2; i <= 20; i++) {
    const candidate = `${base}-${i}`
    if (!(await repo.isSlugTaken(candidate, orgId))) return candidate
  }

  return `${base}-${Date.now()}`
}

export async function createTournament(
  repo: ITournamentRepository,
  formatRepo: ITournamentFormatRepository,
  input: {
    userId: string
    orgId: string
    name: string
    slug?: string
    description?: string | null
    banner_url?: string | null
    sport_id?: string | null
    format_id?: string | null
    tags?: string[]
    settings?: Record<string, unknown>
    player_fields?: Record<string, unknown>
    max_teams?: number | null
    min_teams?: number | null
    min_players_per_team?: number | null
    max_players_per_team?: number | null
    is_public?: boolean
    requires_approval?: boolean
    gender_restriction?: string
    validation_mode?: string
    eligibility_mode?: string
    starts_at?: string | null
    ends_at?: string | null
    registration_opens_at?: string | null
    registration_closes_at?: string | null
  },
): Promise<Result<Tournament>> {
  const orgContext = await repo.findOrgPlanContext(input.orgId)
  if (!orgContext) {
    return err(TournamentErrors.forbidden())
  }

  const maxActive = orgContext.planFeatures.max_active_tournaments as number | null
  if (maxActive !== null) {
    const activeCount = await repo.countActiveByOrg(input.orgId)
    if (activeCount >= maxActive) {
      return err(TournamentErrors.limitExceeded(maxActive))
    }
  }

  if (input.format_id) {
    const format = await formatRepo.findById(input.format_id)
    if (format) {
      const orgRank = PLAN_RANK[orgContext.planSlug] ?? 0
      const requiredRank = PLAN_RANK[format.plan_required] ?? 0
      if (orgRank < requiredRank) {
        return err(TournamentErrors.formatNotAvailable(format.name, format.plan_required))
      }
    }
  }

  const baseSlug = input.slug ? slugify(input.slug) : slugify(input.name)
  const slug = await resolveSlug(repo, baseSlug, input.orgId)

  const tournament = await repo.create(input.userId, input.orgId, {
    name: input.name,
    slug,
    description: input.description,
    banner_url: input.banner_url,
    sport_id: input.sport_id,
    format_id: input.format_id,
    tags: input.tags,
    settings: input.settings,
    player_fields: input.player_fields,
    max_teams: input.max_teams,
    min_teams: input.min_teams,
    min_players_per_team: input.min_players_per_team,
    max_players_per_team: input.max_players_per_team,
    is_public: input.is_public,
    requires_approval: input.requires_approval,
    gender_restriction: input.gender_restriction,
    validation_mode: input.validation_mode,
    eligibility_mode: input.eligibility_mode,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
    registration_opens_at: input.registration_opens_at,
    registration_closes_at: input.registration_closes_at,
  })

  return ok(tournament)
}
