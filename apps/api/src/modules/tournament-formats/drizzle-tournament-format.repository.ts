import { and, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { tournamentFormats } from '@/shared/db/schemas'
import type { TournamentFormat } from './tournament-format.entity'
import type { ITournamentFormatRepository } from './tournament-format.repository'

function rowToFormat(row: typeof tournamentFormats.$inferSelect): TournamentFormat {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    plan_required: row.plan_required,
  }
}

export class DrizzleTournamentFormatRepository implements ITournamentFormatRepository {
  async listAll(): Promise<TournamentFormat[]> {
    const rows = await db
      .select()
      .from(tournamentFormats)
      .where(eq(tournamentFormats.is_active, true))
      .orderBy(tournamentFormats.name)

    return rows.map(rowToFormat)
  }

  async findById(id: string): Promise<TournamentFormat | null> {
    const [row] = await db
      .select()
      .from(tournamentFormats)
      .where(and(eq(tournamentFormats.id, id), eq(tournamentFormats.is_active, true)))
      .limit(1)

    return row ? rowToFormat(row) : null
  }
}
