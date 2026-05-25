import { Type } from '@sinclair/typebox'

export const PlayerOnboardingBodySchema = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 40 }),
  city: Type.Optional(Type.String({ maxLength: 80 })),
  country_code: Type.Optional(Type.String({ minLength: 2, maxLength: 2 })),
  phone: Type.Optional(Type.String({ maxLength: 20 })),
  is_looking_for_team: Type.Optional(Type.Boolean()),
})

export const PlayerProfileSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.String(),
  city: Type.Union([Type.String(), Type.Null()]),
  country_code: Type.Union([Type.String(), Type.Null()]),
  initial_intent: Type.String(),
  onboarding_completed_at: Type.String({ format: 'date-time' }),
})

export const UsernameCheckSchema = Type.Object({
  available: Type.Boolean(),
  suggestions: Type.Array(Type.String()),
})
