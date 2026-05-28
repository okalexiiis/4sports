import { Type } from '@sinclair/typebox'

export const StandingEntrySchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  standing_id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  position: Type.Number(),
  played: Type.Number(),
  won: Type.Number(),
  drawn: Type.Number(),
  lost: Type.Number(),
  goals_for: Type.Number(),
  goals_against: Type.Number(),
  goal_difference: Type.Number(),
  points: Type.Number(),
})
