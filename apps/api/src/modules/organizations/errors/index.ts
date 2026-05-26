import { DomainError } from '@4sports/utils/result'
import { OrgErrorCodes } from './codes'

export const OrgErrors = {
  notFound: () => new DomainError(OrgErrorCodes.ORG_NOT_FOUND, 'Organization not found'),
  memberNotFound: () => new DomainError(OrgErrorCodes.ORG_MEMBER_NOT_FOUND, 'Member not found'),
  insufficientRole: () =>
    new DomainError(OrgErrorCodes.ORG_INSUFFICIENT_ROLE, 'Insufficient role for this action'),
  invitationNotFound: () =>
    new DomainError(OrgErrorCodes.INVITATION_NOT_FOUND, 'Invitation not found'),
  invitationForbidden: () =>
    new DomainError(
      OrgErrorCodes.INVITATION_FORBIDDEN,
      'You are not the invitee for this invitation',
    ),
  invitationAlreadyProcessed: () =>
    new DomainError(
      OrgErrorCodes.INVITATION_ALREADY_PROCESSED,
      'Invitation has already been processed',
    ),
  invitationExpired: () =>
    new DomainError(OrgErrorCodes.INVITATION_EXPIRED, 'Invitation has expired'),
}
