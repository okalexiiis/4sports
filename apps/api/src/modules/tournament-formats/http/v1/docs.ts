import { ApiResponses } from '@/shared/openapi/responses'
import { TournamentFormatSchema } from './schemas'

export const listTournamentFormatsDetail = {
  summary: 'List tournament formats',
  description:
    'Returns all active competition formats. Each format includes the minimum plan required to use it. Public endpoint — no session required.',
  responses: {
    200: ApiResponses.list(TournamentFormatSchema, 'Tournament formats list'),
  },
}
