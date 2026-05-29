import type { LineupEntry, LineupPlayerInput } from './lineup.entity'

export interface ILineupRepository {
  replaceTeamLineup(
    matchId: string,
    teamId: string,
    players: LineupPlayerInput[],
    publishedAt: Date,
  ): Promise<LineupEntry[]>
  listByMatch(matchId: string, teamId?: string): Promise<LineupEntry[]>
}
