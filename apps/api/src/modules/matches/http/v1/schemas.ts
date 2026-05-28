import { Type } from '@sinclair/typebox'

export const MatchSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  tournament_id: Type.String({ format: 'uuid' }),
  home_team_id: Type.String({ format: 'uuid' }),
  away_team_id: Type.String({ format: 'uuid' }),
  venue_id: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  round_id: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  status: Type.String(),
  home_score: Type.Union([Type.Number(), Type.Null()]),
  away_score: Type.Union([Type.Number(), Type.Null()]),
  winner_team_id: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  scheduled_at: Type.String({ format: 'date-time' }),
  started_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  ended_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  referee_session_token: Type.Union([Type.String(), Type.Null()]),
  next_match_id: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  notes: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
})

export const CreateMatchBodySchema = Type.Object({
  home_team_id: Type.String({ format: 'uuid' }),
  away_team_id: Type.String({ format: 'uuid' }),
  scheduled_at: Type.String({ format: 'date-time' }),
  venue_id: Type.Optional(Type.Union([Type.String({ format: 'uuid' }), Type.Null()])),
  round_id: Type.Optional(Type.Union([Type.String({ format: 'uuid' }), Type.Null()])),
  notes: Type.Optional(Type.Union([Type.String({ maxLength: 1000 }), Type.Null()])),
})

export const UpdateMatchBodySchema = Type.Object({
  scheduled_at: Type.Optional(Type.String({ format: 'date-time' })),
  venue_id: Type.Optional(Type.Union([Type.String({ format: 'uuid' }), Type.Null()])),
  notes: Type.Optional(Type.Union([Type.String({ maxLength: 1000 }), Type.Null()])),
})

export const TransitionStatusBodySchema = Type.Object({
  status: Type.Union([
    Type.Literal('live'),
    Type.Literal('postponed'),
    Type.Literal('suspended'),
    Type.Literal('finished'),
    Type.Literal('walkover'),
    Type.Literal('cancelled'),
    Type.Literal('scheduled'),
    Type.Literal('disputed'),
  ]),
  reason: Type.Optional(Type.String({ maxLength: 500 })),
  // Required when transitioning to 'walkover' — caller reads from tournament.settings.walkover_score
  winner_team_id: Type.Optional(Type.String({ format: 'uuid' })),
})

export const ListMatchesQuerySchema = Type.Object({
  status: Type.Optional(Type.String()),
  round_id: Type.Optional(Type.String({ format: 'uuid' })),
  team_id: Type.Optional(Type.String({ format: 'uuid' })),
})
