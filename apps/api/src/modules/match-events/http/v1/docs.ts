import { ApiResponses } from '@/shared/openapi/responses'
import { MatchEventSchema } from './schemas'

const security: Array<Record<string, string[]>> = [{ cookieAuth: [] }, { bearerAuth: [] }]

export const registerEventDetail = {
  summary: 'Register match event',
  description:
    'Records a live match event (goal, card, etc.). Accepts either an organizer session or the match referee_session_token as a Bearer token.',
  security,
  responses: {
    201: ApiResponses.success(MatchEventSchema, 'Event registered'),
    400: ApiResponses.error('Match not live or player already ejected'),
    401: ApiResponses.unauthorized(),
    404: ApiResponses.notFound('Match or event type not found'),
  },
}

export const deleteEventDetail = {
  summary: 'Delete match event',
  description:
    'Removes a live match event and its draft suspension if it was an ejection. Requires organizer role.',
  security: [{ cookieAuth: [] }],
  responses: {
    204: { description: 'Event deleted' },
    400: ApiResponses.error('Match not live'),
    401: ApiResponses.unauthorized(),
    404: ApiResponses.notFound('Event not found'),
  },
}

export const listEventsDetail = {
  summary: 'List match events',
  description: 'Returns all events for a match in chronological order. Publicly accessible.',
  responses: {
    200: ApiResponses.list(MatchEventSchema, 'Match events'),
  },
}
