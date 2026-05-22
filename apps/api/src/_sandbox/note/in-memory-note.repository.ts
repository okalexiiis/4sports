import type { Note } from './note.entity'
import type { INoteRepository } from './note.repository'

export class InMemoryNoteRepository implements INoteRepository {
  private store = new Map<string, Note>()

  async findById(id: string): Promise<Note | null> {
    return this.store.get(id) ?? null
  }

  async findAll(): Promise<Note[]> {
    return [...this.store.values()]
  }

  async save(note: Note): Promise<void> {
    this.store.set(note.id, note)
  }

  async delete(id: string): Promise<boolean> {
    const existed = this.store.has(id)
    this.store.delete(id)
    return existed
  }
}
