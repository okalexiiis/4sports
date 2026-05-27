import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { PlayerClaimErrors } from '../errors'
import type { PlayerClaim } from '../player-claim.entity'
import type { IPlayerClaimRepository } from '../player-claim.repository'

export async function requestClaim(
  repo: IPlayerClaimRepository,
  input: {
    playerId: string
    claimantUserId: string
  },
): Promise<Result<PlayerClaim>> {
  const player = await repo.findPlayer(input.playerId)
  if (!player) {
    return err(PlayerClaimErrors.playerNotFound(input.playerId))
  }

  if (!player.is_guest || player.user_id !== null) {
    return err(PlayerClaimErrors.claimNotAllowed())
  }

  const teamId = await repo.findTeamForPlayer(input.playerId)
  if (!teamId) {
    return err(PlayerClaimErrors.teamNotFound())
  }

  const pending = await repo.hasPendingClaim(input.playerId)
  if (pending) {
    return err(PlayerClaimErrors.alreadyClaimed())
  }

  const claim = await repo.requestClaim(input.playerId, teamId, input.claimantUserId)

  await repo.notifyLeaders(teamId, {
    title: 'New player claim request',
    body: `${player.display_name} has been claimed by a user. Review the request in your team dashboard.`,
    claimId: claim.id,
  })

  return ok(claim)
}
