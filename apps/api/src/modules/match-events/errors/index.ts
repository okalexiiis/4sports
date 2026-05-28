import { DomainError } from '@4sports/utils/result'
import { MatchEventErrorCodes } from './codes'

export const MatchEventErrors = {
  notFound: (id: string) =>
    new DomainError(MatchEventErrorCodes.NOT_FOUND, `Match event '${id}' not found`, { id }),

  matchNotLive: (status: string) =>
    new DomainError(
      MatchEventErrorCodes.MATCH_NOT_LIVE,
      `Events can only be registered while the match is live. Current status: '${status}'`,
      { status },
    ),

  playerNotInMatch: (playerId: string) =>
    new DomainError(
      MatchEventErrorCodes.PLAYER_NOT_IN_MATCH,
      `Player '${playerId}' is not a participant in this match`,
      { playerId },
    ),

  playerAlreadyEjected: (playerId: string) =>
    new DomainError(
      MatchEventErrorCodes.PLAYER_ALREADY_EJECTED,
      `Player '${playerId}' has already been ejected from this match`,
      { playerId },
    ),

  wrongMatch: (eventId: string, matchId: string) =>
    new DomainError(
      MatchEventErrorCodes.WRONG_MATCH,
      `Event '${eventId}' does not belong to match '${matchId}'`,
      { eventId, matchId },
    ),
}
