import { ApiResponses } from '@/shared/openapi/responses'
import { LineupEntrySchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const publishLineupDetail = {
  summary: 'Publish lineup',
  description:
    'Publishes (or replaces) the lineup for a team in this match. All previous entries for that team are deleted and replaced atomically. Requires organizer role.',
  security,
  responses: {
    200: ApiResponses.list(LineupEntrySchema, 'Published lineup'),
    401: ApiResponses.unauthorized(),
    404: ApiResponses.notFound('Match not found'),
    422: ApiResponses.error('Match already ended or team not in match'),
  },
}

export const getLineupDetail = {
  summary: 'Get lineup',
  description:
    "Returns the lineup for a match. Filter by team_id to get only one team's lineup. Publicly accessible.",
  responses: {
    200: ApiResponses.list(LineupEntrySchema, 'Lineup entries'),
  },
}
