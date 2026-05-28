import { DomainError } from '@4sports/utils/result'
import { MatchErrorCodes } from './codes'

export const MatchErrors = {
  notFound: (id: string) =>
    new DomainError(MatchErrorCodes.NOT_FOUND, `Match '${id}' not found`, { id }),

  forbidden: () =>
    new DomainError(MatchErrorCodes.FORBIDDEN, 'You do not have permission to modify this match'),

  notEditable: (status: string) =>
    new DomainError(
      MatchErrorCodes.NOT_EDITABLE,
      `Match cannot be edited in status '${status}'. Only scheduled matches are editable.`,
      { status },
    ),

  invalidStatusTransition: (from: string, to: string) =>
    new DomainError(
      MatchErrorCodes.INVALID_STATUS_TRANSITION,
      `Cannot transition match from '${from}' to '${to}'`,
      { from, to },
    ),

  notLive: (status: string) =>
    new DomainError(
      MatchErrorCodes.NOT_LIVE,
      `Match must be live to perform this action. Current status: '${status}'`,
      { status },
    ),

  alreadyFinished: () =>
    new DomainError(MatchErrorCodes.ALREADY_FINISHED, 'Match is already finished'),

  invalidTeams: () =>
    new DomainError(
      MatchErrorCodes.INVALID_TEAMS,
      'Home team and away team must be different and registered in this tournament',
    ),
}
