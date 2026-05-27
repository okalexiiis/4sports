import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { tournamentFormats } from '@/shared/db/schemas'
import type { TournamentFormat } from './tournament-format.entity'
import type { ITournamentFormatRepository } from './tournament-format.repository'

export class DrizzleTournamentFormatRepository implements ITournamentFormatRepository {
  async listAll(): Promise<TournamentFormat[]> {
    const rows = await db
      .select()
      .from(tournamentFormats)
      .where(eq(tournamentFormats.is_active, true))
      .orderBy(tournamentFormats.name)

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      plan_required: row.plan_required,
    }))
  }
}
