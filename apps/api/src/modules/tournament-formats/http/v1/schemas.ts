import { Type } from '@sinclair/typebox'

export const TournamentFormatSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  plan_required: Type.String(),
})
