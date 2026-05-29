import { ApiResponses } from '@/shared/openapi/responses'
import { DisputeSchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const openDisputeDetail = {
  summary: 'Open dispute',
  description:
    'Opens a dispute for a finished match. Only one open dispute is allowed per match. The dispute window is configurable via tournament settings (default 24 h).',
  security,
  responses: {
    201: ApiResponses.success(DisputeSchema, 'Dispute opened'),
    401: ApiResponses.unauthorized(),
    404: ApiResponses.notFound('Match not found'),
    422: ApiResponses.error('Match not finished, window expired, or dispute already open'),
  },
}

export const listDisputesDetail = {
  summary: 'List disputes',
  description: 'Returns all disputes for a match ordered by creation date.',
  security,
  responses: {
    200: ApiResponses.list(DisputeSchema, 'Disputes'),
    401: ApiResponses.unauthorized(),
  },
}

export const resolveDisputeDetail = {
  summary: 'Resolve dispute',
  description:
    'Resolves an open dispute. Optionally overrides the final score, recalculates standings and restores the match to finished. Requires admin role.',
  security,
  responses: {
    200: ApiResponses.success(DisputeSchema, 'Dispute resolved'),
    401: ApiResponses.unauthorized(),
    404: ApiResponses.notFound('Dispute not found'),
    422: ApiResponses.error('Dispute is not open'),
  },
}
