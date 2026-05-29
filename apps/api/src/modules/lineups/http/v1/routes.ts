import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { publishToMatch } from '@/shared/lib/match-publisher'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleLineupRepository } from '../../drizzle-lineup.repository'
import { getLineup } from '../../use-cases/get-lineup.use-case'
import { publishLineup } from '../../use-cases/publish-lineup.use-case'
import { getLineupDetail, publishLineupDetail } from './docs'
import { GetLineupQuerySchema, PublishLineupBodySchema } from './schemas'

const repo = new DrizzleLineupRepository()

export const lineupsV1Routes = new Elysia({ tags: ['Lineups'] })
  .put(
    '/matches/:matchId/lineup',
    async (ctx) => {
      const result = await publishLineup(repo, {
        matchId: ctx.params.matchId,
        teamId: ctx.body.team_id,
        players: ctx.body.players,
      })
      if (result.ok) {
        await publishToMatch(ctx.params.matchId, {
          type: 'match:lineup',
          payload: { team_id: ctx.body.team_id, lineup: result.value },
        })
      }
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      body: PublishLineupBodySchema,
      detail: publishLineupDetail,
    },
  )
  .get(
    '/matches/:matchId/lineup',
    async (ctx) => {
      const result = await getLineup(repo, {
        matchId: ctx.params.matchId,
        teamId: ctx.query.team_id,
      })
      return toApiResponse(ctx, result)
    },
    {
      query: GetLineupQuerySchema,
      detail: getLineupDetail,
    },
  )
