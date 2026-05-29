import { DomainError } from '@4sports/utils/result'
import { DisputeErrorCodes } from './codes'

export const DisputeErrors = {
  notFound: (id: string) =>
    new DomainError(DisputeErrorCodes.NOT_FOUND, `Dispute '${id}' not found`, { id }),

  matchNotFound: (matchId: string) =>
    new DomainError(DisputeErrorCodes.MATCH_NOT_FOUND, `Match '${matchId}' not found`, { matchId }),

  matchNotFinished: (status: string) =>
    new DomainError(
      DisputeErrorCodes.MATCH_NOT_FINISHED,
      `Disputes can only be opened for finished matches. Current status: '${status}'`,
      { status },
    ),

  windowExpired: (windowHours: number) =>
    new DomainError(
      DisputeErrorCodes.WINDOW_EXPIRED,
      `The dispute window of ${windowHours} hour(s) has expired`,
      { windowHours },
    ),

  alreadyOpen: (matchId: string) =>
    new DomainError(
      DisputeErrorCodes.ALREADY_OPEN,
      `There is already an open dispute for match '${matchId}'`,
      { matchId },
    ),

  notOpen: (id: string) =>
    new DomainError(
      DisputeErrorCodes.NOT_OPEN,
      `Dispute '${id}' is not open and cannot be resolved`,
      { id },
    ),
}
