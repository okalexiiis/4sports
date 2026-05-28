import { asc, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { sportEventTypes } from '@/shared/db/schemas'
import type { SportEventType } from './sport-event-type.entity'
import type { ISportEventTypeRepository } from './sport-event-type.repository'

export class DrizzleSportEventTypeRepository implements ISportEventTypeRepository {
  async listByTournament(tournamentId: string): Promise<SportEventType[]> {
    const rows = await db
      .select()
      .from(sportEventTypes)
      .where(eq(sportEventTypes.tournament_id, tournamentId))
      .orderBy(asc(sportEventTypes.name))

    return rows.map(this.toEntity)
  }

  async findById(id: string): Promise<SportEventType | null> {
    const [row] = await db.select().from(sportEventTypes).where(eq(sportEventTypes.id, id)).limit(1)

    return row ? this.toEntity(row) : null
  }

  private toEntity(row: typeof sportEventTypes.$inferSelect): SportEventType {
    return {
      id: row.id,
      tournament_id: row.tournament_id,
      name: row.name,
      slug: row.slug,
      forces_game_ejection: row.forces_game_ejection,
      suspension_matches: row.suspension_matches,
      created_at: row.created_at,
    }
  }
}
