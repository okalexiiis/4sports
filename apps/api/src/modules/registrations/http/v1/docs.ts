import { ApiResponses } from '@/shared/openapi/responses'
import { RegistrationSchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const registerTeamDetail = {
  summary: 'Register team for tournament',
  description:
    'Registers a team for an open tournament. Actor must be the team captain. Runs eligibility checks before registering.',
  security,
  responses: {
    201: ApiResponses.success(RegistrationSchema, 'Team registered'),
    403: ApiResponses.forbidden('Actor is not the team captain'),
    404: ApiResponses.notFound('Tournament or team not found'),
    409: ApiResponses.conflict('Team already registered'),
    422: ApiResponses.validation('Tournament not open, full, or eligibility blocked'),
  },
}

export const reviewRegistrationDetail = {
  summary: 'Review registration',
  description:
    'Approve, reject, or waitlist a pending registration. Organizer only. Generates fee invoices on approval.',
  security,
  responses: {
    200: ApiResponses.success(RegistrationSchema, 'Registration reviewed'),
    403: ApiResponses.forbidden('Actor is not an organizer of this tournament'),
    404: ApiResponses.notFound('Registration not found'),
    422: ApiResponses.validation('Invalid status transition'),
  },
}

export const listRegistrationsDetail = {
  summary: 'List tournament registrations',
  description: 'Returns paginated registrations for a tournament. Requires viewer role in the org.',
  security,
  responses: {
    200: ApiResponses.paginated(RegistrationSchema, 'Registrations'),
    403: ApiResponses.forbidden('Forbidden'),
  },
}
