import { ApiResponses } from '@/shared/openapi/responses'
import { SuspensionSchema } from './schemas'

const security = [{ cookieAuth: [] }]

export const listSuspensionsDetail = {
  summary: 'List suspensions',
  description:
    'Returns all suspensions for an organization. Filter by tournament_id or is_draft to narrow results. Requires organizer role.',
  security,
  responses: {
    200: ApiResponses.list(SuspensionSchema, 'Suspensions'),
    401: ApiResponses.unauthorized(),
  },
}

export const confirmSuspensionDetail = {
  summary: 'Confirm suspension',
  description:
    'Confirms a draft suspension. Optionally overrides the default suspension length and records a justification. Requires admin role.',
  security,
  responses: {
    200: ApiResponses.success(SuspensionSchema, 'Suspension confirmed'),
    401: ApiResponses.unauthorized(),
    404: ApiResponses.notFound('Suspension not found'),
    422: ApiResponses.error('Suspension already confirmed'),
  },
}
