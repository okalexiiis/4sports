import { db } from '@/shared/db/client'
import { tournamentRegistrations } from '@/shared/db/schemas'
import { TEAM_IDS, TOURNAMENT_IDS } from './ids'
import { type UserIds, userId } from './users'

const TEAM_OWNERS: Array<{ teamId: string; ownerKey: string }> = [
  { teamId: TEAM_IDS.tigres, ownerKey: 'captain1' },
  { teamId: TEAM_IDS.rayados, ownerKey: 'captain2' },
  { teamId: TEAM_IDS.pumas, ownerKey: 'captain3' },
  { teamId: TEAM_IDS.aguilas, ownerKey: 'captain4' },
]

// All four teams approved into the active league; two pending into the open
// cup so the organizer's approval queue isn't empty. Idempotent via
// unique(tournament, team).
export async function seedDummyRegistrations(userIds: UserIds) {
  const now = new Date()

  const approved = TEAM_OWNERS.map((t) => ({
    tournament_id: TOURNAMENT_IDS.ligaApertura,
    team_id: t.teamId,
    status: 'approved' as const,
    is_external: true,
    registered_by: userId(userIds, t.ownerKey),
    reviewed_by: userId(userIds, 'organizer'),
    reviewed_at: now,
  }))

  const pending = TEAM_OWNERS.slice(0, 2).map((t) => ({
    tournament_id: TOURNAMENT_IDS.copaRelampago,
    team_id: t.teamId,
    status: 'pending' as const,
    is_external: true,
    registered_by: userId(userIds, t.ownerKey),
  }))

  await db
    .insert(tournamentRegistrations)
    .values([...approved, ...pending])
    .onConflictDoNothing()
}
