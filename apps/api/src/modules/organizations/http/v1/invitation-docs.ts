import { ApiResponses } from '@/shared/openapi/responses'
import { OrgMemberSchema } from './schemas'

export const acceptInvitationDetail = {
  summary: 'Accept an invitation',
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
