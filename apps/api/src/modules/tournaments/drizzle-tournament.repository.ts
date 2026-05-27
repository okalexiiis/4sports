import { and, count, eq, ilike, inArray, isNull, ne, sql } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import {
  organizations,
  organizerSubscriptions,
  sports,
  subscriptionPlans,
  tournamentFormats,
  tournamentMetrics,
  tournaments,
} from '@/shared/db/schemas'
import type {
  CreateTournamentInput,
  OrgContext,
  PaginatedTournaments,
  PublicTournamentFilters,
  PublishTournamentInput,
  Tournament,
  TournamentFilters,
  UpdateTournamentInput,
} from './tournament.entity'
import type { ITournamentRepository } from './tournament.repository'

function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

function rowToTournament(row: {
  id: string
  organization_id: string
  name: string
  slug: string
  description: string | null
  banner_url: string | null
  rules_pdf_url: string | null
  tags: string[]
  status: string
  gender_restriction: string
  validation_mode: string
  eligibility_mode: string
  settings: unknown
  player_fields: unknown
  max_teams: number | null
  min_teams: number | null
  min_players_per_team: number | null
  max_players_per_team: number | null
  is_public: boolean
  requires_approval: boolean
  join_code: string | null
  created_under_plan: string | null
  wizard_step: number
  starts_at: Date | null
  ends_at: Date | null
  registration_opens_at: Date | null
  registration_closes_at: Date | null
  created_by: string
  created_at: Date
  updated_at: Date
  sport_id: string | null
  sport_name: string | null
  sport_slug: string | null
  sport_icon_url: string | null
  format_id: string | null
  format_name: string | null
  format_slug: string | null
}): Tournament {
  return {
    id: row.id,
    organization_id: row.organization_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    banner_url: row.banner_url,
    rules_pdf_url: row.rules_pdf_url,
    tags: row.tags,
    status: row.status,
    gender_restriction: row.gender_restriction,
    validation_mode: row.validation_mode,
    eligibility_mode: row.eligibility_mode,
    settings: (row.settings as Record<string, unknown>) ?? {},
    player_fields: (row.player_fields as Record<string, unknown>) ?? {},
    max_teams: row.max_teams,
    min_teams: row.min_teams,
    min_players_per_team: row.min_players_per_team,
    max_players_per_team: row.max_players_per_team,
    is_public: row.is_public,
    requires_approval: row.requires_approval,
    join_code: row.join_code,
    created_under_plan: row.created_under_plan,
    wizard_step: row.wizard_step,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    registration_opens_at: row.registration_opens_at,
    registration_closes_at: row.registration_closes_at,
    sport:
      row.sport_id && row.sport_name && row.sport_slug
        ? {
            id: row.sport_id,
            name: row.sport_name,
            slug: row.sport_slug,
            icon_url: row.sport_icon_url,
          }
        : null,
    format:
      row.format_id && row.format_name && row.format_slug
        ? { id: row.format_id, name: row.format_name, slug: row.format_slug }
        : null,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

const tournamentSelect = {
  id: tournaments.id,
  organization_id: tournaments.organization_id,
  name: tournaments.name,
  slug: tournaments.slug,
  description: tournaments.description,
  banner_url: tournaments.banner_url,
  rules_pdf_url: tournaments.rules_pdf_url,
  tags: tournaments.tags,
  status: tournaments.status,
  gender_restriction: tournaments.gender_restriction,
  validation_mode: tournaments.validation_mode,
  eligibility_mode: tournaments.eligibility_mode,
  settings: tournaments.settings,
  player_fields: tournaments.player_fields,
  max_teams: tournaments.max_teams,
  min_teams: tournaments.min_teams,
  min_players_per_team: tournaments.min_players_per_team,
  max_players_per_team: tournaments.max_players_per_team,
  is_public: tournaments.is_public,
  requires_approval: tournaments.requires_approval,
  join_code: tournaments.join_code,
  created_under_plan: tournaments.created_under_plan,
  wizard_step: tournaments.wizard_step,
  starts_at: tournaments.starts_at,
  ends_at: tournaments.ends_at,
  registration_opens_at: tournaments.registration_opens_at,
  registration_closes_at: tournaments.registration_closes_at,
  created_by: tournaments.created_by,
  created_at: tournaments.created_at,
  updated_at: tournaments.updated_at,
  sport_id: sports.id,
  sport_name: sports.name,
  sport_slug: sports.slug,
  sport_icon_url: sports.icon_url,
  format_id: tournamentFormats.id,
  format_name: tournamentFormats.name,
  format_slug: tournamentFormats.slug,
}

export class DrizzleTournamentRepository implements ITournamentRepository {
  async create(userId: string, orgId: string, data: CreateTournamentInput): Promise<Tournament> {
    const [row] = await db
      .insert(tournaments)
      .values({
        organization_id: orgId,
        created_by: userId,
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        sport_id: data.sport_id ?? null,
        format_id: data.format_id ?? null,
        tags: data.tags ?? [],
        settings: data.settings ?? {},
        player_fields: data.player_fields ?? {},
        max_teams: data.max_teams ?? null,
        min_teams: data.min_teams ?? null,
        min_players_per_team: data.min_players_per_team ?? null,
        max_players_per_team: data.max_players_per_team ?? null,
        is_public: data.is_public ?? true,
        requires_approval: data.requires_approval ?? true,
        gender_restriction:
          (data.gender_restriction as 'none' | 'male' | 'female' | 'mixed') ?? 'none',
        validation_mode: (data.validation_mode as 'strict' | 'flexible' | 'hybrid') ?? 'hybrid',
        eligibility_mode: (data.eligibility_mode as 'strict' | 'flexible') ?? 'flexible',
        starts_at: data.starts_at ? new Date(data.starts_at) : null,
        ends_at: data.ends_at ? new Date(data.ends_at) : null,
        registration_opens_at: data.registration_opens_at
          ? new Date(data.registration_opens_at)
          : null,
        registration_closes_at: data.registration_closes_at
          ? new Date(data.registration_closes_at)
          : null,
        status: 'draft',
        wizard_step: 1,
      })
      .returning({ id: tournaments.id })

    // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
    return this.findById(row!.id) as Promise<Tournament>
  }

  async findById(id: string): Promise<Tournament | null> {
    const [row] = await db
      .select(tournamentSelect)
      .from(tournaments)
      .leftJoin(sports, eq(tournaments.sport_id, sports.id))
      .leftJoin(tournamentFormats, eq(tournaments.format_id, tournamentFormats.id))
      .where(and(eq(tournaments.id, id), isNull(tournaments.deleted_at)))
      .limit(1)

    if (!row) return null
    return rowToTournament(row)
  }

  async update(id: string, data: UpdateTournamentInput): Promise<Tournament> {
    const updateValues: Partial<typeof tournaments.$inferInsert> = { updated_at: new Date() }

    if (data.name !== undefined) updateValues.name = data.name
    if (data.description !== undefined) updateValues.description = data.description
    if (data.sport_id !== undefined) updateValues.sport_id = data.sport_id
    if (data.format_id !== undefined) updateValues.format_id = data.format_id
    if (data.tags !== undefined) updateValues.tags = data.tags
    if (data.settings !== undefined) updateValues.settings = data.settings
    if (data.player_fields !== undefined) updateValues.player_fields = data.player_fields
    if (data.max_teams !== undefined) updateValues.max_teams = data.max_teams
    if (data.min_teams !== undefined) updateValues.min_teams = data.min_teams
    if (data.min_players_per_team !== undefined)
      updateValues.min_players_per_team = data.min_players_per_team
    if (data.max_players_per_team !== undefined)
      updateValues.max_players_per_team = data.max_players_per_team
    if (data.is_public !== undefined) updateValues.is_public = data.is_public
    if (data.requires_approval !== undefined)
      updateValues.requires_approval = data.requires_approval
    if (data.gender_restriction !== undefined)
      updateValues.gender_restriction = data.gender_restriction as
        | 'none'
        | 'male'
        | 'female'
        | 'mixed'
    if (data.validation_mode !== undefined)
      updateValues.validation_mode = data.validation_mode as 'strict' | 'flexible' | 'hybrid'
    if (data.eligibility_mode !== undefined)
      updateValues.eligibility_mode = data.eligibility_mode as 'strict' | 'flexible'
    if (data.wizard_step !== undefined) updateValues.wizard_step = data.wizard_step
    if (data.starts_at !== undefined)
      updateValues.starts_at = data.starts_at ? new Date(data.starts_at) : null
    if (data.ends_at !== undefined)
      updateValues.ends_at = data.ends_at ? new Date(data.ends_at) : null
    if (data.registration_opens_at !== undefined)
      updateValues.registration_opens_at = data.registration_opens_at
        ? new Date(data.registration_opens_at)
        : null
    if (data.registration_closes_at !== undefined)
      updateValues.registration_closes_at = data.registration_closes_at
        ? new Date(data.registration_closes_at)
        : null

    await db.update(tournaments).set(updateValues).where(eq(tournaments.id, id))

    return this.findById(id) as Promise<Tournament>
  }

  async publish(id: string, opts: PublishTournamentInput): Promise<Tournament> {
    const joinCode = generateJoinCode()
    const newStatus = opts.visibility === 'public' ? 'open_registration' : 'private'

    return db.transaction(async (tx) => {
      await tx
        .update(tournaments)
        .set({
          status: newStatus as 'open_registration' | 'private',
          created_under_plan: opts.planSlug,
          join_code: joinCode,
          updated_at: new Date(),
        })
        .where(eq(tournaments.id, id))

      // Create tournament_metrics from sport metadata tiebreaker keys if sport is set
      if (opts.sportMetadata) {
        const tiebreakers = (opts.sportMetadata.tiebreaker as string[] | undefined) ?? []
        if (tiebreakers.length > 0) {
          await tx
            .insert(tournamentMetrics)
            .values(
              tiebreakers.map((key) => ({
                tournament_id: id,
                metric_key: key,
                metric_name: key,
                is_enabled: true,
              })),
            )
            .onConflictDoNothing()
        }
      }

      const [row] = await tx
        .select(tournamentSelect)
        .from(tournaments)
        .leftJoin(sports, eq(tournaments.sport_id, sports.id))
        .leftJoin(tournamentFormats, eq(tournaments.format_id, tournamentFormats.id))
        .where(eq(tournaments.id, id))
        .limit(1)

      // biome-ignore lint/style/noNonNullAssertion: row exists since we just updated it
      return rowToTournament(row!)
    })
  }

  async listByOrg(orgId: string, filters: TournamentFilters): Promise<PaginatedTournaments> {
    const { status, tags, page, limit } = filters
    const offset = (page - 1) * limit

    const conditions = [eq(tournaments.organization_id, orgId), isNull(tournaments.deleted_at)]

    if (status) {
      conditions.push(
        eq(
          tournaments.status,
          status as 'draft' | 'open_registration' | 'active' | 'completed' | 'archived' | 'private',
        ),
      )
    }
    if (tags && tags.length > 0) {
      conditions.push(
        sql`${tournaments.tags} && ARRAY[${sql.join(
          tags.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[]`,
      )
    }

    const where = and(...conditions)

    const [rows, [countRow]] = await Promise.all([
      db
        .select(tournamentSelect)
        .from(tournaments)
        .leftJoin(sports, eq(tournaments.sport_id, sports.id))
        .leftJoin(tournamentFormats, eq(tournaments.format_id, tournamentFormats.id))
        .where(where)
        .orderBy(tournaments.created_at)
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(tournaments).where(where),
    ])

    const total = Number(countRow?.count ?? 0)
    const total_pages = Math.ceil(total / limit)

    return {
      items: rows.map(rowToTournament),
      meta: { page, limit, total, total_pages, has_next: page < total_pages, has_prev: page > 1 },
    }
  }

  async listPublic(filters: PublicTournamentFilters): Promise<PaginatedTournaments> {
    const { sport, city, tags, q, page, limit } = filters
    const offset = (page - 1) * limit

    const conditions = [
      eq(tournaments.is_public, true),
      inArray(tournaments.status, ['open_registration', 'active']),
      isNull(tournaments.deleted_at),
    ]

    if (q) conditions.push(ilike(tournaments.name, `%${q}%`))
    if (tags && tags.length > 0) {
      conditions.push(
        sql`${tournaments.tags} && ARRAY[${sql.join(
          tags.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[]`,
      )
    }

    const where = and(...conditions)

    // sport and city filters require joins — build base query with those joins
    const baseQuery = db
      .select(tournamentSelect)
      .from(tournaments)
      .leftJoin(sports, eq(tournaments.sport_id, sports.id))
      .leftJoin(tournamentFormats, eq(tournaments.format_id, tournamentFormats.id))
      .leftJoin(organizations, eq(tournaments.organization_id, organizations.id))
      .where(
        and(
          where,
          sport ? eq(sports.slug, sport) : undefined,
          city ? ilike(organizations.city, city) : undefined,
        ),
      )

    const [rows, [countRow]] = await Promise.all([
      baseQuery.orderBy(tournaments.created_at).limit(limit).offset(offset),
      db
        .select({ count: count() })
        .from(tournaments)
        .leftJoin(sports, eq(tournaments.sport_id, sports.id))
        .leftJoin(organizations, eq(tournaments.organization_id, organizations.id))
        .where(
          and(
            where,
            sport ? eq(sports.slug, sport) : undefined,
            city ? ilike(organizations.city, city) : undefined,
          ),
        ),
    ])

    const total = Number(countRow?.count ?? 0)
    const total_pages = Math.ceil(total / limit)

    return {
      items: rows.map(rowToTournament),
      meta: { page, limit, total, total_pages, has_next: page < total_pages, has_prev: page > 1 },
    }
  }

  async isSlugTaken(slug: string, orgId: string, excludeId?: string): Promise<boolean> {
    const conditions = [
      eq(tournaments.slug, slug),
      eq(tournaments.organization_id, orgId),
      isNull(tournaments.deleted_at),
    ]
    if (excludeId) conditions.push(ne(tournaments.id, excludeId))

    const [row] = await db
      .select({ id: tournaments.id })
      .from(tournaments)
      .where(and(...conditions))
      .limit(1)

    return row !== undefined
  }

  async findOrgContext(tournamentId: string): Promise<OrgContext | null> {
    const [row] = await db
      .select({
        orgId: organizations.id,
        planSlug: subscriptionPlans.slug,
        planFeatures: subscriptionPlans.features,
      })
      .from(tournaments)
      .innerJoin(organizations, eq(tournaments.organization_id, organizations.id))
      .innerJoin(
        organizerSubscriptions,
        eq(organizerSubscriptions.organization_id, organizations.id),
      )
      .innerJoin(subscriptionPlans, eq(organizerSubscriptions.plan_id, subscriptionPlans.id))
      .where(
        and(
          eq(tournaments.id, tournamentId),
          inArray(organizerSubscriptions.status, ['active', 'trialing']),
          isNull(tournaments.deleted_at),
        ),
      )
      .limit(1)

    if (!row) return null

    return {
      orgId: row.orgId,
      planSlug: row.planSlug,
      planFeatures: (row.planFeatures as Record<string, unknown>) ?? {},
    }
  }

  async countActiveByOrg(orgId: string): Promise<number> {
    const [row] = await db
      .select({ count: count() })
      .from(tournaments)
      .where(
        and(
          eq(tournaments.organization_id, orgId),
          inArray(tournaments.status, ['open_registration', 'active']),
          isNull(tournaments.deleted_at),
        ),
      )

    return Number(row?.count ?? 0)
  }
}
