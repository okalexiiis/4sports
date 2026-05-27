import { Type } from '@sinclair/typebox'

export const TournamentSportSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  icon_url: Type.Union([Type.String(), Type.Null()]),
})

export const TournamentFormatRefSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  plan_required: Type.String(),
})

export const TournamentSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  organization_id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  banner_url: Type.Union([Type.String(), Type.Null()]),
  rules_pdf_url: Type.Union([Type.String(), Type.Null()]),
  tags: Type.Array(Type.String()),
  status: Type.String(),
  gender_restriction: Type.String(),
  validation_mode: Type.String(),
  eligibility_mode: Type.String(),
  settings: Type.Record(Type.String(), Type.Unknown()),
  player_fields: Type.Record(Type.String(), Type.Unknown()),
  max_teams: Type.Union([Type.Number(), Type.Null()]),
  min_teams: Type.Union([Type.Number(), Type.Null()]),
  min_players_per_team: Type.Union([Type.Number(), Type.Null()]),
  max_players_per_team: Type.Union([Type.Number(), Type.Null()]),
  is_public: Type.Boolean(),
  requires_approval: Type.Boolean(),
  join_code: Type.Union([Type.String(), Type.Null()]),
  created_under_plan: Type.Union([Type.String(), Type.Null()]),
  wizard_step: Type.Number(),
  starts_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  ends_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  registration_opens_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  registration_closes_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  sport: Type.Union([TournamentSportSchema, Type.Null()]),
  format: Type.Union([TournamentFormatRefSchema, Type.Null()]),
  created_by: Type.String({ format: 'uuid' }),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
})

export const CreateTournamentBodySchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 120 }),
  slug: Type.Optional(Type.String({ maxLength: 80 })),
  description: Type.Optional(Type.Union([Type.String({ maxLength: 500 }), Type.Null()])),
  sport_id: Type.Optional(Type.Union([Type.String({ format: 'uuid' }), Type.Null()])),
  format_id: Type.Optional(Type.Union([Type.String({ format: 'uuid' }), Type.Null()])),
  tags: Type.Optional(Type.Array(Type.String())),
  settings: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  player_fields: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  max_teams: Type.Optional(Type.Union([Type.Number({ minimum: 2 }), Type.Null()])),
  min_teams: Type.Optional(Type.Union([Type.Number({ minimum: 2 }), Type.Null()])),
  min_players_per_team: Type.Optional(Type.Union([Type.Number({ minimum: 1 }), Type.Null()])),
  max_players_per_team: Type.Optional(Type.Union([Type.Number({ minimum: 1 }), Type.Null()])),
  is_public: Type.Optional(Type.Boolean()),
  requires_approval: Type.Optional(Type.Boolean()),
  gender_restriction: Type.Optional(
    Type.Union([
      Type.Literal('none'),
      Type.Literal('male'),
      Type.Literal('female'),
      Type.Literal('mixed'),
    ]),
  ),
  validation_mode: Type.Optional(
    Type.Union([Type.Literal('strict'), Type.Literal('flexible'), Type.Literal('hybrid')]),
  ),
  eligibility_mode: Type.Optional(Type.Union([Type.Literal('strict'), Type.Literal('flexible')])),
  starts_at: Type.Optional(Type.Union([Type.String({ format: 'date-time' }), Type.Null()])),
  ends_at: Type.Optional(Type.Union([Type.String({ format: 'date-time' }), Type.Null()])),
  registration_opens_at: Type.Optional(
    Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  ),
  registration_closes_at: Type.Optional(
    Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  ),
})

export const UpdateTournamentBodySchema = Type.Partial(CreateTournamentBodySchema)

export const PublishTournamentBodySchema = Type.Object({
  visibility: Type.Union([Type.Literal('public'), Type.Literal('private')]),
})

export const TournamentQuerySchema = Type.Object({
  status: Type.Optional(Type.String()),
  tags: Type.Optional(Type.String()),
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
})

export const PublicTournamentQuerySchema = Type.Object({
  sport: Type.Optional(Type.String()),
  city: Type.Optional(Type.String()),
  tags: Type.Optional(Type.String()),
  q: Type.Optional(Type.String()),
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
})
