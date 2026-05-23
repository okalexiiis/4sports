import { ApiResponses } from '@/shared/openapi/responses'
import { NoteSchema } from './schemas'

export const createNoteDetail = {
  summary: 'Create a note',
  description: 'Creates a new note. Title must be non-empty and at most 100 characters.',
  responses: {
    200: ApiResponses.success(NoteSchema, 'Note created'),
    422: ApiResponses.validation('Title empty or too long'),
  },
}

export const listNotesDetail = {
  summary: 'List all notes',
  description: 'Returns every note in the in-memory store.',
  responses: {
    200: ApiResponses.list(NoteSchema, 'Note list'),
  },
}

export const getNoteDetail = {
  summary: 'Get a note by ID',
  description: 'Fetches a single note by its UUID. Returns 404 if not found.',
  responses: {
    200: ApiResponses.success(NoteSchema, 'Note found'),
    404: ApiResponses.notFound('Note not found'),
  },
}

export const deleteNoteDetail = {
  summary: 'Delete a note',
  description: 'Permanently removes a note by ID. Returns 404 if not found.',
  responses: {
    200: ApiResponses.success(NoteSchema, 'Note deleted'),
    404: ApiResponses.notFound('Note not found'),
  },
}
