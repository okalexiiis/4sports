/* TYPES */
import { Role } from '@/content/auth/onboarding/types/role'

export type OnboardingForm = {
  /* COMMON */
  username: string
  country: string
  state: string
  city: string
  role: Role

  /* PLAYER */
  playerPhone?: string
  playerPhoneCode?: string
  playerIsSearchingForTeam?: boolean

  /* ORGANIZATION */
  organizationName?: string
  organizationSlug?: string
  organizationDescription?: string
  organizationCountry?: string
  organizationState?: string
  organizationCity?: string
}
