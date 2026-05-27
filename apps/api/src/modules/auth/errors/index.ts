import { DomainError } from '@4sports/utils/result'
import { AuthErrorCodes } from './codes'

export const AuthErrors = {
  unauthorized: () => new DomainError(AuthErrorCodes.UNAUTHORIZED, 'Not authenticated'),
  orgNotFound: () => new DomainError(AuthErrorCodes.ORG_NOT_FOUND, 'Organization not found'),
  orgForbidden: () =>
    new DomainError(AuthErrorCodes.ORG_FORBIDDEN, 'Not an active member of this organization'),
}
