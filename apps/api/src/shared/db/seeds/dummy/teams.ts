import { db } from '@/shared/db/client'
import { players, teamMembers, teams } from '@/shared/db/schemas'
import { ORG_IDS } from './organizations'
import { USER_IDS } from './users'

export const TEAM_IDS = {
  tigresFC: '00000030-0000-0000-0000-000000000001',
  aguilasAzules: '00000030-0000-0000-0000-000000000002',
  lobosFC: '00000030-0000-0000-0000-000000000003',
  halcones: '00000030-0000-0000-0000-000000000004',
} as const

// Guest player IDs — stable for FK references in registrations seed
export const GUEST_PLAYER_IDS = {
  // Tigres FC
  tigres_p1: '00000040-0000-0000-0000-000000000001',
  tigres_p2: '00000040-0000-0000-0000-000000000002',
  tigres_p3: '00000040-0000-0000-0000-000000000003',
  // Águilas Azules
  aguilas_p1: '00000040-0000-0000-0000-000000000004',
  aguilas_p2: '00000040-0000-0000-0000-000000000005',
  aguilas_p3: '00000040-0000-0000-0000-000000000006',
  // Lobos FC
  lobos_p1: '00000040-0000-0000-0000-000000000007',
  lobos_p2: '00000040-0000-0000-0000-000000000008',
  lobos_p3: '00000040-0000-0000-0000-000000000009',
  // Halcones
  halcones_p1: '00000040-0000-0000-0000-000000000010',
  halcones_p2: '00000040-0000-0000-0000-000000000011',
  // Carlos (real user, linked player profile)
  carlos_player: '00000040-0000-0000-0000-000000000012',
} as const

export async function seedDummyTeams() {
  const now = new Date()

  await db
    .insert(teams)
    .values([
      {
        id: TEAM_IDS.tigresFC,
        organization_id: ORG_IDS.ligaHermosillo,
        name: 'Tigres FC',
        short_name: 'TIG',
        primary_color: '#FF6B00',
        secondary_color: '#000000',
        city: 'Hermosillo',
        country_code: 'MX',
        gender_type: 'male',
        join_policy: 'invite_only',
        scope: 'tournament_scoped',
        owned_by_user_id: USER_IDS.carlos,
      },
      {
        id: TEAM_IDS.aguilasAzules,
        organization_id: ORG_IDS.ligaHermosillo,
        name: 'Águilas Azules',
        short_name: 'AGA',
        primary_color: '#003087',
        secondary_color: '#FFFFFF',
        city: 'Hermosillo',
        country_code: 'MX',
        gender_type: 'male',
        join_policy: 'request',
        scope: 'tournament_scoped',
        owned_by_user_id: USER_IDS.ivan,
      },
      {
        id: TEAM_IDS.lobosFC,
        organization_id: ORG_IDS.ligaHermosillo,
        name: 'Lobos FC',
        short_name: 'LOB',
        primary_color: '#6B0000',
        secondary_color: '#CCCCCC',
        city: 'Hermosillo',
        country_code: 'MX',
        gender_type: 'male',
        join_policy: 'request',
        scope: 'tournament_scoped',
        owned_by_user_id: USER_IDS.alexis,
      },
      {
        id: TEAM_IDS.halcones,
        organization_id: ORG_IDS.ligaHermosillo,
        name: 'Halcones',
        short_name: 'HAL',
        primary_color: '#008000',
        secondary_color: '#FFD700',
        city: 'Hermosillo',
        country_code: 'MX',
        gender_type: 'male',
        join_policy: 'request',
        scope: 'tournament_scoped',
        owned_by_user_id: USER_IDS.josue,
      },
    ])
    .onConflictDoNothing()

  // Real user profile for carlos (captain of Tigres)
  await db
    .insert(players)
    .values([
      {
        id: GUEST_PLAYER_IDS.carlos_player,
        user_id: USER_IDS.carlos,
        display_name: 'Carlos Capitán',
        jersey_number: 10,
        position: 'Delantero centro',
        sex: 'male',
        date_of_birth: new Date('1997-03-15'),
        is_guest: false,
      },
      // Tigres FC guests
      {
        id: GUEST_PLAYER_IDS.tigres_p1,
        display_name: 'Miguel Torres',
        jersey_number: 1,
        position: 'Portero',
        sex: 'male',
        date_of_birth: new Date('1998-07-22'),
        is_guest: true,
        guest_created_by: USER_IDS.carlos,
      },
      {
        id: GUEST_PLAYER_IDS.tigres_p2,
        display_name: 'Ernesto Ruiz',
        jersey_number: 5,
        position: 'Defensa central',
        sex: 'male',
        date_of_birth: new Date('2000-01-10'),
        is_guest: true,
        guest_created_by: USER_IDS.carlos,
      },
      {
        id: GUEST_PLAYER_IDS.tigres_p3,
        display_name: 'Raul Medina',
        jersey_number: 8,
        position: 'Mediocampista',
        sex: 'male',
        is_guest: true,
        guest_created_by: USER_IDS.carlos,
      },
      // Águilas Azules guests
      {
        id: GUEST_PLAYER_IDS.aguilas_p1,
        display_name: 'Pedro Soto',
        jersey_number: 9,
        position: 'Delantero centro',
        sex: 'male',
        date_of_birth: new Date('1999-05-30'),
        is_guest: true,
        guest_created_by: USER_IDS.ivan,
      },
      {
        id: GUEST_PLAYER_IDS.aguilas_p2,
        display_name: 'Luis Figueroa',
        jersey_number: 3,
        position: 'Lateral izquierdo',
        sex: 'male',
        date_of_birth: new Date('2001-11-14'),
        is_guest: true,
        guest_created_by: USER_IDS.ivan,
      },
      {
        id: GUEST_PLAYER_IDS.aguilas_p3,
        display_name: 'Marco Ríos',
        jersey_number: 6,
        position: 'Mediocampista defensivo',
        sex: 'male',
        is_guest: true,
        guest_created_by: USER_IDS.ivan,
      },
      // Lobos FC guests
      {
        id: GUEST_PLAYER_IDS.lobos_p1,
        display_name: 'Héctor Vega',
        jersey_number: 7,
        position: 'Extremo derecho',
        sex: 'male',
        date_of_birth: new Date('1996-08-19'),
        is_guest: true,
        guest_created_by: USER_IDS.alexis,
      },
      {
        id: GUEST_PLAYER_IDS.lobos_p2,
        display_name: 'Andrés Mora',
        jersey_number: 4,
        position: 'Mediocampista',
        sex: 'male',
        date_of_birth: new Date('1995-02-28'),
        is_guest: true,
        guest_created_by: USER_IDS.alexis,
      },
      {
        id: GUEST_PLAYER_IDS.lobos_p3,
        display_name: 'Daniel Cruz',
        jersey_number: 11,
        position: 'Extremo izquierdo',
        sex: 'male',
        is_guest: true,
        guest_created_by: USER_IDS.alexis,
      },
      // Halcones guests
      {
        id: GUEST_PLAYER_IDS.halcones_p1,
        display_name: 'Roberto Leal',
        jersey_number: 2,
        position: 'Lateral derecho',
        sex: 'male',
        date_of_birth: new Date('2000-09-05'),
        is_guest: true,
        guest_created_by: USER_IDS.josue,
      },
      {
        id: GUEST_PLAYER_IDS.halcones_p2,
        display_name: 'Fernando Díaz',
        jersey_number: 9,
        position: 'Delantero centro',
        sex: 'male',
        date_of_birth: new Date('1998-04-17'),
        is_guest: true,
        guest_created_by: USER_IDS.josue,
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(teamMembers)
    .values([
      // Tigres FC
      {
        team_id: TEAM_IDS.tigresFC,
        player_id: GUEST_PLAYER_IDS.carlos_player,
        role: 'captain',
        status: 'active',
        joined_at: now,
      },
      {
        team_id: TEAM_IDS.tigresFC,
        player_id: GUEST_PLAYER_IDS.tigres_p1,
        role: 'player',
        status: 'active',
        joined_at: now,
      },
      {
        team_id: TEAM_IDS.tigresFC,
        player_id: GUEST_PLAYER_IDS.tigres_p2,
        role: 'player',
        status: 'active',
        joined_at: now,
      },
      {
        team_id: TEAM_IDS.tigresFC,
        player_id: GUEST_PLAYER_IDS.tigres_p3,
        role: 'player',
        status: 'active',
        joined_at: now,
      },
      // Águilas Azules — ivan también tiene un player profile como guest para ser miembro
      {
        team_id: TEAM_IDS.aguilasAzules,
        player_id: GUEST_PLAYER_IDS.aguilas_p1,
        role: 'captain',
        status: 'active',
        joined_at: now,
      },
      {
        team_id: TEAM_IDS.aguilasAzules,
        player_id: GUEST_PLAYER_IDS.aguilas_p2,
        role: 'player',
        status: 'active',
        joined_at: now,
      },
      {
        team_id: TEAM_IDS.aguilasAzules,
        player_id: GUEST_PLAYER_IDS.aguilas_p3,
        role: 'player',
        status: 'active',
        joined_at: now,
      },
      // Lobos FC
      {
        team_id: TEAM_IDS.lobosFC,
        player_id: GUEST_PLAYER_IDS.lobos_p1,
        role: 'captain',
        status: 'active',
        joined_at: now,
      },
      {
        team_id: TEAM_IDS.lobosFC,
        player_id: GUEST_PLAYER_IDS.lobos_p2,
        role: 'player',
        status: 'active',
        joined_at: now,
      },
      {
        team_id: TEAM_IDS.lobosFC,
        player_id: GUEST_PLAYER_IDS.lobos_p3,
        role: 'player',
        status: 'active',
        joined_at: now,
      },
      // Halcones
      {
        team_id: TEAM_IDS.halcones,
        player_id: GUEST_PLAYER_IDS.halcones_p1,
        role: 'captain',
        status: 'active',
        joined_at: now,
      },
      {
        team_id: TEAM_IDS.halcones,
        player_id: GUEST_PLAYER_IDS.halcones_p2,
        role: 'player',
        status: 'active',
        joined_at: now,
      },
    ])
    .onConflictDoNothing()
}
