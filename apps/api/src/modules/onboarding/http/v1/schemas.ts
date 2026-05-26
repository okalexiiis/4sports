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

export const SlugCheckSchema = Type.Object({
  available: Type.Boolean(),
  suggestions: Type.Array(Type.String()),
})

export const OrgOnboardingBodySchema = Type.Object({
  profile: Type.Object({
    username: Type.String({ minLength: 3, maxLength: 40 }),
    city: Type.Optional(Type.String({ maxLength: 80 })),
    country_code: Type.Optional(Type.String({ minLength: 2, maxLength: 2 })),
  }),
  organization: Type.Object({
    name: Type.String({ minLength: 2, maxLength: 120 }),
    slug: Type.Optional(Type.String({ maxLength: 80 })),
    description: Type.Optional(Type.String({ maxLength: 500 })),
    city: Type.Optional(Type.String({ maxLength: 80 })),
    country_code: Type.Optional(Type.String({ minLength: 2, maxLength: 2 })),
  }),
  plan: Type.Union([
    Type.Literal('free'),
    Type.Literal('starter'),
    Type.Literal('pro'),
    Type.Literal('elite'),
  ]),
})

export const OrgCreatedSchema = Type.Object({
  profile: PlayerProfileSchema,
  organization: Type.Object({
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
    slug: Type.String(),
  }),
})
