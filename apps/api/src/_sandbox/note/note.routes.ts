import { Type } from '@sinclair/typebox'
import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { InMemoryNoteRepository } from './in-memory-note.repository'
import { createNote } from './use-cases/create-note.use-case'
import { deleteNote } from './use-cases/delete-note.use-case'
import { getNote } from './use-cases/get-note.use-case'
import { listNotes } from './use-cases/list-notes.use-case'

const repo = new InMemoryNoteRepository()

const NoteSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  title: Type.String(),
  content: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
})

const ErrorBody = Type.Object({
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    details: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  }),
})

const errorResponse = (description: string) => ({
  description,
  content: { 'application/json': { schema: ErrorBody } },
})

const CreateNoteBody = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 100, description: 'Note title' }),
  content: Type.String({ description: 'Note body' }),
})

export const noteRoutes = new Elysia({ prefix: '/sandbox/notes', tags: ['Notes'] })
  .post('/', async (ctx) => toApiResponse(ctx, await createNote(repo, ctx.body)), {
    body: CreateNoteBody,
    detail: {
      summary: 'Create a note',
      description: 'Creates a new note. Title must be non-empty and at most 100 characters.',
      responses: {
        200: {
          description: 'Note created',
          content: {
            'application/json': {
              schema: Type.Object({ data: NoteSchema }),
            },
          },
        },
        422: errorResponse('Validation error — title empty or too long'),
      },
    },
  })
  .get('/', async (ctx) => toApiResponse(ctx, await listNotes(repo)), {
    detail: {
      summary: 'List all notes',
      description: 'Returns every note in the in-memory store.',
      responses: {
        200: {
          description: 'Note list',
          content: {
            'application/json': {
              schema: Type.Object({ data: Type.Array(NoteSchema) }),
            },
          },
        },
      },
    },
  })
  .get('/:id', async (ctx) => toApiResponse(ctx, await getNote(repo, ctx.params.id)), {
    params: Type.Object({ id: Type.String({ description: 'Note ID (UUID)' }) }),
    detail: {
      summary: 'Get a note by ID',
      description: 'Fetches a single note by its UUID. Returns 404 if the note does not exist.',
      responses: {
        200: {
          description: 'Note found',
          content: {
            'application/json': {
              schema: Type.Object({ data: NoteSchema }),
            },
          },
        },
        404: errorResponse('Note not found'),
      },
    },
  })
  .delete('/:id', async (ctx) => toApiResponse(ctx, await deleteNote(repo, ctx.params.id)), {
    params: Type.Object({ id: Type.String({ description: 'Note ID (UUID)' }) }),
    detail: {
      summary: 'Delete a note',
      description: 'Permanently removes a note by ID. Returns 404 if the note does not exist.',
      responses: {
        200: {
          description: 'Note deleted',
          content: {
            'application/json': {
              schema: Type.Object({}),
            },
          },
        },
        404: errorResponse('Note not found'),
      },
    },
  })
