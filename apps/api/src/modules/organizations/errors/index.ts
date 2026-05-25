import { DomainError } from '@4sports/utils/result'
import { OrgErrorCodes } from './codes'

export const OrgErrors = {
  notFound: () => new DomainError(OrgErrorCodes.ORG_NOT_FOUND, 'Organization not found'),
  memberNotFound: () => new DomainError(OrgErrorCodes.ORG_MEMBER_NOT_FOUND, 'Member not found'),
  insufficientRole: () =>
    new DomainError(OrgErrorCodes.ORG_INSUFFICIENT_ROLE, 'Insufficient role for this action'),
}
