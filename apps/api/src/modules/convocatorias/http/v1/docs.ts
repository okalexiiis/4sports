import { ApiResponses } from '@/shared/openapi/responses'
import { ConvocatoriaSchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const sendConvocatoriaDetail = {
  summary: 'Send convocatoria',
  description:
    'Sends a match call-up to a list of players from a team. Re-sending resets any existing response to pending. Requires organizer role.',
  security,
  responses: {
    201: ApiResponses.list(ConvocatoriaSchema, 'Convocatorias sent'),
    401: ApiResponses.unauthorized(),
    404: ApiResponses.notFound('Match not found'),
    422: ApiResponses.error('Match already ended or team not in match'),
  },
}

export const respondConvocatoriaDetail = {
  summary: 'Respond to convocatoria',
  description:
    "Records the authenticated player's attendance response (va, no_va or duda) for this match.",
  security,
  responses: {
    200: ApiResponses.success(ConvocatoriaSchema, 'Response recorded'),
    401: ApiResponses.unauthorized(),
    403: ApiResponses.error('Convocatoria does not belong to you'),
    404: ApiResponses.notFound('Convocatoria not found'),
    422: ApiResponses.error('Match already ended'),
  },
}

export const listConvocatoriasDetail = {
  summary: 'List convocatorias',
  description:
    'Returns all convocatorias for a match with their current response status. Requires authentication.',
  security,
  responses: {
    200: ApiResponses.list(ConvocatoriaSchema, 'Convocatorias'),
    401: ApiResponses.unauthorized(),
  },
}
