import { ApiResponses } from '@/shared/openapi/responses'
import { StandingEntrySchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const getStandingsDetail = {
  summary: 'Get tournament standings',
  description: 'Returns the current standings for a tournament or group, ordered by position.',
  responses: {
    200: ApiResponses.list(StandingEntrySchema, 'Tournament standings'),
    404: ApiResponses.notFound('Tournament not found'),
  },
}

export const recalculateStandingsDetail = {
  summary: 'Recalculate standings',
  description:
    'Triggers a full standings rebuild from all finished/walkover matches. Called automatically on match finish; use this endpoint to correct inconsistencies.',
  security,
  responses: {
    200: ApiResponses.list(StandingEntrySchema, 'Recalculated standings'),
    404: ApiResponses.notFound('Tournament not found'),
  },
}
