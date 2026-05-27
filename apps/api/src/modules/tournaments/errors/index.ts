import { DomainError } from '@4sports/utils/result'
import { TournamentErrorCodes } from './codes'

export const TournamentErrors = {
  notFound: (id: string) =>
    new DomainError(TournamentErrorCodes.NOT_FOUND, `Tournament '${id}' not found`, { id }),

  notDraft: () =>
    new DomainError(
      TournamentErrorCodes.NOT_DRAFT,
      'Tournament can only be edited while in draft status',
    ),

  limitExceeded: (max: number) =>
    new DomainError(
      TournamentErrorCodes.LIMIT_EXCEEDED,
      `Your plan allows a maximum of ${max} active tournaments`,
      { max },
    ),

  formatNotAvailable: (format: string, requiredPlan: string) =>
    new DomainError(
      TournamentErrorCodes.FORMAT_NOT_AVAILABLE,
      `Format '${format}' requires the ${requiredPlan} plan or higher`,
      { format, required_plan: requiredPlan },
    ),

  publishValidation: (failures: { field: string; message: string }[]) =>
    new DomainError(
      TournamentErrorCodes.PUBLISH_VALIDATION,
      'Tournament is not ready to be published',
      { failures },
    ),

  forbidden: () =>
    new DomainError(
      TournamentErrorCodes.FORBIDDEN,
      'You do not have permission to modify this tournament',
    ),
}
