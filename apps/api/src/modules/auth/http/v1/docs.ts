import { ApiResponses } from '@/shared/openapi/responses'
import { MeSchema } from './schemas'

export const getMeDetail = {
  summary: 'Get current user identity',
  description:
    'Returns the authenticated user, profile, org memberships, and active org context resolved from Redis. onboarding_pending is true when no profile row exists yet.',
  responses: {
    200: ApiResponses.success(MeSchema, 'Current user context'),
    401: ApiResponses.unauthorized('No active session'),
  },
}
