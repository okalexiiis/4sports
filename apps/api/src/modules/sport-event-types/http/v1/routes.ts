import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { DrizzleSportEventTypeRepository } from '../../drizzle-sport-event-type.repository'
import { listSportEventTypes } from '../../use-cases/list-sport-event-types.use-case'
import { listSportEventTypesDetail } from './docs'

const repo = new DrizzleSportEventTypeRepository()

export const sportEventTypesV1Routes = new Elysia({ tags: ['Sport Event Types'] }).get(
  '/tournaments/:tournamentId/event-types',
  async (ctx) => {
    const result = await listSportEventTypes(repo, ctx.params.tournamentId)
    return toApiResponse(ctx, result)
  },
  { detail: listSportEventTypesDetail },
)
