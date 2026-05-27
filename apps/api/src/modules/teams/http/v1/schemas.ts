import { Type } from '@sinclair/typebox'

export const PlayerSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  user_id: Type.Union([Type.String(), Type.Null()]),
  display_name: Type.String(),
  avatar_url: Type.Union([Type.String(), Type.Null()]),
  jersey_number: Type.Union([Type.Number(), Type.Null()]),
  position: Type.Union([Type.String(), Type.Null()]),
  sex: Type.Union([Type.String(), Type.Null()]),
  date_of_birth: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  email: Type.Union([Type.String(), Type.Null()]),
  phone: Type.Union([Type.String(), Type.Null()]),
  is_guest: Type.Boolean(),
  guest_created_by: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
})

export const TeamMemberSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  player_id: Type.String({ format: 'uuid' }),
  role: Type.String(),
  status: Type.String(),
  joined_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  player: PlayerSchema,
})

export const TeamInvitationSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  invited_user_id: Type.String(),
  invited_by: Type.String(),
  role: Type.String(),
  jersey_number: Type.Union([Type.Number(), Type.Null()]),
  status: Type.String(),
  expires_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
})

export const TeamSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  organization_id: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  name: Type.String(),
  short_name: Type.Union([Type.String(), Type.Null()]),
  logo_url: Type.Union([Type.String(), Type.Null()]),
  primary_color: Type.Union([Type.String(), Type.Null()]),
  secondary_color: Type.Union([Type.String(), Type.Null()]),
  city: Type.Union([Type.String(), Type.Null()]),
  country_code: Type.Union([Type.String(), Type.Null()]),
  gender_type: Type.String(),
  join_policy: Type.String(),
  scope: Type.String(),
  owned_by_user_id: Type.String(),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
})

export const CreateTeamBodySchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 80 }),
  short_name: Type.Optional(Type.Union([Type.String({ maxLength: 10 }), Type.Null()])),
  logo_url: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  primary_color: Type.Optional(Type.Union([Type.String({ maxLength: 7 }), Type.Null()])),
  secondary_color: Type.Optional(Type.Union([Type.String({ maxLength: 7 }), Type.Null()])),
  city: Type.Optional(Type.Union([Type.String({ maxLength: 80 }), Type.Null()])),
  country_code: Type.Optional(
    Type.Union([Type.String({ minLength: 2, maxLength: 2 }), Type.Null()]),
  ),
  gender_type: Type.Optional(
    Type.Union([Type.Literal('male'), Type.Literal('female'), Type.Literal('mixed')]),
  ),
  join_policy: Type.Optional(
    Type.Union([Type.Literal('open'), Type.Literal('request'), Type.Literal('invite_only')]),
  ),
  organization_id: Type.Optional(Type.Union([Type.String({ format: 'uuid' }), Type.Null()])),
})

export const AddGuestPlayerBodySchema = Type.Object({
  type: Type.Literal('guest'),
  display_name: Type.String({ minLength: 2, maxLength: 80 }),
  avatar_url: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  jersey_number: Type.Optional(
    Type.Union([Type.Number({ minimum: 0, maximum: 999 }), Type.Null()]),
  ),
  position: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  sex: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  date_of_birth: Type.Optional(Type.Union([Type.String({ format: 'date-time' }), Type.Null()])),
  email: Type.Optional(Type.Union([Type.String({ format: 'email' }), Type.Null()])),
  phone: Type.Optional(Type.Union([Type.String(), Type.Null()])),
})

export const InviteUserBodySchema = Type.Object({
  type: Type.Literal('user'),
  invited_user_id: Type.String(),
  role: Type.Optional(
    Type.Union([Type.Literal('captain'), Type.Literal('coach'), Type.Literal('player')]),
  ),
  jersey_number: Type.Optional(
    Type.Union([Type.Number({ minimum: 0, maximum: 999 }), Type.Null()]),
  ),
})

export const AddPlayerBodySchema = Type.Union([AddGuestPlayerBodySchema, InviteUserBodySchema])
