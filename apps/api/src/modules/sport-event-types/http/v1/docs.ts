import { ApiResponses } from '@/shared/openapi/responses'
import { SportEventTypeSchema } from './schemas'

export const listSportEventTypesDetail = {
  summary: 'List tournament event types',
  description:
    'Returns all sport event types configured for a tournament, ordered by name. Used by the live capture panel to build the event action menu.',
  responses: {
    200: ApiResponses.list(SportEventTypeSchema, 'Tournament event types'),
    404: ApiResponses.notFound('Tournament not found'),
  },
}
