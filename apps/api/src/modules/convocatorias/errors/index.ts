import { DomainError } from '@4sports/utils/result'
import { ConvocatoriaErrorCodes } from './codes'

export const ConvocatoriaErrors = {
  notFound: (id: string) =>
    new DomainError(ConvocatoriaErrorCodes.NOT_FOUND, `Convocatoria '${id}' not found`, { id }),

  matchNotFound: (matchId: string) =>
    new DomainError(ConvocatoriaErrorCodes.MATCH_NOT_FOUND, `Match '${matchId}' not found`, {
      matchId,
    }),

  invalidTeam: (teamId: string) =>
    new DomainError(
      ConvocatoriaErrorCodes.INVALID_TEAM,
      `Team '${teamId}' is not playing in this match`,
      { teamId },
    ),

  matchAlreadyEnded: () =>
    new DomainError(
      ConvocatoriaErrorCodes.MATCH_ALREADY_ENDED,
      'Cannot send or respond to a convocatoria for a match that has already ended',
    ),

  notYourConvocatoria: () =>
    new DomainError(
      ConvocatoriaErrorCodes.NOT_YOUR_CONVOCATORIA,
      'This convocatoria does not belong to you',
    ),
}
