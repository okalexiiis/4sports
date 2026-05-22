import { fromTypes, openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'
import { noteRoutes } from '@/_sandbox/note/note.routes'
import { auth } from '@/shared/lib/auth'

new Elysia()
  .use(openapi({ references: fromTypes(), path: '/openapi' }))
  .use(noteRoutes)
  .all('/auth/*', async (ctx) => auth.handler(ctx.request))
  .listen(process.env.PORT ?? 4000)
