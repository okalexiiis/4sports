import type { DomainEventLogMeta } from '@4sports/logger'
import { logger } from '@/shared/logger'
import type { Note } from './note.entity'
import type { INoteRepository } from './note.repository'

export class InMemoryNoteRepository implements INoteRepository {
  private store = new Map<string, Note>()

  async findById(id: string): Promise<Note | null> {
    logger.debug('note.findById', {
      type: 'domain_event',
      event: 'note.repo.findById',
      entity_id: id,
    } satisfies DomainEventLogMeta)
    return this.store.get(id) ?? null
  }

  async findAll(): Promise<Note[]> {
    logger.debug('note.findAll', {
      type: 'domain_event',
      event: 'note.repo.findAll',
    } satisfies DomainEventLogMeta)
    return [...this.store.values()]
  }

  async save(note: Note): Promise<void> {
    this.store.set(note.id, note)
    logger.debug('note.save', {
      type: 'domain_event',
      event: 'note.repo.save',
      entity_id: note.id,
    } satisfies DomainEventLogMeta)
  }

  async delete(id: string): Promise<boolean> {
    const existed = this.store.has(id)
    this.store.delete(id)
    logger.debug('note.delete', {
      type: 'domain_event',
      event: 'note.repo.delete',
      entity_id: id,
    } satisfies DomainEventLogMeta)
    return existed
  }
}
