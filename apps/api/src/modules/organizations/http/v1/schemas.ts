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

export const InviteMemberBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  role: Type.Union([Type.Literal('organizer'), Type.Literal('coach'), Type.Literal('viewer')]),
  tournament_ids: Type.Array(Type.String({ format: 'uuid' })),
})

export const UpdateMemberRoleBodySchema = Type.Object({
  role: Type.Union([Type.Literal('organizer'), Type.Literal('coach'), Type.Literal('viewer')]),
  tournament_ids: Type.Array(Type.String({ format: 'uuid' })),
})

export const TransferOwnershipBodySchema = Type.Object({
  new_owner_member_id: Type.String({ format: 'uuid' }),
}
export const CreateOrgBodySchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 120 }),
  slug: Type.Optional(Type.String({ maxLength: 80 })),
  description: Type.Optional(Type.String({ maxLength: 500 })),
  city: Type.Optional(Type.String({ maxLength: 80 })),
  country_code: Type.Optional(Type.String({ minLength: 2, maxLength: 2 })),
  plan: Type.Union([
    Type.Literal('free'),
    Type.Literal('starter'),
    Type.Literal('pro'),
    Type.Literal('elite'),
  ]),
})
