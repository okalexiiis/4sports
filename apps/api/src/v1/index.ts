import { authV1Routes } from '@/modules/auth/http/v1/routes'
import { matchesV1Routes } from '@/modules/matches/http/v1/routes'
import { onboardingV1Routes } from '@/modules/onboarding/http/v1/routes'
import { invitationsV1Routes } from '@/modules/organizations/http/v1/invitation-routes'
import { organizationsV1Routes } from '@/modules/organizations/http/v1/routes'
import { playersV1Routes } from '@/modules/players/http/v1/routes'
import { registrationsV1Routes } from '@/modules/registrations/http/v1/routes'
import { sportsV1Routes } from '@/modules/sports/http/v1/routes'
import { teamsV1Routes } from '@/modules/teams/http/v1/routes'
import { tournamentFormatsV1Routes } from '@/modules/tournament-formats/http/v1/routes'
import { tournamentsV1Routes } from '@/modules/tournaments/http/v1/routes'
import { uploadV1Routes } from '@/modules/upload/http/v1/routes'
import { createVersion } from '@/shared/versioning'

export const v1 = createVersion(1)
  .use(authV1Routes)
  .use(onboardingV1Routes)
  .use(organizationsV1Routes)
  .use(invitationsV1Routes)
  .use(sportsV1Routes)
  .use(tournamentFormatsV1Routes)
  .use(tournamentsV1Routes)
  .use(teamsV1Routes)
  .use(registrationsV1Routes)
  .use(playersV1Routes)
  .use(uploadV1Routes)
  .use(matchesV1Routes)
