import { and, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matchLineups } from '@/shared/db/schemas'
import type { LineupEntry, LineupPlayerInput } from './lineup.entity'
import type { ILineupRepository } from './lineup.repository'

function rowToEntry(row: typeof matchLineups.$inferSelect): LineupEntry {
  return {
    id: row.id,
    match_id: row.match_id,
    team_id: row.team_id,
    player_id: row.player_id,
    lineup_role: row.lineup_role as LineupEntry['lineup_role'],
    field_position: row.field_position,
    jersey_number: row.jersey_number,
    published_at: row.published_at,
    created_at: row.created_at,
  }
}

export class DrizzleLineupRepository implements ILineupRepository {
  async replaceTeamLineup(
    matchId: string,
    teamId: string,
    players: LineupPlayerInput[],
    publishedAt: Date,
  ): Promise<LineupEntry[]> {
    return db.transaction(async (tx) => {
      await tx
        .delete(matchLineups)
        .where(and(eq(matchLineups.match_id, matchId), eq(matchLineups.team_id, teamId)))

      if (players.length === 0) return []

      const rows = await tx
        .insert(matchLineups)
        .values(
          players.map((p) => ({
            match_id: matchId,
            team_id: teamId,
            player_id: p.player_id,
            lineup_role: p.lineup_role,
            field_position: p.field_position ?? null,
            jersey_number: p.jersey_number ?? null,
            published_at: publishedAt,
          })),
        )
        .returning()

      return rows.map(rowToEntry)
    })
  }

  async listByMatch(matchId: string, teamId?: string): Promise<LineupEntry[]> {
    const condition = teamId
      ? and(eq(matchLineups.match_id, matchId), eq(matchLineups.team_id, teamId))
      : eq(matchLineups.match_id, matchId)

    const rows = await db.select().from(matchLineups).where(condition)
    return rows.map(rowToEntry)
  }
}
