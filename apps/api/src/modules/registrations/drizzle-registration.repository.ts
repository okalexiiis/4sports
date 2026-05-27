import { and, count, eq, inArray } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { feeInvoices, tournamentFeeItems, tournamentRegistrations } from '@/shared/db/schemas'
import type {
  EligibilityAlert,
  PaginatedRegistrations,
  Registration,
  RegistrationFilters,
  RegistrationStatus,
} from './registration.entity'
import type { IRegistrationRepository } from './registration.repository'

function rowToRegistration(row: typeof tournamentRegistrations.$inferSelect): Registration {
  return {
    id: row.id,
    tournament_id: row.tournament_id,
    team_id: row.team_id,
    status: row.status as RegistrationStatus,
    is_external: row.is_external,
    seed: row.seed,
    rejection_reason: row.rejection_reason,
    eligibility_alerts: (row.eligibility_alerts as EligibilityAlert[]) ?? [],
    registered_by: row.registered_by,
    reviewed_by: row.reviewed_by,
    reviewed_at: row.reviewed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export class DrizzleRegistrationRepository implements IRegistrationRepository {
  async create(
    tournamentId: string,
    teamId: string,
    registeredBy: string,
    alerts: EligibilityAlert[],
    status: RegistrationStatus,
  ): Promise<Registration> {
    const [row] = await db
      .insert(tournamentRegistrations)
      .values({
        tournament_id: tournamentId,
        team_id: teamId,
        registered_by: registeredBy,
        eligibility_alerts: alerts,
        status,
        is_external: true,
      })
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
    return rowToRegistration(row!)
  }

  async findById(id: string): Promise<Registration | null> {
    const [row] = await db
      .select()
      .from(tournamentRegistrations)
      .where(eq(tournamentRegistrations.id, id))
      .limit(1)

    return row ? rowToRegistration(row) : null
  }

  async findByTournamentAndTeam(
    tournamentId: string,
    teamId: string,
  ): Promise<Registration | null> {
    const [row] = await db
      .select()
      .from(tournamentRegistrations)
      .where(
        and(
          eq(tournamentRegistrations.tournament_id, tournamentId),
          eq(tournamentRegistrations.team_id, teamId),
        ),
      )
      .limit(1)

    return row ? rowToRegistration(row) : null
  }

  async countApprovedByTournament(tournamentId: string): Promise<number> {
    const [row] = await db
      .select({ count: count() })
      .from(tournamentRegistrations)
      .where(
        and(
          eq(tournamentRegistrations.tournament_id, tournamentId),
          eq(tournamentRegistrations.status, 'approved'),
        ),
      )

    return Number(row?.count ?? 0)
  }

  async updateStatus(
    id: string,
    status: RegistrationStatus,
    opts?: { rejectionReason?: string; reviewedBy?: string },
  ): Promise<Registration> {
    const [row] = await db
      .update(tournamentRegistrations)
      .set({
        status,
        rejection_reason: opts?.rejectionReason ?? null,
        reviewed_by: opts?.reviewedBy ?? null,
        reviewed_at: opts?.reviewedBy ? new Date() : null,
        updated_at: new Date(),
      })
      .where(eq(tournamentRegistrations.id, id))
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: row exists since we just updated it
    return rowToRegistration(row!)
  }

  async list(tournamentId: string, filters: RegistrationFilters): Promise<PaginatedRegistrations> {
    const { status, page, limit } = filters
    const offset = (page - 1) * limit

    const conditions = [eq(tournamentRegistrations.tournament_id, tournamentId)]
    if (status) {
      conditions.push(
        eq(
          tournamentRegistrations.status,
          status as 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'withdrawn',
        ),
      )
    }

    const where = and(...conditions)

    const [rows, [countRow]] = await Promise.all([
      db
        .select()
        .from(tournamentRegistrations)
        .where(where)
        .orderBy(tournamentRegistrations.created_at)
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(tournamentRegistrations).where(where),
    ])

    const total = Number(countRow?.count ?? 0)
    const total_pages = Math.ceil(total / limit)

    return {
      items: rows.map(rowToRegistration),
      meta: { page, limit, total, total_pages, has_next: page < total_pages, has_prev: page > 1 },
    }
  }

  async listFeeItems(
    tournamentId: string,
  ): Promise<{ id: string; name: string; type: string; amount: number; currency: string }[]> {
    const rows = await db
      .select({
        id: tournamentFeeItems.id,
        name: tournamentFeeItems.name,
        type: tournamentFeeItems.type,
        amount: tournamentFeeItems.amount,
        currency: tournamentFeeItems.currency,
      })
      .from(tournamentFeeItems)
      .where(
        and(
          eq(tournamentFeeItems.tournament_id, tournamentId),
          eq(tournamentFeeItems.is_active, true),
          eq(tournamentFeeItems.type, 'per_team'),
        ),
      )

    return rows
  }

  async createInvoices(registrationId: string, feeItemIds: string[]): Promise<void> {
    if (feeItemIds.length === 0) return

    const feeItems = await db
      .select()
      .from(tournamentFeeItems)
      .where(inArray(tournamentFeeItems.id, feeItemIds))

    if (feeItems.length === 0) return

    await db.insert(feeInvoices).values(
      feeItems.map((item) => ({
        registration_id: registrationId,
        fee_item_id: item.id,
        amount: item.amount,
        currency: item.currency,
        status: 'pending' as const,
      })),
    )
  }
}
