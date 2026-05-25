import { Type } from '@sinclair/typebox'

export const OrgSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  logo_url: Type.Union([Type.String(), Type.Null()]),
  website_url: Type.Union([Type.String(), Type.Null()]),
  country_code: Type.Union([Type.String(), Type.Null()]),
  city: Type.Union([Type.String(), Type.Null()]),
  is_verified: Type.Boolean(),
  created_at: Type.String({ format: 'date-time' }),
  role: Type.String(),
})

export const OrgMemberSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  user: Type.Object({
    name: Type.Union([Type.String(), Type.Null()]),
    email: Type.String({ format: 'email' }),
    avatar_url: Type.Union([Type.String(), Type.Null()]),
  }),
  role: Type.String(),
  status: Type.String(),
  tournament_ids: Type.Array(Type.String()),
  joined_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
})

export const MembersQuerySchema = Type.Object({
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
})
