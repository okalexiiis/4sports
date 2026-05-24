import { DomainError } from '@4sports/utils/result'
import { AuthErrorCodes } from './codes'

export const AuthErrors = {
  unauthorized: () => new DomainError(AuthErrorCodes.UNAUTHORIZED, 'Not authenticated'),
}
