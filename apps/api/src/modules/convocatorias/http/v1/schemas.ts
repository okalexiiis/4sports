import { Type } from '@sinclair/typebox'

export const ConvocatoriaSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  match_id: Type.String({ format: 'uuid' }),
  player_id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  response: Type.Union([
    Type.Literal('pending'),
    Type.Literal('va'),
    Type.Literal('no_va'),
    Type.Literal('duda'),
  ]),
  responded_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
})

export const SendConvocatoriaBodySchema = Type.Object({
  team_id: Type.String({ format: 'uuid' }),
  player_ids: Type.Array(Type.String({ format: 'uuid' }), { minItems: 1 }),
})

export const RespondConvocatoriaBodySchema = Type.Object({
  response: Type.Union([Type.Literal('va'), Type.Literal('no_va'), Type.Literal('duda')]),
})
