import { and, eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matchDisputes } from '@/shared/db/schemas'
import type { Dispute } from './dispute.entity'
import type {
  CreateDisputeInput,
  IDisputeRepository,
  ResolveDisputeInput,
} from './dispute.repository'

function rowToDispute(row: typeof matchDisputes.$inferSelect): Dispute {
  const override = row.final_score_override as { home: number; away: number } | null
  return {
    id: row.id,
    match_id: row.match_id,
    opened_by: row.opened_by,
    reason: row.reason,
    description: row.description,
    evidence_urls: row.evidence_urls ?? null,
    status: row.status as Dispute['status'],
    resolution_notes: row.resolution_notes,
    final_score_override: override,
    resolved_by: row.resolved_by,
    resolved_at: row.resolved_at,
    created_at: row.created_at,
  }
}

export class DrizzleDisputeRepository implements IDisputeRepository {
  async create(input: CreateDisputeInput): Promise<Dispute> {
    const [row] = await db
      .insert(matchDisputes)
      .values({
        match_id: input.match_id,
        opened_by: input.opened_by,
        reason: input.reason,
        description: input.description,
        evidence_urls: input.evidence_urls ?? null,
      })
      .returning()
    // biome-ignore lint/style/noNonNullAssertion: insert + returning always yields one row
    return rowToDispute(row!)
  }

  async findById(id: string): Promise<Dispute | null> {
    const [row] = await db.select().from(matchDisputes).where(eq(matchDisputes.id, id)).limit(1)
    return row ? rowToDispute(row) : null
  }

  async findOpenByMatch(matchId: string): Promise<Dispute | null> {
    const [row] = await db
      .select()
      .from(matchDisputes)
      .where(and(eq(matchDisputes.match_id, matchId), eq(matchDisputes.status, 'open')))
      .limit(1)
    return row ? rowToDispute(row) : null
  }

  async listByMatch(matchId: string): Promise<Dispute[]> {
    const rows = await db.select().from(matchDisputes).where(eq(matchDisputes.match_id, matchId))
    return rows.map(rowToDispute)
  }

  async resolve(id: string, input: ResolveDisputeInput): Promise<Dispute> {
    const [row] = await db
      .update(matchDisputes)
      .set({
        status: 'resolved',
        resolution_notes: input.resolution_notes,
        final_score_override: input.final_score_override ?? null,
        resolved_by: input.resolved_by,
        resolved_at: input.resolved_at,
      })
      .where(eq(matchDisputes.id, id))
      .returning()
    // biome-ignore lint/style/noNonNullAssertion: update on existing row always returns one result
    return rowToDispute(row!)
  }
}
