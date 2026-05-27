import type { ClaimStatus, PlayerClaim, PlayerForClaim } from './player-claim.entity'

export interface IPlayerClaimRepository {
  findPlayer(playerId: string): Promise<PlayerForClaim | null>
  findTeamForPlayer(playerId: string): Promise<string | null>
  hasPendingClaim(playerId: string): Promise<boolean>
  requestClaim(playerId: string, teamId: string, claimantUserId: string): Promise<PlayerClaim>
  findClaimById(claimId: string): Promise<PlayerClaim | null>
  isLeader(teamId: string, userId: string): Promise<boolean>
  updateClaimStatus(claimId: string, status: ClaimStatus, reviewedBy: string): Promise<PlayerClaim>
  linkPlayerToUser(playerId: string, userId: string): Promise<void>
  notifyLeaders(
    teamId: string,
    notification: { title: string; body: string; claimId: string },
  ): Promise<void>
}
