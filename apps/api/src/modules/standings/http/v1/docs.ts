import { ApiResponses } from '@/shared/openapi/responses'
import { EnrichedStandingEntrySchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const getStandingsDetail = {
  summary: 'Get tournament standings',
  description:
    'Returns standings for a tournament ordered by position. Includes team name and logo. Filter by group_id for Modo Mundial group-phase standings.',
  responses: {
    200: ApiResponses.list(EnrichedStandingEntrySchema, 'Tournament standings'),
  },
}

export const getGroupStandingsDetail = {
  summary: 'Get group standings',
  description: 'Returns standings for a specific group in a tournament (Modo Mundial).',
  responses: {
    200: ApiResponses.list(EnrichedStandingEntrySchema, 'Group standings'),
  },
}

export const recalculateStandingsDetail = {
  summary: 'Recalculate standings',
  description:
    'Triggers a full standings rebuild from all finished/walkover matches. Runs automatically on match finish — use this endpoint only to correct inconsistencies. Requires admin role.',
  security,
  responses: {
    200: ApiResponses.list(EnrichedStandingEntrySchema, 'Recalculated standings'),
    404: ApiResponses.notFound('Tournament not found'),
  },
}
