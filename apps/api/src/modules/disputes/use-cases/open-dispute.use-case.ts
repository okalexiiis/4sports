import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matches, tournaments } from '@/shared/db/schemas'
import type { Dispute } from '../dispute.entity'
import type { IDisputeRepository } from '../dispute.repository'
import { DisputeErrors } from '../errors'

const DEFAULT_WINDOW_HOURS = 24

export interface OpenDisputeInput {
  matchId: string
  userId: string
  reason: string
  description: string
  evidenceUrls?: string[]
}

export async function openDispute(
  repo: IDisputeRepository,
  input: OpenDisputeInput,
): Promise<Result<Dispute>> {
  const [match] = await db.select().from(matches).where(eq(matches.id, input.matchId)).limit(1)
  if (!match) return err(DisputeErrors.matchNotFound(input.matchId))

  if (match.status !== 'finished') return err(DisputeErrors.matchNotFinished(match.status))

  const [tournament] = await db
    .select({ settings: tournaments.settings })
    .from(tournaments)
    .where(eq(tournaments.id, match.tournament_id))
    .limit(1)

  const settings = tournament?.settings as Record<string, unknown> | undefined
  const windowHours =
    typeof settings?.dispute_window_hours === 'number'
      ? settings.dispute_window_hours
      : DEFAULT_WINDOW_HOURS

  const endedAt = match.ended_at ?? match.updated_at
  const windowMs = windowHours * 60 * 60 * 1000
  if (Date.now() - endedAt.getTime() > windowMs) {
    return err(DisputeErrors.windowExpired(windowHours))
  }

  const existing = await repo.findOpenByMatch(input.matchId)
  if (existing) return err(DisputeErrors.alreadyOpen(input.matchId))

  // Mark match as disputed
  await db.update(matches).set({ status: 'disputed' }).where(eq(matches.id, input.matchId))

  const dispute = await repo.create({
    match_id: input.matchId,
    opened_by: input.userId,
    reason: input.reason,
    description: input.description,
    evidence_urls: input.evidenceUrls,
  })

  return ok(dispute)
}
