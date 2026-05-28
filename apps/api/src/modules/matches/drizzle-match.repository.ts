import { and, eq, or } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { matches } from '@/shared/db/schemas'
import type { CreateMatchInput, ListMatchesFilters, Match, UpdateMatchInput } from './match.entity'
import type { IMatchRepository } from './match.repository'

function rowToMatch(row: typeof matches.$inferSelect): Match {
  return {
    id: row.id,
    tournament_id: row.tournament_id,
    home_team_id: row.home_team_id,
    away_team_id: row.away_team_id,
    venue_id: row.venue_id,
    round_id: row.round_id,
    status: row.status,
    home_score: row.home_score,
    away_score: row.away_score,
    winner_team_id: row.winner_team_id,
    scheduled_at: row.scheduled_at,
    started_at: row.started_at,
    ended_at: row.ended_at,
    referee_session_token: row.referee_session_token,
    next_match_id: row.next_match_id,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export class DrizzleMatchRepository implements IMatchRepository {
  async create(input: CreateMatchInput): Promise<Match> {
    const [row] = await db
      .insert(matches)
      .values({
        tournament_id: input.tournament_id,
        home_team_id: input.home_team_id,
        away_team_id: input.away_team_id,
        scheduled_at: input.scheduled_at,
        venue_id: input.venue_id ?? null,
        round_id: input.round_id ?? null,
        notes: input.notes ?? null,
        status: 'scheduled',
        referee_session_token: crypto.randomUUID(),
      })
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
    return rowToMatch(row!)
  }

  async findById(id: string): Promise<Match | null> {
    const [row] = await db.select().from(matches).where(eq(matches.id, id)).limit(1)
    return row ? rowToMatch(row) : null
  }

  async findByRefereeToken(token: string): Promise<Match | null> {
    const [row] = await db
      .select()
      .from(matches)
      .where(eq(matches.referee_session_token, token))
      .limit(1)
    return row ? rowToMatch(row) : null
  }

  async listByTournament(tournamentId: string, filters?: ListMatchesFilters): Promise<Match[]> {
    const conditions = [eq(matches.tournament_id, tournamentId)]

    if (filters?.status) {
      conditions.push(eq(matches.status, filters.status))
    }

    if (filters?.round_id) {
      conditions.push(eq(matches.round_id, filters.round_id))
    }

    if (filters?.team_id) {
      conditions.push(
        or(
          eq(matches.home_team_id, filters.team_id),
          eq(matches.away_team_id, filters.team_id),
        ) as ReturnType<typeof eq>,
      )
    }

    const rows = await db
      .select()
      .from(matches)
      .where(and(...conditions))
      .orderBy(matches.scheduled_at)

    return rows.map(rowToMatch)
  }

  async update(id: string, patch: UpdateMatchInput): Promise<Match> {
    const [row] = await db
      .update(matches)
      .set({
        ...(patch.scheduled_at !== undefined && { scheduled_at: patch.scheduled_at }),
        ...(patch.venue_id !== undefined && { venue_id: patch.venue_id }),
        ...(patch.notes !== undefined && { notes: patch.notes }),
        updated_at: new Date(),
      })
      .where(eq(matches.id, id))
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: update on existing row always returns
    return rowToMatch(row!)
  }

  async updateStatus(
    id: string,
    status: Match['status'],
    extra?: Partial<
      Pick<Match, 'home_score' | 'away_score' | 'winner_team_id' | 'started_at' | 'ended_at'>
    >,
  ): Promise<Match> {
    const [row] = await db
      .update(matches)
      .set({
        status,
        ...(extra?.home_score !== undefined && { home_score: extra.home_score }),
        ...(extra?.away_score !== undefined && { away_score: extra.away_score }),
        ...(extra?.winner_team_id !== undefined && { winner_team_id: extra.winner_team_id }),
        ...(extra?.started_at !== undefined && { started_at: extra.started_at }),
        ...(extra?.ended_at !== undefined && { ended_at: extra.ended_at }),
        updated_at: new Date(),
      })
      .where(eq(matches.id, id))
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: update on existing row always returns
    return rowToMatch(row!)
  }
}
