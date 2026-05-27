import { Type } from '@sinclair/typebox'
import { ApiResponses } from '@/shared/openapi/responses'
import { OrgMemberSchema, OrgSchema } from './schemas'

export const createOrganizationDetail = {
  summary: 'Create organization',
  security: [{ cookieAuth: [] }],
  description:
    'Creates a new organization for the authenticated user. Also creates an owner membership and a subscription. User must have an existing profile.',
  responses: {
    200: ApiResponses.success(OrgSchema, 'Organization created'),
    401: ApiResponses.unauthorized('No active session'),
    404: ApiResponses.notFound('Plan not found'),
    409: ApiResponses.conflict('Slug already in use'),
    422: ApiResponses.validation('Validation error'),
  },
}

export const getOrganizationDetail = {
  summary: 'Get organization',
  security: [{ cookieAuth: [] }],
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
  security: [{ cookieAuth: [] }],
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
  security: [{ cookieAuth: [] }],
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
  security: [{ cookieAuth: [] }],
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
  security: [{ cookieAuth: [] }],
  description:
    'Sets member status to left. Admin cannot remove another admin. Writes to audit_logs.',
  responses: {
    200: ApiResponses.success(OrgMemberSchema, 'Member removed'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Insufficient role or last owner protection'),
    404: ApiResponses.notFound('Member not found'),
  },
}

export const transferOwnershipDetail = {
  summary: 'Transfer organization ownership',
  security: [{ cookieAuth: [] }],
  description:
    'Atomically demotes the current owner to admin and promotes the target member to owner. Writes two audit_log entries.',
  responses: {
    200: ApiResponses.success(Type.Null(), 'Ownership transferred'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Only the owner can transfer ownership'),
    404: ApiResponses.notFound('Target member not found'),
    409: ApiResponses.conflict('Target is already owner or not active'),
  },
}

export const suspendMemberDetail = {
  summary: 'Suspend a member',
  security: [{ cookieAuth: [] }],
  description: 'Sets member status to suspended. Cannot suspend the owner. Writes to audit_logs.',
  responses: {
    200: ApiResponses.success(OrgMemberSchema, 'Member suspended'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Cannot suspend the owner or insufficient role'),
    404: ApiResponses.notFound('Member not found'),
    409: ApiResponses.conflict('Member is not active'),
  },
}

export const reactivateMemberDetail = {
  summary: 'Reactivate a member',
  security: [{ cookieAuth: [] }],
  description:
    'Sets member status back to active. Only works on suspended members. Writes to audit_logs.',
  responses: {
    200: ApiResponses.success(OrgMemberSchema, 'Member reactivated'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Insufficient role'),
    404: ApiResponses.notFound('Member not found'),
    409: ApiResponses.conflict('Member is not suspended'),
  },
}
