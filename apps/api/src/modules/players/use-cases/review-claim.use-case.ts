import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { PlayerClaimErrors } from '../errors'
import type { ClaimStatus, PlayerClaim } from '../player-claim.entity'
import type { IPlayerClaimRepository } from '../player-claim.repository'

export async function reviewClaim(
  repo: IPlayerClaimRepository,
  input: {
    playerId: string
    claimId: string
    newStatus: 'approved' | 'rejected'
    reviewedBy: string
  },
): Promise<Result<PlayerClaim>> {
  const claim = await repo.findClaimById(input.claimId)
  if (!claim || claim.player_id !== input.playerId) {
    return err(PlayerClaimErrors.claimNotFound(input.claimId))
  }

  if (claim.status !== 'pending') {
    return err(PlayerClaimErrors.invalidTransition(claim.status, input.newStatus))
  }

  const isLeader = await repo.isLeader(claim.team_id, input.reviewedBy)
  if (!isLeader) {
    return err(PlayerClaimErrors.forbidden())
  }

  const updated = await repo.updateClaimStatus(
    input.claimId,
    input.newStatus as ClaimStatus,
    input.reviewedBy,
  )

  if (input.newStatus === 'approved') {
    await repo.linkPlayerToUser(input.playerId, claim.claimant_user_id)
  }

  return ok(updated)
}
