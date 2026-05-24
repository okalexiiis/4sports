import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { NoteErrors } from '../errors/index'
import type { Note } from '../note.entity'
import type { INoteRepository } from '../note.repository'

export async function createNote(
  repo: INoteRepository,
  input: { title: string; content: string },
): Promise<Result<Note>> {
  if (!input.title.trim()) return err(NoteErrors.titleRequired())
  if (input.title.length > 100) return err(NoteErrors.titleTooLong(100))

  const note: Note = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    content: input.content,
    createdAt: new Date(),
  }
  await repo.save(note)
  return ok(note)
}
