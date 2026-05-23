import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { NoteErrors } from '../errors/index'
import type { Note } from '../note.entity'
import type { INoteRepository } from '../note.repository'

export async function getNote(repo: INoteRepository, id: string): Promise<Result<Note>> {
  const note = await repo.findById(id)
  if (!note) return err(NoteErrors.notFound(id))
  return ok(note)
}
