import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleConvocatoriaRepository } from '../../drizzle-convocatoria.repository'
import { listConvocatorias } from '../../use-cases/list-convocatorias.use-case'
import { respondConvocatoria } from '../../use-cases/respond-convocatoria.use-case'
import { sendConvocatoria } from '../../use-cases/send-convocatoria.use-case'
import { listConvocatoriasDetail, respondConvocatoriaDetail, sendConvocatoriaDetail } from './docs'
import { RespondConvocatoriaBodySchema, SendConvocatoriaBodySchema } from './schemas'

const repo = new DrizzleConvocatoriaRepository()

type AuthStore = { user: { id: string } }

export const convocatoriasV1Routes = new Elysia({ tags: ['Convocatorias'] })
  .post(
    '/matches/:matchId/convocatorias',
    async (ctx) => {
      const result = await sendConvocatoria(repo, {
        matchId: ctx.params.matchId,
        teamId: ctx.body.team_id,
        playerIds: ctx.body.player_ids,
      })
      if (result.ok) ctx.set.status = 201
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      body: SendConvocatoriaBodySchema,
      detail: sendConvocatoriaDetail,
    },
  )
  .patch(
    '/matches/:matchId/convocatorias/my-response',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await respondConvocatoria(repo, {
        matchId: ctx.params.matchId,
        userId: user.id,
        response: ctx.body.response,
      })
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard],
      body: RespondConvocatoriaBodySchema,
      detail: respondConvocatoriaDetail,
    },
  )
  .get(
    '/matches/:matchId/convocatorias',
    async (ctx) => {
      const result = await listConvocatorias(repo, ctx.params.matchId)
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard],
      detail: listConvocatoriasDetail,
    },
  )
