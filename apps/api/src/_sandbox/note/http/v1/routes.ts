import { Type } from '@sinclair/typebox'
import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { InMemoryNoteRepository } from '../../in-memory-note.repository'
import { createNote } from '../../use-cases/create-note.use-case'
import { deleteNote } from '../../use-cases/delete-note.use-case'
import { getNote } from '../../use-cases/get-note.use-case'
import { listNotes } from '../../use-cases/list-notes.use-case'
import { createNoteDetail, deleteNoteDetail, getNoteDetail, listNotesDetail } from './docs'
import { CreateNoteBody } from './schemas'

const repo = new InMemoryNoteRepository()

export const noteV1Routes = new Elysia({ prefix: '/sandbox/v1/notes', tags: ['Notes'] })
  .post('/', async (ctx) => toApiResponse(ctx, await createNote(repo, ctx.body)), {
    body: CreateNoteBody,
    detail: createNoteDetail,
  })
  .get('/', async (ctx) => toApiResponse(ctx, await listNotes(repo)), {
    detail: listNotesDetail,
  })
  .get('/:id', async (ctx) => toApiResponse(ctx, await getNote(repo, ctx.params.id)), {
    params: Type.Object({ id: Type.String() }),
    detail: getNoteDetail,
  })
  .delete('/:id', async (ctx) => toApiResponse(ctx, await deleteNote(repo, ctx.params.id)), {
    params: Type.Object({ id: Type.String() }),
    detail: deleteNoteDetail,
  })
