import { Type } from '@sinclair/typebox'
import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { DrizzleSportsRepository } from '../../drizzle-sports.repository'
import { getSport } from '../../use-cases/get-sport.use-case'
import { listSports } from '../../use-cases/list-sports.use-case'
import { getSportDetail, listSportsDetail } from './docs'

const repo = new DrizzleSportsRepository()

export const sportsV1Routes = new Elysia({ tags: ['Sports'] })
  .get('/sports', async (ctx) => toApiResponse(ctx, await listSports(repo)), {
    detail: listSportsDetail,
  })
  .get(
    '/sports/:sportId',
    async (ctx) => toApiResponse(ctx, await getSport(repo, ctx.params.sportId)),
    {
      params: Type.Object({ sportId: Type.String({ format: 'uuid' }) }),
      detail: getSportDetail,
    },
  )
