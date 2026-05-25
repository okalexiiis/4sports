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

export const inviteMemberDetail = {
  summary: 'Invite a member',
  description:
    'Invites a user by email. Admin cannot invite owner or another admin. Returns 409 with can_resend if a pending invite exists.',
  responses: {
    200: ApiResponses.success(OrgMemberSchema, 'Invitation created'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Insufficient role'),
    409: ApiResponses.conflict('Already a member or pending invite'),
  },
}

export const updateMemberRoleDetail = {
  summary: 'Update member role',
  description:
    'Changes a member role. Admin cannot promote to admin or owner. Writes to audit_logs.',
  responses: {
    200: ApiResponses.success(OrgMemberSchema, 'Member updated'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Insufficient role or last owner protection'),
    404: ApiResponses.notFound('Member not found'),
  },
}

export const removeMemberDetail = {
  summary: 'Remove a member',
  description:
    'Sets member status to left. Admin cannot remove another admin. Writes to audit_logs.',
  responses: {
    200: ApiResponses.success(OrgMemberSchema, 'Member removed'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Insufficient role or last owner protection'),
    404: ApiResponses.notFound('Member not found'),
  },
}
