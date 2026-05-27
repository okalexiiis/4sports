import type { ErrorLogMeta } from '@4sports/logger'
import type { Result } from '@4sports/utils/result'
import type { Context } from 'elysia'
import { logger } from '@/shared/logger'

type PaginationMeta = {
  page?: number
  limit?: number
  total?: number
  total_pages?: number
  has_next?: boolean
  has_prev?: boolean
}

function resolveStatus(code: string): number {
  if (code.includes('NOT_FOUND')) return 404
  if (code.includes('UNAUTHORIZED')) return 401
  if (code.includes('FORBIDDEN')) return 403
  if (code.includes('CONFLICT')) return 409
  if (code.includes('VALIDATION')) return 422
  return 400
}

export function toApiResponse<T>(ctx: Context, result: Result<T>, meta?: PaginationMeta) {
  if (result.ok) {
    return { data: result.value, ...(meta ? { meta } : {}) }
  }

  const requestId = (ctx as unknown as { requestId?: string }).requestId
  ctx.set.status = resolveStatus(result.error.code)

  logger.debug('domain error', {
    type: 'error',
    request_id: requestId,
    error_code: result.error.code,
    error_message: result.error.message,
    ...(result.error.details ? { details: result.error.details } : {}),
  } satisfies ErrorLogMeta)

  return {
    error: {
      code: result.error.code,
      message: result.error.message,
      details: result.error.details,
    },
  }
}
