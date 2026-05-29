import type { SportEventType } from './sport-event-type.entity'

export interface ISportEventTypeRepository {
  listByTournament(tournamentId: string): Promise<SportEventType[]>
  findById(id: string): Promise<SportEventType | null>
}
