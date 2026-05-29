import { db } from '@/shared/db/client'
import { players, teamMembers, teams } from '@/shared/db/schemas'
import { ORG_IDS, PLAYER_IDS, TEAM_IDS } from './ids'
import { type UserIds, userId } from './users'

interface TeamSpec {
  id: string
  name: string
  short: string
  primary: string
  ownerKey: string
  // player_id → { name, captain?, guest?, jersey, position }
  roster: Array<{
    playerId: string
    name: string
    jersey: number
    position: string
    captainUserKey?: string
  }>
}

const POSITIONS = ['Portero', 'Defensa central', 'Mediocampista', 'Delantero centro']

function roster(teamKey: 'tigres' | 'rayados' | 'pumas' | 'aguilas', captainName: string) {
  return [1, 2, 3, 4].map((n) => ({
    playerId: PLAYER_IDS[`${teamKey}${n}` as keyof typeof PLAYER_IDS],
    name: n === 1 ? captainName : `${captainName.split(' ')[0]} Suplente ${n}`,
    jersey: n,
    position: POSITIONS[n - 1] ?? 'Jugador',
  }))
}

const TEAMS: TeamSpec[] = [
  {
    id: TEAM_IDS.tigres,
    name: 'Tigres FC',
    short: 'TIG',
    primary: '#f59e0b',
    ownerKey: 'captain1',
    roster: roster('tigres', 'Carlos Capitán').map((p, i) =>
      i === 0 ? { ...p, captainUserKey: 'captain1' } : p,
    ),
  },
  {
    id: TEAM_IDS.rayados,
    name: 'Rayados United',
    short: 'RAY',
    primary: '#1d4ed8',
    ownerKey: 'captain2',
    roster: roster('rayados', 'Camila Capitana').map((p, i) =>
      i === 0 ? { ...p, captainUserKey: 'captain2' } : p,
    ),
  },
  {
    id: TEAM_IDS.pumas,
    name: 'Pumas Dorados',
    short: 'PUM',
    primary: '#15803d',
    ownerKey: 'captain3',
    roster: roster('pumas', 'César Capitán').map((p, i) =>
      i === 0 ? { ...p, captainUserKey: 'captain3' } : p,
    ),
  },
  {
    id: TEAM_IDS.aguilas,
    name: 'Águilas Reales',
    short: 'AGU',
    primary: '#b91c1c',
    ownerKey: 'captain4',
    roster: roster('aguilas', 'Carmen Capitana').map((p, i) =>
      i === 0 ? { ...p, captainUserKey: 'captain4' } : p,
    ),
  },
]

// Four teams, each owned by a captain. Player #1 of every team is a real
// platform user (the captain); the rest are guest profiles created by the
// captain. Idempotent via fixed PKs / unique constraints.
export async function seedDummyTeams(userIds: UserIds) {
  await db
    .insert(teams)
    .values(
      TEAMS.map((t) => ({
        id: t.id,
        organization_id: ORG_IDS.ligaMonterrey,
        name: t.name,
        short_name: t.short,
        primary_color: t.primary,
        city: 'Monterrey',
        country_code: 'MX',
        gender_type: 'male',
        join_policy: 'request',
        scope: 'tournament_scoped' as const,
        owned_by_user_id: userId(userIds, t.ownerKey),
      })),
    )
    .onConflictDoNothing()

  const playerRows = TEAMS.flatMap((t) =>
    t.roster.map((p) => {
      const isCaptain = Boolean(p.captainUserKey)
      return {
        id: p.playerId,
        user_id: isCaptain ? userId(userIds, p.captainUserKey as string) : null,
        display_name: p.name,
        jersey_number: p.jersey,
        position: p.position,
        sex: 'male',
        is_guest: !isCaptain,
        guest_created_by: isCaptain ? null : userId(userIds, t.ownerKey),
      }
    }),
  )

  await db.insert(players).values(playerRows).onConflictDoNothing()

  const memberRows = TEAMS.flatMap((t) =>
    t.roster.map((p) => ({
      team_id: t.id,
      player_id: p.playerId,
      role: p.captainUserKey ? ('captain' as const) : ('player' as const),
      status: 'active' as const,
      joined_at: new Date(),
    })),
  )

  await db.insert(teamMembers).values(memberRows).onConflictDoNothing()
}
