import { db } from '@/shared/db/client'
import {
  sports,
  tournamentFormats,
  tournamentMetrics,
  tournaments,
  tournamentVenues,
  venues,
} from '@/shared/db/schemas'
import { ORG_IDS } from './organizations'
import { USER_IDS } from './users'

export const TOURNAMENT_IDS = {
  ligaVerano: '00000020-0000-0000-0000-000000000001',
  copaInvierno: '00000020-0000-0000-0000-000000000002',
  borrador: '00000020-0000-0000-0000-000000000003',
  torneoSonora: '00000020-0000-0000-0000-000000000004',
} as const

export const VENUE_IDS = {
  estadioHermosillo: '00000025-0000-0000-0000-000000000001',
  campoMunicipal: '00000025-0000-0000-0000-000000000002',
} as const

const FOOTBALL_SETTINGS = {
  points_win: 3,
  points_draw: 1,
  points_loss: 0,
  tiebreaker: ['points', 'goal_difference', 'goals_for', 'head_to_head', 'fair_play'],
  walkover_score: { winner: 3, loser: 0 },
  has_third_place_match: false,
  dispute_window_hours: 48,
}

const PLAYER_FIELDS = {
  sex: { visible: true, required: true },
  birth_date: { visible: true, required: false },
  jersey_number: { visible: true, required: false },
}

export async function seedDummyTournaments() {
  const sportRows = await db.select({ id: sports.id, slug: sports.slug }).from(sports)

  const formatRows = await db
    .select({ id: tournamentFormats.id, slug: tournamentFormats.slug })
    .from(tournamentFormats)

  const sportId = (slug: string) => {
    const s = sportRows.find((r) => r.slug === slug)
    if (!s) throw new Error(`Sport '${slug}' not found — run db:seed first`)
    return s.id
  }

  const formatId = (slug: string) => {
    const f = formatRows.find((r) => r.slug === slug)
    if (!f) throw new Error(`Format '${slug}' not found — run db:seed first`)
    return f.id
  }

  const futbolId = sportId('futbol')
  const rrFormatId = formatId('round_robin')
  const seFormatId = formatId('single_elimination')

  const regOpen = new Date('2025-06-01T00:00:00Z')
  const regClose = new Date('2025-06-30T23:59:59Z')
  const starts = new Date('2025-07-05T10:00:00Z')
  const ends = new Date('2025-09-28T20:00:00Z')

  await db
    .insert(tournaments)
    .values([
      {
        id: TOURNAMENT_IDS.ligaVerano,
        organization_id: ORG_IDS.ligaHermosillo,
        sport_id: futbolId,
        format_id: rrFormatId,
        name: 'Liga Verano 2025',
        slug: 'liga-verano-2025',
        description: 'Liga de fútbol varonil temporada verano. Round Robin, 3 vueltas.',
        tags: ['Varonil', 'Libre'],
        status: 'open_registration',
        gender_restriction: 'male',
        validation_mode: 'hybrid',
        eligibility_mode: 'strict',
        settings: FOOTBALL_SETTINGS,
        player_fields: PLAYER_FIELDS,
        max_teams: 12,
        min_teams: 6,
        min_players_per_team: 7,
        max_players_per_team: 18,
        is_public: true,
        requires_approval: true,
        join_code: 'LV2025',
        created_under_plan: 'pro',
        wizard_step: 6,
        wizard_completed_at: new Date('2025-05-20T12:00:00Z'),
        registration_opens_at: regOpen,
        registration_closes_at: regClose,
        starts_at: starts,
        ends_at: ends,
        created_by: USER_IDS.alexis,
      },
      {
        id: TOURNAMENT_IDS.copaInvierno,
        organization_id: ORG_IDS.ligaHermosillo,
        sport_id: futbolId,
        format_id: seFormatId,
        name: 'Copa Invierno 2025',
        slug: 'copa-invierno-2025',
        description: 'Torneo de eliminación directa. 8 equipos.',
        tags: ['Varonil', 'Sub-30'],
        status: 'active',
        gender_restriction: 'male',
        validation_mode: 'strict',
        eligibility_mode: 'strict',
        settings: { ...FOOTBALL_SETTINGS, has_third_place_match: true },
        player_fields: PLAYER_FIELDS,
        max_teams: 8,
        min_teams: 8,
        min_players_per_team: 7,
        max_players_per_team: 18,
        is_public: true,
        requires_approval: false,
        join_code: 'CI2025',
        created_under_plan: 'pro',
        wizard_step: 6,
        wizard_completed_at: new Date('2025-10-01T09:00:00Z'),
        starts_at: new Date('2025-11-01T10:00:00Z'),
        ends_at: new Date('2025-12-20T20:00:00Z'),
        created_by: USER_IDS.alexis,
      },
      {
        id: TOURNAMENT_IDS.borrador,
        organization_id: ORG_IDS.ligaHermosillo,
        name: 'Torneo Borrador',
        slug: 'torneo-borrador',
        status: 'draft',
        settings: {},
        player_fields: {},
        is_public: false,
        requires_approval: true,
        wizard_step: 2,
        created_by: USER_IDS.josue,
      },
      {
        id: TOURNAMENT_IDS.torneoSonora,
        organization_id: ORG_IDS.clubSonora,
        sport_id: futbolId,
        format_id: rrFormatId,
        name: 'Torneo Sonora Abierto',
        slug: 'torneo-sonora-abierto',
        description: 'Torneo abierto al público en general.',
        tags: ['Mixto', 'Abierto'],
        status: 'open_registration',
        gender_restriction: 'none',
        validation_mode: 'flexible',
        eligibility_mode: 'flexible',
        settings: FOOTBALL_SETTINGS,
        player_fields: PLAYER_FIELDS,
        max_teams: 8,
        min_teams: 4,
        min_players_per_team: 6,
        max_players_per_team: 15,
        is_public: true,
        requires_approval: false,
        join_code: 'SON25',
        created_under_plan: 'free',
        wizard_step: 6,
        wizard_completed_at: new Date('2025-09-01T08:00:00Z'),
        starts_at: new Date('2025-10-15T10:00:00Z'),
        created_by: USER_IDS.ivan,
      },
    ])
    .onConflictDoNothing()

  const footballMetrics = [
    { key: 'goals', name: 'Goles' },
    { key: 'assists', name: 'Asistencias' },
    { key: 'yellow_cards', name: 'Tarjetas amarillas' },
    { key: 'red_cards', name: 'Tarjetas rojas' },
  ]

  for (const tid of [
    TOURNAMENT_IDS.ligaVerano,
    TOURNAMENT_IDS.copaInvierno,
    TOURNAMENT_IDS.torneoSonora,
  ]) {
    await db
      .insert(tournamentMetrics)
      .values(
        footballMetrics.map((m) => ({
          tournament_id: tid,
          metric_key: m.key,
          metric_name: m.name,
          is_enabled: true,
        })),
      )
      .onConflictDoNothing()
  }

  await db
    .insert(venues)
    .values([
      {
        id: VENUE_IDS.estadioHermosillo,
        organization_id: ORG_IDS.ligaHermosillo,
        name: 'Estadio Hermosillo',
        address: 'Blvd. Solidaridad 101',
        city: 'Hermosillo',
        country_code: 'MX',
        capacity: 500,
        created_by: USER_IDS.alexis,
      },
      {
        id: VENUE_IDS.campoMunicipal,
        organization_id: ORG_IDS.ligaHermosillo,
        name: 'Campo Municipal Norte',
        address: 'Calle Deportiva 45',
        city: 'Hermosillo',
        country_code: 'MX',
        capacity: 200,
        created_by: USER_IDS.alexis,
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(tournamentVenues)
    .values([
      {
        tournament_id: TOURNAMENT_IDS.ligaVerano,
        venue_id: VENUE_IDS.estadioHermosillo,
        is_primary: true,
      },
      {
        tournament_id: TOURNAMENT_IDS.ligaVerano,
        venue_id: VENUE_IDS.campoMunicipal,
        is_primary: false,
      },
      {
        tournament_id: TOURNAMENT_IDS.copaInvierno,
        venue_id: VENUE_IDS.estadioHermosillo,
        is_primary: true,
      },
    ])
    .onConflictDoNothing()
}
