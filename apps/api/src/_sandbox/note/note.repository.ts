import type { Note } from './note.entity'

export interface INoteRepository {
  findById(id: string): Promise<Note | null>
  findAll(): Promise<Note[]>
  save(note: Note): Promise<void>
  delete(id: string): Promise<boolean>
}
