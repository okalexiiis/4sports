import { DomainError } from '@4sports/utils/result'
import { PlayerClaimErrorCodes } from './codes'

export const PlayerClaimErrors = {
  playerNotFound: (id: string) =>
    new DomainError(PlayerClaimErrorCodes.PLAYER_NOT_FOUND, `Player '${id}' not found`, { id }),

  claimNotAllowed: () =>
    new DomainError(
      PlayerClaimErrorCodes.CLAIM_NOT_ALLOWED,
      'Player cannot be claimed: not a guest or already linked to a user',
    ),

  teamNotFound: () =>
    new DomainError(PlayerClaimErrorCodes.TEAM_NOT_FOUND, 'Player is not associated with any team'),

  claimNotFound: (id: string) =>
    new DomainError(PlayerClaimErrorCodes.CLAIM_NOT_FOUND, `Claim '${id}' not found`, { id }),

  alreadyClaimed: () =>
    new DomainError(
      PlayerClaimErrorCodes.ALREADY_CLAIMED,
      'A pending claim already exists for this player',
    ),

  forbidden: () =>
    new DomainError(
      PlayerClaimErrorCodes.FORBIDDEN,
      'Only the team captain or coach can review a claim',
    ),

  invalidTransition: (from: string, to: string) =>
    new DomainError(
      PlayerClaimErrorCodes.INVALID_TRANSITION,
      `Cannot transition claim from '${from}' to '${to}'`,
      { from, to },
    ),
}
