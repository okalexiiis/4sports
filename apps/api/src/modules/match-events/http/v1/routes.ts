import { Elysia } from 'elysia'
import { DrizzleMatchRepository } from '@/modules/matches/drizzle-match.repository'
import { toApiResponse } from '@/shared/api-response'
import { publishToMatch } from '@/shared/lib/match-publisher'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { matchCaptureGuard } from '@/shared/middleware/match-capture.guard'
import { DrizzleMatchEventRepository } from '../../drizzle-match-event.repository'
import { deleteMatchEvent } from '../../use-cases/delete-match-event.use-case'
import { listMatchEvents } from '../../use-cases/list-match-events.use-case'
import { registerMatchEvent } from '../../use-cases/register-match-event.use-case'
import { deleteEventDetail, listEventsDetail, registerEventDetail } from './docs'
import { RegisterEventBodySchema } from './schemas'

const matchRepo = new DrizzleMatchRepository()
const eventRepo = new DrizzleMatchEventRepository()

type CaptureStore = { actorId: string }

export const matchEventsV1Routes = new Elysia({ tags: ['Match Events'] })
  .post(
    '/matches/:matchId/events',
    async (ctx) => {
      const { actorId } = ctx.store as CaptureStore
      const result = await registerMatchEvent(matchRepo, eventRepo, {
        matchId: ctx.params.matchId,
        eventTypeId: ctx.body.event_type_id,
        playerId: ctx.body.player_id,
        teamId: ctx.body.team_id,
        minute: ctx.body.minute,
        periodIndex: ctx.body.period_index,
        actorId,
      })
      if (result.ok) {
        ctx.set.status = 201
        await publishToMatch(ctx.params.matchId, {
          type: 'match:event',
          payload: {
            id: result.value.id,
            event_type_id: result.value.event_type_id,
            player_id: result.value.player_id,
            team_id: result.value.team_id,
            minute: result.value.minute,
            period_index: result.value.period_index,
          },
        })
      }
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [matchCaptureGuard],
      body: RegisterEventBodySchema,
      detail: registerEventDetail,
    },
  )
  .delete(
    '/matches/:matchId/events/:eventId',
    async (ctx) => {
      const result = await deleteMatchEvent(matchRepo, eventRepo, {
        matchId: ctx.params.matchId,
        eventId: ctx.params.eventId,
      })
      if (!result.ok) return toApiResponse(ctx, result)
      ctx.set.status = 204
      return
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      detail: deleteEventDetail,
    },
  )
  .get(
    '/matches/:matchId/events',
    async (ctx) => {
      const result = await listMatchEvents(eventRepo, ctx.params.matchId)
      return toApiResponse(ctx, result)
    },
    { detail: listEventsDetail },
  )
