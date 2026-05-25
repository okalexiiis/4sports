import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { orgGuard } from '@/shared/middleware/org.guard'
import { DrizzleOrganizationRepository } from '../../drizzle-organization.repository'
import { getOrganization } from '../../use-cases/get-organization.use-case'
import { inviteMember } from '../../use-cases/invite-member.use-case'
import { listMembers } from '../../use-cases/list-members.use-case'
import { removeMember } from '../../use-cases/remove-member.use-case'
import { updateMemberRole } from '../../use-cases/update-member-role.use-case'
import {
  getOrganizationDetail,
  inviteMemberDetail,
  listMembersDetail,
  removeMemberDetail,
  updateMemberRoleDetail,
} from './docs'
import { InviteMemberBodySchema, MembersQuerySchema, UpdateMemberRoleBodySchema } from './schemas'

const repo = new DrizzleOrganizationRepository()

type AuthStore = { user: { id: string }; membership?: { role: string } }

export const organizationsV1Routes = new Elysia({ tags: ['Organizations'] })
  .get(
    '/organizations/:orgId',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
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
  .post(
    '/organizations/:orgId/members',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await inviteMember(repo, {
          orgId: ctx.params.orgId,
          actorUserId: user.id,
          actorRole: membership?.role ?? 'admin',
          email: ctx.body.email,
          role: ctx.body.role,
          tournament_ids: ctx.body.tournament_ids,
        }),
      )
    },
    {
      beforeHandle: [authGuard, orgGuard('admin')],
      body: InviteMemberBodySchema,
      detail: inviteMemberDetail,
    },
  )
  .put(
    '/organizations/:orgId/members/:memberId',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await updateMemberRole(repo, {
          orgId: ctx.params.orgId,
          memberId: ctx.params.memberId,
          actorUserId: user.id,
          actorRole: membership?.role ?? 'admin',
          role: ctx.body.role,
          tournament_ids: ctx.body.tournament_ids,
        }),
      )
    },
    {
      beforeHandle: [authGuard, orgGuard('admin')],
      body: UpdateMemberRoleBodySchema,
      detail: updateMemberRoleDetail,
    },
  )
  .delete(
    '/organizations/:orgId/members/:memberId',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await removeMember(repo, {
          orgId: ctx.params.orgId,
          memberId: ctx.params.memberId,
          actorUserId: user.id,
          actorRole: membership?.role ?? 'admin',
        }),
      )
    },
    { beforeHandle: [authGuard, orgGuard('admin')], detail: removeMemberDetail },
  )
