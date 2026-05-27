import { ApiResponses } from '@/shared/openapi/responses'
import { TeamMemberSchema, TeamSchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const createTeamDetail = {
  summary: 'Create team',
  description:
    'Creates a tournament-scoped team. The authenticated user becomes the captain automatically.',
  security,
  responses: {
    201: ApiResponses.success(TeamSchema, 'Team created'),
    422: ApiResponses.validation('Validation error'),
  },
}

export const listTeamMembersDetail = {
  summary: 'List team members',
  description: 'Returns all members of a team including guest profiles.',
  security,
  responses: {
    200: ApiResponses.list(TeamMemberSchema, 'Team members'),
    404: ApiResponses.notFound('Team not found'),
  },
}

export const addPlayerDetail = {
  summary: 'Add player to team',
  description:
    'Adds a guest player (type=guest) or sends an invitation to an existing user (type=user). Requires captain role.',
  security,
  responses: {
    201: ApiResponses.success(TeamMemberSchema, 'Guest player added'),
    403: ApiResponses.forbidden('Actor is not the team captain'),
    404: ApiResponses.notFound('Team not found'),
    409: ApiResponses.conflict('User already invited or already a member'),
  },
}

export const removeTeamMemberDetail = {
  summary: 'Remove team member',
  description: 'Removes a member from the team. Cannot remove the only captain.',
  security,
  responses: {
    204: { description: 'Member removed' },
    403: ApiResponses.forbidden('Actor is not the team captain'),
    404: ApiResponses.notFound('Team or member not found'),
    422: ApiResponses.validation('Cannot remove last captain'),
  },
}
