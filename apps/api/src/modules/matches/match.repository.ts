import type { CreateMatchInput, ListMatchesFilters, Match, UpdateMatchInput } from './match.entity'

export interface IMatchRepository {
  create(input: CreateMatchInput): Promise<Match>
  findById(id: string): Promise<Match | null>
  findByRefereeToken(token: string): Promise<Match | null>
  listByTournament(tournamentId: string, filters?: ListMatchesFilters): Promise<Match[]>
  update(id: string, patch: UpdateMatchInput): Promise<Match>
  updateStatus(
    id: string,
    status: Match['status'],
    extra?: Partial<
      Pick<Match, 'home_score' | 'away_score' | 'winner_team_id' | 'started_at' | 'ended_at'>
    >,
  ): Promise<Match>
}
