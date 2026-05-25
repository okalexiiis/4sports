import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { orgGuard } from '@/shared/middleware/org.guard'
import { DrizzleOrganizationRepository } from '../../drizzle-organization.repository'
import { getOrganization } from '../../use-cases/get-organization.use-case'
import { listMembers } from '../../use-cases/list-members.use-case'
import { getOrganizationDetail, listMembersDetail } from './docs'
import { MembersQuerySchema } from './schemas'

const repo = new DrizzleOrganizationRepository()

export const organizationsV1Routes = new Elysia({ tags: ['Organizations'] })
  .get(
    '/organizations/:orgId',
    async (ctx) => {
      const { user } = ctx.store as { user: { id: string } }
      return toApiResponse(
        ctx,
        await getOrganization(repo, { orgId: ctx.params.orgId, requestingUserId: user.id }),
      )
    },
    { beforeHandle: [authGuard, orgGuard('viewer')], detail: getOrganizationDetail },
  )
  .get(
    '/organizations/:orgId/members',
    async (ctx) => {
      const page = Number(ctx.query.page ?? 1)
      const limit = Number(ctx.query.limit ?? 20)
      const result = await listMembers(repo, { orgId: ctx.params.orgId, page, limit })

      if (!result.ok) {
        return toApiResponse(ctx, result)
      }

      const { members, meta } = result.value
      return toApiResponse(ctx, { ok: true as const, value: { members, meta } })
    },
    {
      beforeHandle: [authGuard, orgGuard('viewer')],
      query: MembersQuerySchema,
      detail: listMembersDetail,
    },
  )
