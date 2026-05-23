import { Type } from '@sinclair/typebox'

export const NoteSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  title: Type.String(),
  content: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
})

export const CreateNoteBody = Type.Object({
  title: Type.String({
    minLength: 1,
    maxLength: 100,
  }),
  content: Type.String(),
})
