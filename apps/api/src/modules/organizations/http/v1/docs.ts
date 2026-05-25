import { ApiResponses } from '@/shared/openapi/responses'
import { OrgMemberSchema, OrgSchema } from './schemas'

export const getOrganizationDetail = {
  summary: 'Get organization',
  description:
    "Returns org details and the requesting user's role. Requires active member context.",
  responses: {
    200: ApiResponses.success(OrgSchema, 'Organization details'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Not a member or insufficient context'),
    404: ApiResponses.notFound('Organization not found'),
  },
}

export const listMembersDetail = {
  summary: 'List organization members',
  description:
    'Returns a paginated list of organization members. Response data includes members array and meta pagination object.',
  responses: {
    200: ApiResponses.list(OrgMemberSchema, 'Member list with pagination meta'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Not a member or insufficient context'),
  },
}
