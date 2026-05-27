import { ApiResponses } from '@/shared/openapi/responses'
import { TournamentSchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const createTournamentDetail = {
  summary: 'Create tournament draft',
  description: 'Creates a new tournament in draft status. Requires organizer role in the org.',
  security,
  responses: {
    201: ApiResponses.success(TournamentSchema, 'Tournament created'),
    403: ApiResponses.forbidden('Subscription required or limit exceeded'),
    422: ApiResponses.validation('Validation error'),
  },
}

export const updateTournamentDetail = {
  summary: 'Update tournament draft',
  description: 'Updates a tournament. Only allowed while status is draft.',
  security,
  responses: {
    200: ApiResponses.success(TournamentSchema, 'Tournament updated'),
    403: ApiResponses.forbidden('Forbidden'),
    404: ApiResponses.notFound('Tournament not found'),
    422: ApiResponses.validation('Not in draft status'),
  },
}

export const publishTournamentDetail = {
  summary: 'Publish tournament',
  description:
    'Publishes a draft tournament. Validates format, sport, tiebreakers, and plan limits before publishing.',
  security,
  responses: {
    200: ApiResponses.success(TournamentSchema, 'Tournament published'),
    403: ApiResponses.forbidden('Forbidden'),
    404: ApiResponses.notFound('Tournament not found'),
    422: ApiResponses.validation('Publish validation failures'),
  },
}

export const getTournamentDetail = {
  summary: 'Get tournament by ID',
  description:
    'Returns a tournament. Organizers of the owning org see the full config including draft. Public users only see public open/active tournaments.',
  responses: {
    200: ApiResponses.success(TournamentSchema, 'Tournament found'),
    404: ApiResponses.notFound('Tournament not found'),
  },
}

export const listOrgTournamentsDetail = {
  summary: 'List org tournaments',
  description: 'Returns paginated tournaments for an organization. Requires viewer role or above.',
  security,
  responses: {
    200: ApiResponses.paginated(TournamentSchema, 'Tournaments list'),
    403: ApiResponses.forbidden('Forbidden'),
  },
}

export const listPublicTournamentsDetail = {
  summary: 'List public tournaments',
  description:
    'Returns paginated public tournaments in open_registration or active status. No auth required.',
  responses: {
    200: ApiResponses.paginated(TournamentSchema, 'Public tournaments'),
  },
}
