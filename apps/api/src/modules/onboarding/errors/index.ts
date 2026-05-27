import { DomainError } from '@4sports/utils/result'
import { OnboardingErrorCodes } from './codes'

export const OnboardingErrors = {
  alreadyComplete: () =>
    new DomainError(
      OnboardingErrorCodes.ONBOARDING_ALREADY_COMPLETE,
      'Onboarding already completed',
    ),
  usernameTaken: (suggestions: string[]) =>
    new DomainError(OnboardingErrorCodes.USERNAME_TAKEN, 'Username is already taken', {
      suggestions,
    }),
  slugTaken: (suggestions: string[]) =>
    new DomainError(OnboardingErrorCodes.SLUG_TAKEN, 'Slug is already taken', { suggestions }),
  planNotFound: () =>
    new DomainError(OnboardingErrorCodes.PLAN_NOT_FOUND, 'Subscription plan not found'),
}
