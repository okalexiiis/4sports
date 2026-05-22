import type { Result } from '@4sports/utils/result'
import { ok } from '@4sports/utils/result'
import type { Note } from '../note.entity'
import type { INoteRepository } from '../note.repository'

export async function listNotes(repo: INoteRepository): Promise<Result<Note[]>> {
  return ok(await repo.findAll())
}
