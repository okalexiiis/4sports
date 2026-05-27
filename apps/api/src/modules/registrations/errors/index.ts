import { DomainError } from '@4sports/utils/result'
import type { EligibilityAlert } from '../registration.entity'
import { RegistrationErrorCodes } from './codes'

export const RegistrationErrors = {
  notFound: (id: string) =>
    new DomainError(RegistrationErrorCodes.NOT_FOUND, `Registration '${id}' not found`, { id }),

  tournamentNotFound: (id: string) =>
    new DomainError(RegistrationErrorCodes.TOURNAMENT_NOT_FOUND, `Tournament '${id}' not found`, {
      id,
    }),

  tournamentNotOpen: () =>
    new DomainError(
      RegistrationErrorCodes.TOURNAMENT_NOT_OPEN,
      'Tournament is not open for registration',
    ),

  teamNotFound: (id: string) =>
    new DomainError(RegistrationErrorCodes.TEAM_NOT_FOUND, `Team '${id}' not found`, { id }),

  notCaptain: () =>
    new DomainError(
      RegistrationErrorCodes.NOT_CAPTAIN,
      'Only the team captain can register the team',
    ),

  alreadyRegistered: () =>
    new DomainError(
      RegistrationErrorCodes.ALREADY_REGISTERED,
      'This team is already registered in this tournament',
    ),

  tournamentFull: (max: number) =>
    new DomainError(
      RegistrationErrorCodes.TOURNAMENT_FULL,
      `Tournament has reached its maximum of ${max} teams`,
      { max },
    ),

  eligibilityBlocked: (alerts: EligibilityAlert[]) =>
    new DomainError(
      RegistrationErrorCodes.ELIGIBILITY_BLOCKED,
      'Registration blocked due to eligibility failures',
      { alerts },
    ),

  forbidden: () =>
    new DomainError(
      RegistrationErrorCodes.FORBIDDEN,
      'You do not have permission to review this registration',
    ),

  invalidTransition: (from: string, to: string) =>
    new DomainError(
      RegistrationErrorCodes.INVALID_TRANSITION,
      `Cannot transition registration from '${from}' to '${to}'`,
      { from, to },
    ),
}
