import { and, eq, inArray, like } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { notifications, players, teamJoinRequests, teamMembers } from '@/shared/db/schemas'
import type { ClaimStatus, PlayerClaim, PlayerForClaim } from './player-claim.entity'
import type { IPlayerClaimRepository } from './player-claim.repository'

const CLAIM_TYPE = 'player_claim'

function rowToClaim(row: typeof teamJoinRequests.$inferSelect): PlayerClaim {
  const meta = JSON.parse(row.message ?? '{}') as { player_id?: string }
  return {
    id: row.id,
    player_id: meta.player_id ?? '',
    team_id: row.team_id,
    claimant_user_id: row.requester_user_id,
    status: row.status as ClaimStatus,
    reviewed_by: row.reviewed_by ?? null,
    reviewed_at: row.reviewed_at ?? null,
    created_at: row.created_at,
  }
}

export class DrizzlePlayerClaimRepository implements IPlayerClaimRepository {
  async findPlayer(playerId: string): Promise<PlayerForClaim | null> {
    const [row] = await db
      .select({
        id: players.id,
        user_id: players.user_id,
        is_guest: players.is_guest,
        display_name: players.display_name,
      })
      .from(players)
      .where(eq(players.id, playerId))
      .limit(1)

    return row ?? null
  }

  async findTeamForPlayer(playerId: string): Promise<string | null> {
    const [row] = await db
      .select({ team_id: teamMembers.team_id })
      .from(teamMembers)
      .where(and(eq(teamMembers.player_id, playerId), eq(teamMembers.status, 'active')))
      .limit(1)

    return row?.team_id ?? null
  }

  async hasPendingClaim(playerId: string): Promise<boolean> {
    const rows = await db
      .select({ message: teamJoinRequests.message })
      .from(teamJoinRequests)
      .where(
        and(
          eq(teamJoinRequests.status, 'pending'),
          like(teamJoinRequests.message, `%${playerId}%`),
        ),
      )

    return rows.some((r) => {
      try {
        const meta = JSON.parse(r.message ?? '{}') as { player_id?: string; type?: string }
        return meta.type === CLAIM_TYPE && meta.player_id === playerId
      } catch {
        return false
      }
    })
  }

  async requestClaim(
    playerId: string,
    teamId: string,
    claimantUserId: string,
  ): Promise<PlayerClaim> {
    const [row] = await db
      .insert(teamJoinRequests)
      .values({
        team_id: teamId,
        requester_user_id: claimantUserId,
        message: JSON.stringify({ type: CLAIM_TYPE, player_id: playerId }),
        status: 'pending',
      })
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
    return rowToClaim(row!)
  }

  async findClaimById(claimId: string): Promise<PlayerClaim | null> {
    const [row] = await db
      .select()
      .from(teamJoinRequests)
      .where(eq(teamJoinRequests.id, claimId))
      .limit(1)

    if (!row) return null

    try {
      const meta = JSON.parse(row.message ?? '{}') as { type?: string }
      if (meta.type !== CLAIM_TYPE) return null
    } catch {
      return null
    }

    return rowToClaim(row)
  }

  async isLeader(teamId: string, userId: string): Promise<boolean> {
    const [row] = await db
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .innerJoin(players, eq(teamMembers.player_id, players.id))
      .where(
        and(
          eq(teamMembers.team_id, teamId),
          eq(players.user_id, userId),
          inArray(teamMembers.role, ['captain', 'coach']),
          eq(teamMembers.status, 'active'),
        ),
      )
      .limit(1)

    return row !== undefined
  }

  async updateClaimStatus(
    claimId: string,
    status: ClaimStatus,
    reviewedBy: string,
  ): Promise<PlayerClaim> {
    const [row] = await db
      .update(teamJoinRequests)
      .set({ status, reviewed_by: reviewedBy, reviewed_at: new Date() })
      .where(eq(teamJoinRequests.id, claimId))
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: row exists since we just updated it
    return rowToClaim(row!)
  }

  async linkPlayerToUser(playerId: string, userId: string): Promise<void> {
    await db
      .update(players)
      .set({ user_id: userId, is_guest: false, updated_at: new Date() })
      .where(eq(players.id, playerId))
  }

  async notifyLeaders(
    teamId: string,
    notification: { title: string; body: string; claimId: string },
  ): Promise<void> {
    const leaders = await db
      .select({ user_id: players.user_id })
      .from(teamMembers)
      .innerJoin(players, eq(teamMembers.player_id, players.id))
      .where(
        and(
          eq(teamMembers.team_id, teamId),
          inArray(teamMembers.role, ['captain', 'coach']),
          eq(teamMembers.status, 'active'),
        ),
      )

    const leaderUserIds = leaders.map((l) => l.user_id).filter(Boolean) as string[]
    if (leaderUserIds.length === 0) return

    await db.insert(notifications).values(
      leaderUserIds.map((userId) => ({
        user_id: userId,
        title: notification.title,
        body: notification.body,
        type: 'player_claim_request',
        channel: 'in_app' as const,
        entity_type: 'player_claim',
        entity_id: notification.claimId,
      })),
    )
  }
}
