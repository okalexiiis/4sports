import { Type } from '@sinclair/typebox'

export const DisputeSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  match_id: Type.String({ format: 'uuid' }),
  opened_by: Type.String(),
  reason: Type.String(),
  description: Type.String(),
  evidence_urls: Type.Union([Type.Array(Type.String()), Type.Null()]),
  status: Type.Union([Type.Literal('open'), Type.Literal('resolved')]),
  resolution_notes: Type.Union([Type.String(), Type.Null()]),
  final_score_override: Type.Union([
    Type.Object({ home: Type.Integer(), away: Type.Integer() }),
    Type.Null(),
  ]),
  resolved_by: Type.Union([Type.String(), Type.Null()]),
  resolved_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
})

export const OpenDisputeBodySchema = Type.Object({
  reason: Type.String({ minLength: 1 }),
  description: Type.String({ minLength: 1 }),
  evidence_urls: Type.Optional(Type.Array(Type.String({ format: 'uri' }))),
})

export const ResolveDisputeBodySchema = Type.Object({
  resolution_notes: Type.String({ minLength: 1 }),
  final_score_override: Type.Optional(
    Type.Object({
      home: Type.Integer({ minimum: 0 }),
      away: Type.Integer({ minimum: 0 }),
    }),
  ),
})
