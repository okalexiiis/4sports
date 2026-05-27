import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { TournamentErrors } from '../errors'
import type { Tournament } from '../tournament.entity'
import type { ITournamentRepository } from '../tournament.repository'

const PLAN_RANK: Record<string, number> = { free: 0, starter: 1, pro: 2, elite: 3 }

export async function publishTournament(
  repo: ITournamentRepository,
  input: {
    tournamentId: string
    actorOrgId: string
    visibility: 'public' | 'private'
  },
): Promise<Result<Tournament>> {
  const tournament = await repo.findById(input.tournamentId)
  if (!tournament) {
    return err(TournamentErrors.notFound(input.tournamentId))
  }

  if (tournament.organization_id !== input.actorOrgId) {
    return err(TournamentErrors.forbidden())
  }

  if (tournament.status !== 'draft') {
    return err(TournamentErrors.notDraft())
  }

  const orgContext = await repo.findOrgPlanContext(input.actorOrgId)
  if (!orgContext) {
    return err(TournamentErrors.forbidden())
  }

  const failures: { field: string; message: string }[] = []

  if (!tournament.format) {
    failures.push({ field: 'format_id', message: 'Se requiere seleccionar un formato' })
  }

  if (!tournament.sport) {
    failures.push({ field: 'sport_id', message: 'Se requiere seleccionar un deporte' })
  }

  const tiebreakers = (tournament.settings?.tiebreaker as string[] | undefined) ?? []
  if (tiebreakers.length === 0) {
    failures.push({
      field: 'settings.tiebreaker',
      message: 'Se requiere al menos un criterio de desempate',
    })
  }

  if (tournament.format) {
    const orgRank = PLAN_RANK[orgContext.planSlug] ?? 0
    const requiredRank = PLAN_RANK[tournament.format.plan_required] ?? 0
    if (orgRank < requiredRank) {
      failures.push({
        field: 'format_id',
        message: `El formato requiere el plan ${tournament.format.plan_required} o superior`,
      })
    }
  }

  const maxActive = orgContext.planFeatures.max_active_tournaments as number | null
  if (maxActive !== null) {
    const activeCount = await repo.countActiveByOrg(input.actorOrgId)
    if (activeCount >= maxActive) {
      failures.push({
        field: 'status',
        message: `Tu plan permite un máximo de ${maxActive} torneos activos`,
      })
    }
  }

  if (failures.length > 0) {
    return err(TournamentErrors.publishValidation(failures))
  }

  const published = await repo.publish(input.tournamentId, {
    visibility: input.visibility,
    planSlug: orgContext.planSlug,
    sportMetadata: tournament.sport ? (tournament.settings ?? {}) : undefined,
  })

  return ok(published)
}
