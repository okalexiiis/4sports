import { Type } from '@sinclair/typebox'

export const ContextBodySchema = Type.Object({
  organization_id: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
})

const ActiveContextSchema = Type.Object({
  organization_id: Type.String(),
  role: Type.String(),
})

const OrgMembershipSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  role: Type.String(),
})

const ProfileSchema = Type.Object({
  username: Type.Union([Type.String(), Type.Null()]),
  avatar_url: Type.Union([Type.String(), Type.Null()]),
  city: Type.Union([Type.String(), Type.Null()]),
  initial_intent: Type.Union([Type.String(), Type.Null()]),
  onboarding_completed_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
})

export const MeSchema = Type.Object({
  user: Type.Object({
    id: Type.String(),
    email: Type.String({ format: 'email' }),
    name: Type.String(),
  }),
  profile: Type.Union([ProfileSchema, Type.Null()]),
  organizations: Type.Array(OrgMembershipSchema),
  active_context: Type.Union([ActiveContextSchema, Type.Null()]),
  onboarding_pending: Type.Boolean(),
})
