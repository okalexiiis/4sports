import { Type } from '@sinclair/typebox'
import { ApiResponses } from '@/shared/openapi/responses'
import { OrgMemberSchema, UserInvitationSchema } from './schemas'

export const acceptInvitationDetail = {
  summary: 'Accept an invitation',
  security: [{ cookieAuth: [] }],
  description:
    'Accepts a pending invitation. Sets membership status to active and records joined_at. Returns 403 if the invitation belongs to another user, 409 if already processed, 410 if expired.',
  responses: {
    200: ApiResponses.success(OrgMemberSchema, 'Invitation accepted — member is now active'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Invitation belongs to another user'),
    404: ApiResponses.notFound('Invitation not found'),
    409: ApiResponses.conflict('Invitation already processed'),
    410: ApiResponses.error('Invitation has expired'),
  },
}

export const rejectInvitationDetail = {
  summary: 'Reject an invitation',
  security: [{ cookieAuth: [] }],
  description:
    'Rejects a pending invitation. Sets membership status to left. Returns 403 if the invitation belongs to another user, 409 if already processed.',
  responses: {
    204: { description: 'Invitation rejected' },
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Invitation belongs to another user'),
    404: ApiResponses.notFound('Invitation not found'),
    409: ApiResponses.conflict('Invitation already processed'),
  },
}

export const listUserInvitationsDetail = {
  summary: 'List my pending invitations',
  security: [{ cookieAuth: [] }],
  description:
    'Returns all pending (status=invited) organization invitations for the authenticated user. Only shows invitations linked to the user account (user_id match); email-only invitations become visible here after the user registers.',
  responses: {
    200: ApiResponses.success(Type.Array(UserInvitationSchema), 'List of pending invitations'),
    401: ApiResponses.unauthorized('No active session'),
  },
}
