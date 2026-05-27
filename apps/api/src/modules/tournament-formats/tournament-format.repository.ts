import type { TournamentFormat } from './tournament-format.entity'

export interface ITournamentFormatRepository {
  listAll(): Promise<TournamentFormat[]>
  findById(id: string): Promise<TournamentFormat | null>
}
