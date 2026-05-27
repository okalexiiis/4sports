import { ApiResponses } from '@/shared/openapi/responses'
import { SportSchema } from './schemas'

export const listSportsDetail = {
  summary: 'List all sports',
  description:
    'Returns all active sports with their available positions. Public endpoint — no session required.',
  responses: {
    200: ApiResponses.list(SportSchema, 'Sports list'),
  },
}

export const getSportDetail = {
  summary: 'Get sport by ID',
  description: 'Returns a single sport with its positions. Returns 404 if not found or inactive.',
  responses: {
    200: ApiResponses.success(SportSchema, 'Sport found'),
    404: ApiResponses.notFound('Sport not found'),
  },
}
