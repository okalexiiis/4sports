import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { sports, tournamentFormats, tournaments, tournamentVenues } from '@/shared/db/schemas'
import { ORG_IDS, TOURNAMENT_IDS, VENUE_IDS } from './ids'
import { type UserIds, userId } from './users'

const DAY = 24 * 60 * 60 * 1000

async function sportIdBySlug(slug: string) {
  const row = await db.select({ id: sports.id }).from(sports).where(eq(sports.slug, slug)).limit(1)
  return row[0]?.id ?? null
}

async function formatIdBySlug(slug: string) {
  const row = await db
    .select({ id: tournamentFormats.id })
    .from(tournamentFormats)
    .where(eq(tournamentFormats.slug, slug))
    .limit(1)
  return row[0]?.id ?? null
}

const FUTBOL_SETTINGS = {
  points_win: 3,
  points_draw: 1,
  points_loss: 0,
  tiebreaker: ['points', 'goal_difference', 'goals_for', 'head_to_head'],
  walkover_score: { winner: 3, loser: 0 },
  has_third_place_match: false,
  dispute_window_hours: 48,
}

// Three tournaments covering different UI states: an active round-robin league
// (the one wired to teams/matches/standings), an open-registration cup, and a
// draft. Idempotent via fixed PK / unique(org, slug).
export async function seedDummyTournaments(userIds: UserIds) {
  const now = Date.now()
  const organizerId = userId(userIds, 'organizer')
  const futbolId = await sportIdBySlug('futbol')
  const basquetId = await sportIdBySlug('basquetbol')
  const roundRobinId = await formatIdBySlug('round_robin')
  const singleElimId = await formatIdBySlug('single_elimination')

  await db
    .insert(tournaments)
    .values([
      {
        id: TOURNAMENT_IDS.ligaApertura,
        organization_id: ORG_IDS.ligaMonterrey,
        sport_id: futbolId,
        format_id: roundRobinId,
        name: 'Liga Apertura 2026',
        slug: 'liga-apertura-2026',
        description: 'Liga de fútbol round-robin con 4 equipos.',
        status: 'active',
        tags: ['Varonil', 'Primera Fuerza'],
        settings: FUTBOL_SETTINGS,
        min_teams: 4,
        max_teams: 8,
        min_players_per_team: 5,
        max_players_per_team: 18,
        is_public: true,
        requires_approval: true,
        created_under_plan: 'free',
        wizard_step: 5,
        wizard_completed_at: new Date(now - 30 * DAY),
        starts_at: new Date(now - 14 * DAY),
        ends_at: new Date(now + 30 * DAY),
        registration_opens_at: new Date(now - 45 * DAY),
        registration_closes_at: new Date(now - 15 * DAY),
        created_by: organizerId,
      },
      {
        id: TOURNAMENT_IDS.copaRelampago,
        organization_id: ORG_IDS.ligaMonterrey,
        sport_id: basquetId,
        format_id: singleElimId,
        name: 'Copa Relámpago',
        slug: 'copa-relampago',
        description: 'Torneo de básquetbol de eliminación directa, inscripciones abiertas.',
        status: 'open_registration',
        settings: { points_win: 1, points_draw: 0, points_loss: 0, tiebreaker: ['pct'] },
        min_teams: 4,
        max_teams: 16,
        is_public: true,
        requires_approval: true,
        created_under_plan: 'free',
        wizard_step: 5,
        wizard_completed_at: new Date(now - 5 * DAY),
        registration_opens_at: new Date(now - 5 * DAY),
        registration_closes_at: new Date(now + 10 * DAY),
        starts_at: new Date(now + 14 * DAY),
        created_by: organizerId,
      },
      {
        id: TOURNAMENT_IDS.borrador,
        organization_id: ORG_IDS.ligaMonterrey,
        sport_id: futbolId,
        format_id: roundRobinId,
        name: 'Torneo Borrador',
        slug: 'torneo-borrador',
        description: 'Torneo en construcción (draft).',
        status: 'draft',
        wizard_step: 2,
        is_public: false,
        created_by: organizerId,
      },
    ])
    .onConflictDoNothing()

  // tournament_venues has no unique constraint, so use fixed PKs for idempotency.
  await db
    .insert(tournamentVenues)
    .values([
      {
        id: '00000009-0000-4000-8000-000000000001',
        tournament_id: TOURNAMENT_IDS.ligaApertura,
        venue_id: VENUE_IDS.estadioNorte,
        is_primary: true,
      },
      {
        id: '00000009-0000-4000-8000-000000000002',
        tournament_id: TOURNAMENT_IDS.ligaApertura,
        venue_id: VENUE_IDS.canchaSur,
        is_primary: false,
      },
    ])
    .onConflictDoNothing()
}
