import { DomainError } from '@4sports/utils/result'
import { SuspensionErrorCodes } from './codes'

export const SuspensionErrors = {
  notFound: (id: string) =>
    new DomainError(SuspensionErrorCodes.NOT_FOUND, `Suspension '${id}' not found`, { id }),

  alreadyConfirmed: (id: string) =>
    new DomainError(
      SuspensionErrorCodes.ALREADY_CONFIRMED,
      `Suspension '${id}' has already been confirmed`,
      { id },
    ),
}
