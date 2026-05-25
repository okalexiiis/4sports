import { DomainError } from '@4sports/utils/result'
import { OrgErrorCodes } from './codes'

export const OrgErrors = {
  notFound: () => new DomainError(OrgErrorCodes.ORG_NOT_FOUND, 'Organization not found'),
  memberNotFound: () => new DomainError(OrgErrorCodes.ORG_MEMBER_NOT_FOUND, 'Member not found'),
  insufficientRole: () =>
    new DomainError(OrgErrorCodes.ORG_INSUFFICIENT_ROLE, 'Insufficient role for this action'),
  profileNotFound: () =>
    new DomainError(OrgErrorCodes.ORG_PROFILE_NOT_FOUND, 'User profile not found'),
  slugTaken: (suggestions: string[]) =>
    new DomainError(OrgErrorCodes.ORG_SLUG_CONFLICT, 'Organization slug is already taken', {
      suggestions,
    }),
  planNotFound: () =>
    new DomainError(OrgErrorCodes.ORG_PLAN_NOT_FOUND, 'Subscription plan not found'),
  invitationNotFound: () =>
    new DomainError(OrgErrorCodes.ORG_INVITATION_NOT_FOUND, 'Invitation not found'),
  invitationExpired: () =>
    new DomainError(OrgErrorCodes.ORG_INVITATION_EXPIRED, 'Invitation has expired'),
  alreadyOwner: () =>
    new DomainError(OrgErrorCodes.ORG_ALREADY_OWNER, 'This member is already the owner'),
}
