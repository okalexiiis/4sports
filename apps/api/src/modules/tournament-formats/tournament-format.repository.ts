import type { TournamentFormat } from './tournament-format.entity'

export interface ITournamentFormatRepository {
  listAll(): Promise<TournamentFormat[]>
}
