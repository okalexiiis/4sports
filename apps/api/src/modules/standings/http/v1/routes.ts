import { Type } from '@sinclair/typebox'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { db } from '@/shared/db/client'
import { standingEntries, standings } from '@/shared/db/schemas'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { recalculateStandings } from '../../use-cases/recalculate-standings.use-case'
import { getStandingsDetail, recalculateStandingsDetail } from './docs'

export const standingsV1Routes = new Elysia({ tags: ['Standings'] })
  .get(
    '/tournaments/:tournamentId/standings',
    async (ctx) => {
      const [standing] = await db
        .select()
        .from(standings)
        .where(eq(standings.tournament_id, ctx.params.tournamentId))
        .limit(1)

      if (!standing) {
        return toApiResponse(ctx, { ok: true as const, value: [] })
      }

      const entries = await db
        .select()
        .from(standingEntries)
        .where(eq(standingEntries.standing_id, standing.id))
        .orderBy(standingEntries.position)

      return toApiResponse(ctx, { ok: true as const, value: entries })
    },
    {
      params: Type.Object({ tournamentId: Type.String({ format: 'uuid' }) }),
      detail: getStandingsDetail,
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
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      params: Type.Object({ tournamentId: Type.String({ format: 'uuid' }) }),
      detail: recalculateStandingsDetail,
    },
  )
