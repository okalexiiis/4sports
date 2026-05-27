import { ApiResponses } from '@/shared/openapi/responses'
import { PlayerClaimSchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const requestClaimDetail = {
  summary: 'Request to claim a guest player profile',
  description:
    'Authenticated user requests to be linked to an existing guest player profile. Notifies the team captain and coaches for review.',
  security,
  responses: {
    201: ApiResponses.success(PlayerClaimSchema, 'Claim request created'),
    404: ApiResponses.notFound('Player not found'),
    409: ApiResponses.conflict('Pending claim already exists'),
    422: ApiResponses.validation('Player is not claimable'),
  },
}

export const reviewClaimDetail = {
  summary: 'Approve or reject a player claim',
  description:
    'Team captain or coach approves or rejects a pending player claim. On approval the guest profile is permanently linked to the claimant user account.',
  security,
  responses: {
    200: ApiResponses.success(PlayerClaimSchema, 'Claim reviewed'),
    403: ApiResponses.forbidden('Actor is not a captain or coach of this team'),
    404: ApiResponses.notFound('Claim not found'),
    422: ApiResponses.validation('Claim is not in a pending state'),
  },
}
