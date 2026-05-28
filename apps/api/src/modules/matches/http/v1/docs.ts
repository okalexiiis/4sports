import { Type } from '@sinclair/typebox'
import { ApiResponses } from '@/shared/openapi/responses'
import { MatchSchema } from './schemas'

const FinishMatchResultSchema = Type.Object({
  match: MatchSchema,
  standingsUpdated: Type.Boolean(),
})

const security = [{ cookieAuth: [] }]

export const createMatchDetail = {
  summary: 'Create match',
  description: 'Creates a scheduled match within a tournament. Requires organizer role.',
  security,
  responses: {
    201: ApiResponses.success(MatchSchema, 'Match created'),
    400: ApiResponses.error('Invalid input'),
    404: ApiResponses.notFound('Tournament not found'),
  },
}

export const listMatchesDetail = {
  summary: 'List tournament matches',
  description: 'Returns all matches for a tournament. Filterable by status, round and team.',
  security,
  responses: {
    200: ApiResponses.list(MatchSchema, 'Tournament matches'),
  },
}

export const getMatchDetail = {
  summary: 'Get match detail',
  description: 'Returns full match details. Publicly accessible if the tournament is public.',
  responses: {
    200: ApiResponses.success(MatchSchema, 'Match detail'),
    404: ApiResponses.notFound('Match not found'),
  },
}

export const updateMatchDetail = {
  summary: 'Update match',
  description: 'Updates date, venue or notes. Only allowed when match status is scheduled.',
  security,
  responses: {
    200: ApiResponses.success(MatchSchema, 'Match updated'),
    400: ApiResponses.error('Match is not editable in its current status'),
    404: ApiResponses.notFound('Match not found'),
  },
}

export const deleteMatchDetail = {
  summary: 'Cancel match',
  description: 'Cancels a match. Only allowed when status is scheduled or postponed.',
  security,
  responses: {
    204: { description: 'Match cancelled' },
    400: ApiResponses.error('Match cannot be cancelled in its current status'),
    404: ApiResponses.notFound('Match not found'),
  },
}

export const finishMatchDetail = {
  summary: 'Finish match',
  description:
    'Closes a live match in a single transaction: calculates score from goal events, determines winner, updates standings, confirms draft suspensions, and advances bracket. Requires organizer role.',
  security,
  responses: {
    200: ApiResponses.success(FinishMatchResultSchema, 'Match closed'),
    400: ApiResponses.error('Match is not live'),
    404: ApiResponses.notFound('Match not found'),
  },
}

export const transitionStatusDetail = {
  summary: 'Transition match status',
  description:
    'Advances the match through its state machine. Walkover requires tournament.settings.walkover_score.',
  security,
  responses: {
    200: ApiResponses.success(MatchSchema, 'Match status updated'),
    400: ApiResponses.error('Invalid status transition'),
    404: ApiResponses.notFound('Match not found'),
  },
}
