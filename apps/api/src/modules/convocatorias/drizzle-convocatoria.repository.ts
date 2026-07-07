import { and, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matchConvocatorias } from '@/shared/db/schemas'
import type {
  Convocatoria,
  ConvocatoriaResponse,
  UpsertConvocatoriaInput,
} from './convocatoria.entity'
import type { IConvocatoriaRepository } from './convocatoria.repository'

function rowToConvocatoria(row: typeof matchConvocatorias.$inferSelect): Convocatoria {
  return {
    id: row.id,
    match_id: row.match_id,
    player_id: row.player_id,
    team_id: row.team_id,
    response: row.response as Convocatoria['response'],
    responded_at: row.responded_at,
    created_at: row.created_at,
  }
}

export class DrizzleConvocatoriaRepository implements IConvocatoriaRepository {
  async upsertMany(inputs: UpsertConvocatoriaInput[]): Promise<Convocatoria[]> {
    if (inputs.length === 0) return []
    const rows = await db
      .insert(matchConvocatorias)
      .values(
        inputs.map((i) => ({
          match_id: i.match_id,
          player_id: i.player_id,
          team_id: i.team_id,
          sent_by: i.sent_by,
        })),
      )
      .onConflictDoUpdate({
        target: [matchConvocatorias.match_id, matchConvocatorias.player_id],
        set: { response: 'pending', responded_at: null },
      })
      .returning()
    return rows.map(rowToConvocatoria)
  }

  async findById(id: string): Promise<Convocatoria | null> {
    const [row] = await db
      .select()
      .from(matchConvocatorias)
      .where(eq(matchConvocatorias.id, id))
      .limit(1)
    return row ? rowToConvocatoria(row) : null
  }

  async findByMatchAndPlayer(matchId: string, playerId: string): Promise<Convocatoria | null> {
    const [row] = await db
      .select()
      .from(matchConvocatorias)
      .where(
        and(eq(matchConvocatorias.match_id, matchId), eq(matchConvocatorias.player_id, playerId)),
      )
      .limit(1)
    return row ? rowToConvocatoria(row) : null
  }

  async listByMatch(matchId: string): Promise<Convocatoria[]> {
    const rows = await db
      .select()
      .from(matchConvocatorias)
      .where(eq(matchConvocatorias.match_id, matchId))
    return rows.map(rowToConvocatoria)
  }

  async updateResponse(
    id: string,
    response: ConvocatoriaResponse,
    respondedAt: Date,
  ): Promise<Convocatoria> {
    const [row] = await db
      .update(matchConvocatorias)
      .set({ response, responded_at: respondedAt })
      .where(eq(matchConvocatorias.id, id))
      .returning()
    // biome-ignore lint/style/noNonNullAssertion: update on existing row always returns one result
    return rowToConvocatoria(row!)
  }
}
