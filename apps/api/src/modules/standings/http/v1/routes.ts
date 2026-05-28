import { Type } from '@sinclair/typebox'
import { and, eq, isNull } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { db } from '@/shared/db/client'
import { standingEntries, standings, teams } from '@/shared/db/schemas'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { recalculateStandings } from '../../use-cases/recalculate-standings.use-case'
import { getGroupStandingsDetail, getStandingsDetail, recalculateStandingsDetail } from './docs'

type RawEntry = typeof standingEntries.$inferSelect
type RawTeam = typeof teams.$inferSelect

function enrichEntries(entries: RawEntry[], teamMap: Map<string, RawTeam>) {
  return entries.map((e) => {
    const team = teamMap.get(e.team_id)
    return {
      id: e.id,
      standing_id: e.standing_id,
      team_id: e.team_id,
      team_name: team?.name ?? '',
      team_logo_url: team?.logo_url ?? null,
      position: e.position,
      played: e.played,
      won: e.won,
      drawn: e.drawn,
      lost: e.lost,
      goals_for: e.goals_for,
      goals_against: e.goals_against,
      goal_difference: e.goal_difference,
      points: e.points,
    }
  })
}

async function loadEnrichedEntries(standingId: string) {
  const entries = await db
    .select()
    .from(standingEntries)
    .where(eq(standingEntries.standing_id, standingId))
    .orderBy(standingEntries.position)

  if (entries.length === 0) return []

  const teamIds = entries.map((e) => e.team_id)
  const allTeams = await Promise.all(
    teamIds.map((id) => db.select().from(teams).where(eq(teams.id, id)).limit(1)),
  )
  const teamMap = new Map<string, RawTeam>()
  for (const rows of allTeams) {
    if (rows[0]) teamMap.set(rows[0].id, rows[0])
  }

  return enrichEntries(entries, teamMap)
}

export const standingsV1Routes = new Elysia({ tags: ['Standings'] })
  .get(
    '/tournaments/:tournamentId/standings',
    async (ctx) => {
      const groupId = (ctx.query as Record<string, string | undefined>).group_id ?? null

      const conditions = groupId
        ? [eq(standings.tournament_id, ctx.params.tournamentId), eq(standings.group_id, groupId)]
        : [eq(standings.tournament_id, ctx.params.tournamentId), isNull(standings.group_id)]

      const [standing] = await db
        .select()
        .from(standings)
        .where(and(...conditions))
        .limit(1)

      if (!standing) return toApiResponse(ctx, { ok: true as const, value: [] })

      const enriched = await loadEnrichedEntries(standing.id)
      return toApiResponse(ctx, { ok: true as const, value: enriched })
    },
    {
      params: Type.Object({ tournamentId: Type.String({ format: 'uuid' }) }),
      detail: getStandingsDetail,
    },
  )
  .get(
    '/tournaments/:tournamentId/standings/groups/:groupId',
    async (ctx) => {
      const [standing] = await db
        .select()
        .from(standings)
        .where(
          and(
            eq(standings.tournament_id, ctx.params.tournamentId),
            eq(standings.group_id, ctx.params.groupId),
          ),
        )
        .limit(1)

      if (!standing) return toApiResponse(ctx, { ok: true as const, value: [] })

      const enriched = await loadEnrichedEntries(standing.id)
      return toApiResponse(ctx, { ok: true as const, value: enriched })
    },
    {
      params: Type.Object({
        tournamentId: Type.String({ format: 'uuid' }),
        groupId: Type.String({ format: 'uuid' }),
      }),
      detail: getGroupStandingsDetail,
    },
  )
  .post(
    '/tournaments/:tournamentId/standings/recalculate',
    async (ctx) => {
      const groupId = (ctx.query as Record<string, string | undefined>).group_id ?? null
      const result = await recalculateStandings({
        tournamentId: ctx.params.tournamentId,
        groupId,
      })
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('admin')],
      params: Type.Object({ tournamentId: Type.String({ format: 'uuid' }) }),
      detail: recalculateStandingsDetail,
    },
  )
