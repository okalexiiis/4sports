import { authV1Routes } from '@/modules/auth/http/v1/routes'
import { convocatoriasV1Routes } from '@/modules/convocatorias/http/v1/routes'
import { disputesV1Routes } from '@/modules/disputes/http/v1/routes'
import { lineupsV1Routes } from '@/modules/lineups/http/v1/routes'
import { matchEventsV1Routes } from '@/modules/match-events/http/v1/routes'
import { matchesV1Routes } from '@/modules/matches/http/v1/routes'
import { onboardingV1Routes } from '@/modules/onboarding/http/v1/routes'
import { invitationsV1Routes } from '@/modules/organizations/http/v1/invitation-routes'
import { organizationsV1Routes } from '@/modules/organizations/http/v1/routes'
import { playersV1Routes } from '@/modules/players/http/v1/routes'
import { registrationsV1Routes } from '@/modules/registrations/http/v1/routes'
import { sportEventTypesV1Routes } from '@/modules/sport-event-types/http/v1/routes'
import { sportsV1Routes } from '@/modules/sports/http/v1/routes'
import { standingsV1Routes } from '@/modules/standings/http/v1/routes'
import { suspensionsV1Routes } from '@/modules/suspensions/http/v1/routes'
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
  .use(matchEventsV1Routes)
  .use(convocatoriasV1Routes)
  .use(lineupsV1Routes)
  .use(disputesV1Routes)
  .use(suspensionsV1Routes)
  .use(sportEventTypesV1Routes)
  .use(standingsV1Routes)
