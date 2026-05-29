import { DomainError } from '@4sports/utils/result'
import { LineupErrorCodes } from './codes'

export const LineupErrors = {
  matchNotFound: (matchId: string) =>
    new DomainError(LineupErrorCodes.MATCH_NOT_FOUND, `Match '${matchId}' not found`, { matchId }),

  invalidTeam: (teamId: string) =>
    new DomainError(
      LineupErrorCodes.INVALID_TEAM,
      `Team '${teamId}' is not playing in this match`,
      { teamId },
    ),

  matchAlreadyEnded: () =>
    new DomainError(
      LineupErrorCodes.MATCH_ALREADY_ENDED,
      'Cannot publish a lineup for a match that has already ended',
    ),
}
