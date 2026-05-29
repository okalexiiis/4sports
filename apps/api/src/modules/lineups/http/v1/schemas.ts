import { Type } from '@sinclair/typebox'

export const LineupEntrySchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  match_id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  player_id: Type.String({ format: 'uuid' }),
  lineup_role: Type.Union([
    Type.Literal('starter'),
    Type.Literal('substitute'),
    Type.Literal('did_not_play'),
  ]),
  field_position: Type.Union([Type.String(), Type.Null()]),
  jersey_number: Type.Union([Type.Integer(), Type.Null()]),
  published_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
})

export const LineupPlayerInputSchema = Type.Object({
  player_id: Type.String({ format: 'uuid' }),
  lineup_role: Type.Union([
    Type.Literal('starter'),
    Type.Literal('substitute'),
    Type.Literal('did_not_play'),
  ]),
  field_position: Type.Optional(Type.String()),
  jersey_number: Type.Optional(Type.Integer({ minimum: 1, maximum: 99 })),
})

export const PublishLineupBodySchema = Type.Object({
  team_id: Type.String({ format: 'uuid' }),
  players: Type.Array(LineupPlayerInputSchema, { minItems: 1 }),
})

export const GetLineupQuerySchema = Type.Object({
  team_id: Type.Optional(Type.String({ format: 'uuid' })),
})
