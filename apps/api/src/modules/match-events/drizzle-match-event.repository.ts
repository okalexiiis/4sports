import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { playerStatValues, sportEventTypes } from '@/shared/db/schemas'
import type { CreateMatchEventInput, MatchEvent } from './match-event.entity'
import type { IMatchEventRepository } from './match-event.repository'

export class DrizzleMatchEventRepository implements IMatchEventRepository {
  async create(input: CreateMatchEventInput): Promise<MatchEvent> {
    const [row] = await db
      .insert(playerStatValues)
      .values({
        match_id: input.match_id,
        player_id: input.player_id,
        team_id: input.team_id,
        event_type_id: input.event_type_id,
        minute: input.minute ?? null,
        period_index: input.period_index,
        is_draft: true,
        created_by: input.created_by,
      })
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: insert + returning always returns one row
    return this.toEntity(row!)
  }

  async findById(id: string): Promise<MatchEvent | null> {
    const [row] = await db
      .select()
      .from(playerStatValues)
      .where(eq(playerStatValues.id, id))
      .limit(1)
    return row ? this.toEntity(row) : null
  }

  async listByMatch(matchId: string): Promise<MatchEvent[]> {
    const rows = await db
      .select()
      .from(playerStatValues)
      .where(eq(playerStatValues.match_id, matchId))
      .orderBy(
        asc(playerStatValues.period_index),
        asc(playerStatValues.minute),
        asc(playerStatValues.created_at),
      )

    return rows.map(this.toEntity)
  }

  async delete(id: string): Promise<void> {
    await db.delete(playerStatValues).where(eq(playerStatValues.id, id))
  }

  async findEjectionByMatchAndPlayer(
    matchId: string,
    playerId: string,
  ): Promise<MatchEvent | null> {
    const [row] = await db
      .select({ stat: playerStatValues })
      .from(playerStatValues)
      .innerJoin(sportEventTypes, eq(playerStatValues.event_type_id, sportEventTypes.id))
      .where(
        and(
          eq(playerStatValues.match_id, matchId),
          eq(playerStatValues.player_id, playerId),
          eq(sportEventTypes.forces_game_ejection, true),
        ),
      )
      .limit(1)

    return row ? this.toEntity(row.stat) : null
  }

  private toEntity(row: typeof playerStatValues.$inferSelect): MatchEvent {
    return {
      id: row.id,
      match_id: row.match_id,
      player_id: row.player_id,
      team_id: row.team_id,
      event_type_id: row.event_type_id,
      minute: row.minute,
      period_index: row.period_index,
      is_draft: row.is_draft,
      created_by: row.created_by,
      created_at: row.created_at,
    }
  }
}
