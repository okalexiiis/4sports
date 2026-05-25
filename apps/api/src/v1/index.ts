import { authV1Routes } from '@/modules/auth/http/v1/routes'
import { onboardingV1Routes } from '@/modules/onboarding/http/v1/routes'
import { organizationsV1Routes } from '@/modules/organizations/http/v1/routes'
import { createVersion } from '@/shared/versioning'

export const v1 = createVersion(1)
  .use(authV1Routes)
  .use(onboardingV1Routes)
  .use(organizationsV1Routes)
