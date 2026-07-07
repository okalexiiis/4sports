import { and, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { playerSuspensions, tournaments } from '@/shared/db/schemas'
import type { Suspension } from './suspension.entity'
import type {
  ConfirmSuspensionInput,
  ISuspensionRepository,
  ListSuspensionsFilter,
} from './suspension.repository'

function rowToSuspension(row: typeof playerSuspensions.$inferSelect): Suspension {
  return {
    id: row.id,
    player_id: row.player_id,
    tournament_id: row.tournament_id,
    stat_value_id: row.stat_value_id,
    suspension_matches: row.suspension_matches,
    is_draft: row.is_draft,
    confirmed_by: row.confirmed_by,
    confirmed_at: row.confirmed_at,
    notes: row.notes,
    created_at: row.created_at,
  }
}

export class DrizzleSuspensionRepository implements ISuspensionRepository {
  async findById(id: string): Promise<Suspension | null> {
    const [row] = await db
      .select()
      .from(playerSuspensions)
      .where(eq(playerSuspensions.id, id))
      .limit(1)
    return row ? rowToSuspension(row) : null
  }

  async listByOrganization(filter: ListSuspensionsFilter): Promise<Suspension[]> {
    const conditions = [eq(tournaments.organization_id, filter.organizationId)]
    if (filter.tournamentId) {
      conditions.push(eq(playerSuspensions.tournament_id, filter.tournamentId))
    }
    if (filter.isDraft !== undefined) {
      conditions.push(eq(playerSuspensions.is_draft, filter.isDraft))
    }

    const rows = await db
      .select({ suspension: playerSuspensions })
      .from(playerSuspensions)
      .innerJoin(tournaments, eq(playerSuspensions.tournament_id, tournaments.id))
      .where(and(...conditions))

    return rows.map((r) => rowToSuspension(r.suspension))
  }

  async confirm(id: string, input: ConfirmSuspensionInput): Promise<Suspension> {
    const [row] = await db
      .update(playerSuspensions)
      .set({
        is_draft: false,
        confirmed_by: input.confirmed_by,
        confirmed_at: input.confirmed_at,
        ...(input.suspension_matches !== undefined && {
          suspension_matches: input.suspension_matches,
        }),
        ...(input.notes !== undefined && { notes: input.notes }),
      })
      .where(eq(playerSuspensions.id, id))
      .returning()
    // biome-ignore lint/style/noNonNullAssertion: update on existing row always returns one result
    return rowToSuspension(row!)
  }
}
