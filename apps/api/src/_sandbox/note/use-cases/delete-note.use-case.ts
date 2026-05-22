import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { NoteErrors } from '../note.errors'
import type { INoteRepository } from '../note.repository'

export async function deleteNote(repo: INoteRepository, id: string): Promise<Result<void>> {
  const deleted = await repo.delete(id)
  if (!deleted) return err(NoteErrors.notFound(id))
  return ok(undefined)
}
