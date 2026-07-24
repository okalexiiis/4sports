import { Type } from '@sinclair/typebox'
import { ApiResponses } from '@/shared/openapi/responses'
import { MeSchema } from './schemas'

export const updateProfileDetail = {
  summary: 'Update profile',
  security: [{ cookieAuth: [] }],
  description:
    'Updates the authenticated user profile fields. All fields are optional — only provided fields are written.',
  responses: {
    200: ApiResponses.success(
      Type.Object({
        username: Type.Union([Type.String(), Type.Null()]),
        avatar_url: Type.Union([Type.String(), Type.Null()]),
        city: Type.Union([Type.String(), Type.Null()]),
        initial_intent: Type.Union([Type.String(), Type.Null()]),
        onboarding_completed_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
      }),
      'Profile updated',
    ),
    401: ApiResponses.unauthorized('No active session'),
    404: ApiResponses.notFound('Profile not found'),
    422: ApiResponses.validation('Validation error'),
  },
}

export const getMeDetail = {
  summary: 'Get current user identity',
  security: [{ cookieAuth: [] }],
  description:
    'Returns the authenticated user, profile, org memberships, and active org context resolved from Redis. onboarding_pending is true when no profile row exists yet.',
  responses: {
    200: ApiResponses.success(MeSchema, 'Current user context'),
    401: ApiResponses.unauthorized('No active session'),
  },
}

const ActiveContextSchema = Type.Union([
  Type.Object({ organization_id: Type.String(), role: Type.String() }),
  Type.Null(),
])

export const setContextDetail = {
  summary: 'Set active organization context',
  security: [{ cookieAuth: [] }],
  description:
    'Switches the active organization context persisted in Redis. Pass null to switch to player mode (clears context). Returns the new active context.',
  responses: {
    200: ApiResponses.success(ActiveContextSchema, 'Updated context'),
    401: ApiResponses.unauthorized('No active session'),
    403: ApiResponses.forbidden('Not an active member of the organization'),
  },
}
