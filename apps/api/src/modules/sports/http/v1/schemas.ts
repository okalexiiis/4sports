import { Type } from '@sinclair/typebox'

export const SportPositionSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  abbreviation: Type.Union([Type.String(), Type.Null()]),
})

export const SportSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  slug: Type.String(),
  icon_url: Type.Union([Type.String(), Type.Null()]),
  metadata: Type.Record(Type.String(), Type.Unknown()),
  positions: Type.Array(SportPositionSchema),
})
