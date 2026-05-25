import { ApiResponses } from '@/shared/openapi/responses'
import { CreatedOrgSchema, OrgMemberSchema, OrgSchema } from './schemas'

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

export const createOrganizationDetail = {
  summary: 'Create additional organization',
  description:
    'Creates a new organization for a user who already has a profile. Auto-generates slug from name if not provided.',
  responses: {
    200: ApiResponses.success(CreatedOrgSchema, 'Organization created'),
    401: ApiResponses.unauthorized('No active session'),
    404: ApiResponses.notFound('User profile or subscription plan not found'),
    409: ApiResponses.conflict('Slug already taken'),
  },
}

export const acceptInvitationDetail = {
  summary: 'Accept organization invitation',
  description: 'Accepts a pending invitation to join an organization. Sets status to active.',
  responses: {
    200: ApiResponses.success(CreatedOrgSchema, 'Invitation accepted'),
    401: ApiResponses.unauthorized('No active session'),
    404: ApiResponses.notFound('Invitation not found'),
    409: ApiResponses.conflict('Invitation has expired'),
  },
}

export const rejectInvitationDetail = {
  summary: 'Reject organization invitation',
  description: 'Rejects a pending invitation to join an organization. Sets status to left.',
  responses: {
    200: ApiResponses.success(CreatedOrgSchema, 'Invitation rejected'),
    401: ApiResponses.unauthorized('No active session'),
    404: ApiResponses.notFound('Invitation not found'),
  },
}

export const suspendMemberDetail = {
  summary: 'Suspend or reactivate a member',
  description:
    'Suspends or reactivates a member. Admin cannot suspend another admin. Writes to audit_logs.',
  responses: {
    200: ApiResponses.success(OrgMemberSchema, 'Member status updated'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Insufficient role'),
    404: ApiResponses.notFound('Member not found'),
  },
}

export const transferOwnershipDetail = {
  summary: 'Transfer organization ownership',
  description:
    'Transfers ownership to an active member. Current owner becomes admin. Writes to audit_logs.',
  responses: {
    200: ApiResponses.success(CreatedOrgSchema, 'Ownership transferred'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Only the owner can transfer ownership'),
    404: ApiResponses.notFound('Target member not found'),
    409: ApiResponses.conflict('Target member is already the owner'),
  },
}
