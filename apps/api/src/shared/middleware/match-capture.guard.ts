import type { Context } from 'elysia'
import { DrizzleMatchRepository } from '@/modules/matches/drizzle-match.repository'
import { auth } from '@/shared/lib/auth'

const matchRepo = new DrizzleMatchRepository()

/**
 * Accepts either a BetterAuth session (any authenticated user) OR a match
 * referee_session_token passed as a Bearer token. The referee token is scoped
 * to a single match — the :matchId param must match the token's match.
 *
 * On success attaches `actorId` and optionally `refereeMatchId` to ctx.store.
 * Usage: { beforeHandle: [matchCaptureGuard] }
 */
export async function matchCaptureGuard(ctx: Context) {
  const session = await auth.api.getSession({ headers: ctx.request.headers })
  if (session) {
    ctx.store = { ...ctx.store, user: session.user, actorId: session.user.id }
    return
  }

  const authHeader = ctx.request.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    ctx.set.status = 401
    return {
      error: { code: 'UNAUTHORIZED', message: 'Se requiere sesión activa o referee token.' },
    }
  }

  const params = ctx.params as { matchId?: string }
  const match = await matchRepo.findByRefereeToken(token)

  if (!match || match.id !== params.matchId) {
    ctx.set.status = 401
    return {
      error: {
        code: 'UNAUTHORIZED',
        message: 'Referee token inválido o no corresponde a este partido.',
      },
    }
  }

  ctx.store = { ...ctx.store, actorId: `ref:${match.id}`, refereeMatchId: match.id }
}
