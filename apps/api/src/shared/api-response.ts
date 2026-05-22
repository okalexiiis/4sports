import type { Result } from '@4sports/utils/result'
import type { Context } from 'elysia'

type PaginationMeta = { page?: number; total?: number }

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
  ctx.set.status = resolveStatus(result.error.code)
  return {
    error: {
      code: result.error.code,
      message: result.error.message,
      details: result.error.details,
    },
  }
}
