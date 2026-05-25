import { ApiResponses } from '@/shared/openapi/responses'
import {
  OrgCreatedSchema,
  PlayerProfileSchema,
  SlugCheckSchema,
  UsernameCheckSchema,
} from './schemas'

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

export const completeOrgOnboardingDetail = {
  summary: 'Complete organizer onboarding',
  description:
    'Atomically creates profile, organization, owner membership, and free subscription in a single transaction. Returns 409 with suggestions if username or slug is taken.',
  responses: {
    200: ApiResponses.success(OrgCreatedSchema, 'Organization created'),
    401: ApiResponses.unauthorized('No active session'),
    409: ApiResponses.conflict('Username/slug taken or onboarding already complete'),
  },
}

export const checkSlugDetail = {
  summary: 'Check slug availability',
  description: 'Real-time check for organization slug uniqueness. Returns suggestions when taken.',
  responses: {
    200: ApiResponses.success(SlugCheckSchema, 'Availability result'),
    401: ApiResponses.unauthorized('No active session'),
  },
}
