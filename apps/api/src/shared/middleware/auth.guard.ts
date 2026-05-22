import type { Context } from 'elysia'
import { auth } from '@/shared/lib/auth'

export async function authGuard(ctx: Context) {
  const session = await auth.api.getSession({
    headers: ctx.request.headers,
  })

  if (!session) {
    ctx.set.status = 401
    return {
      error: {
        code: 'UNAUTHORIZED',
        message: 'Se requiere sesión activa.',
      },
    }
  }

  // Adjunta user al contexto para que el servicio lo use
  ctx.store = {
    ...ctx.store,
    user: session.user,
    session: session.session,
  }
}
