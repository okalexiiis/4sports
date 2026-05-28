import { Type } from '@sinclair/typebox'

export const SportEventTypeSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  tournament_id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  forces_game_ejection: Type.Boolean(),
  suspension_matches: Type.Number(),
  created_at: Type.String({ format: 'date-time' }),
})
