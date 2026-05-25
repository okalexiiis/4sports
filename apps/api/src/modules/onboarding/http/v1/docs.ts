import { ApiResponses } from '@/shared/openapi/responses'
import { PlayerProfileSchema, UsernameCheckSchema } from './schemas'

export const completePlayerOnboardingDetail = {
  summary: 'Complete player onboarding',
  description:
    'Creates the profile row for a first-time player. Returns 409 if onboarding is already complete or if the username is taken (includes suggestions).',
  responses: {
    200: ApiResponses.success(PlayerProfileSchema, 'Profile created'),
    401: ApiResponses.unauthorized('No active session'),
    409: ApiResponses.conflict('Username taken or onboarding already complete'),
  },
}

export const checkUsernameDetail = {
  summary: 'Check username availability',
  description: 'Real-time check for username uniqueness. Returns suggestions when taken.',
  responses: {
    200: ApiResponses.success(UsernameCheckSchema, 'Availability result'),
    401: ApiResponses.unauthorized('No active session'),
  },
}
