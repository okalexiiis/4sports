import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import type { Note } from '../note.entity'
import { NoteErrors } from '../note.errors'
import type { INoteRepository } from '../note.repository'

export async function getNote(repo: INoteRepository, id: string): Promise<Result<Note>> {
  const note = await repo.findById(id)
  if (!note) return err(NoteErrors.notFound(id))
  return ok(note)
}
