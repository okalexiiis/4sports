import { Type } from '@sinclair/typebox'

export const SuspensionSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  player_id: Type.String({ format: 'uuid' }),
  tournament_id: Type.String({ format: 'uuid' }),
  stat_value_id: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  suspension_matches: Type.Integer(),
  is_draft: Type.Boolean(),
  confirmed_by: Type.Union([Type.String(), Type.Null()]),
  confirmed_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  notes: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
})

export const ListSuspensionsQuerySchema = Type.Object({
  tournament_id: Type.Optional(Type.String({ format: 'uuid' })),
  // 'true' | 'false' — parsed from string in the route handler
  is_draft: Type.Optional(Type.String()),
})

export const ConfirmSuspensionBodySchema = Type.Object({
  suspension_matches: Type.Optional(Type.Integer({ minimum: 1 })),
  notes: Type.Optional(Type.String({ minLength: 1 })),
})
