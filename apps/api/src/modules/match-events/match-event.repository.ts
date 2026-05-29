import type { CreateMatchEventInput, MatchEvent } from './match-event.entity'

export interface IMatchEventRepository {
  create(input: CreateMatchEventInput): Promise<MatchEvent>
  findById(id: string): Promise<MatchEvent | null>
  listByMatch(matchId: string): Promise<MatchEvent[]>
  delete(id: string): Promise<void>
  findEjectionByMatchAndPlayer(matchId: string, playerId: string): Promise<MatchEvent | null>
}
