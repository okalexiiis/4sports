import { Type } from '@sinclair/typebox'

export const PlayerClaimSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  player_id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  claimant_user_id: Type.String(),
  status: Type.Union([Type.Literal('pending'), Type.Literal('approved'), Type.Literal('rejected')]),
  reviewed_by: Type.Union([Type.String(), Type.Null()]),
  reviewed_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
})

export const ReviewClaimBodySchema = Type.Object({
  status: Type.Union([Type.Literal('approved'), Type.Literal('rejected')]),
})
