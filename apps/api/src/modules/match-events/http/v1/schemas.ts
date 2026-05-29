import { Type } from '@sinclair/typebox'

export const MatchEventSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  match_id: Type.String({ format: 'uuid' }),
  player_id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  event_type_id: Type.String({ format: 'uuid' }),
  minute: Type.Union([Type.Number(), Type.Null()]),
  period_index: Type.Number(),
  is_draft: Type.Boolean(),
  created_by: Type.String(),
  created_at: Type.String({ format: 'date-time' }),
})

export const RegisterEventBodySchema = Type.Object({
  event_type_id: Type.String({ format: 'uuid' }),
  player_id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  minute: Type.Optional(Type.Integer({ minimum: 0, maximum: 999 })),
  period_index: Type.Integer({ minimum: 0 }),
})
