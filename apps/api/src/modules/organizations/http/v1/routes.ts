import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { notificationsQueue } from '@/shared/lib/bullmq'
import { logger } from '@/shared/logger'
import { authGuard } from '@/shared/middleware/auth.guard'
import { orgGuard } from '@/shared/middleware/org.guard'
import { DrizzleOrganizationRepository } from '../../drizzle-organization.repository'
import { createOrganization } from '../../use-cases/create-organization.use-case'
import { getOrganization } from '../../use-cases/get-organization.use-case'
import { inviteMember } from '../../use-cases/invite-member.use-case'
import { listMembers } from '../../use-cases/list-members.use-case'
import { reactivateMember } from '../../use-cases/reactivate-member.use-case'
import { removeMember } from '../../use-cases/remove-member.use-case'
import { suspendMember } from '../../use-cases/suspend-member.use-case'
import { transferOwnership } from '../../use-cases/transfer-ownership.use-case'
import { updateMemberRole } from '../../use-cases/update-member-role.use-case'
import { updateOrganization } from '../../use-cases/update-organization.use-case'
import {
  createOrganizationDetail,
  getOrganizationDetail,
  inviteMemberDetail,
  listMembersDetail,
  reactivateMemberDetail,
  removeMemberDetail,
  suspendMemberDetail,
  transferOwnershipDetail,
  updateMemberRoleDetail,
  updateOrganizationDetail,
} from './docs'
import {
  CreateOrgBodySchema,
  InviteMemberBodySchema,
  MembersQuerySchema,
  TransferOwnershipBodySchema,
  UpdateMemberRoleBodySchema,
  UpdateOrgBodySchema,
} from './schemas'

const repo = new DrizzleOrganizationRepository()

type AuthStore = { user: { id: string }; membership?: { id: string; role: string } }

export const organizationsV1Routes = new Elysia({ tags: ['Organizations'] })
  .post(
    '/organizations',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await createOrganization(repo, {
          userId: user.id,
          name: ctx.body.name,
          slug: ctx.body.slug,
          description: ctx.body.description,
          city: ctx.body.city,
          country_code: ctx.body.country_code,
          plan: ctx.body.plan,
        }),
      )
    },
    { beforeHandle: [authGuard], body: CreateOrgBodySchema, detail: createOrganizationDetail },
  )
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
  .patch(
    '/organizations/:orgId',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await updateOrganization(repo, {
          orgId: ctx.params.orgId,
          requestingUserId: user.id,
          data: {
            name: ctx.body.name,
            description: ctx.body.description,
            logo_url: ctx.body.logo_url,
            website_url: ctx.body.website_url,
            city: ctx.body.city,
            country_code: ctx.body.country_code,
          },
        }),
      )
    },
    {
      beforeHandle: [authGuard, orgGuard('admin')],
      body: UpdateOrgBodySchema,
      detail: updateOrganizationDetail,
    },
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
      const result = await inviteMember(repo, {
        orgId: ctx.params.orgId,
        actorUserId: user.id,
        actorRole: membership?.role ?? 'admin',
        email: ctx.body.email,
        role: ctx.body.role,
        tournament_ids: ctx.body.tournament_ids,
      })
      if (result.ok) {
        notificationsQueue
          .add('invitation.sent', {
            type: 'invitation.sent',
            payload: {
              memberId: result.value.id,
              orgId: ctx.params.orgId,
              invitedByUserId: user.id,
            },
          })
          .catch((err: unknown) => {
            logger.warn('failed to enqueue invitation.sent job', {
              type: 'warn',
              error_message: err instanceof Error ? err.message : String(err),
              // biome-ignore lint/suspicious/noExplicitAny: logger meta is typed loosely
            } as any)
          })
      }
      return toApiResponse(ctx, result)
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
  .post(
    '/organizations/:orgId/transfer-ownership',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await transferOwnership(repo, {
          orgId: ctx.params.orgId,
          actorMemberId: membership?.id ?? '',
          actorUserId: user.id,
          actorRole: membership?.role ?? 'owner',
          newOwnerMemberId: ctx.body.new_owner_member_id,
        }),
      )
    },
    {
      beforeHandle: [authGuard, orgGuard('owner')],
      body: TransferOwnershipBodySchema,
      detail: transferOwnershipDetail,
    },
  )
  .post(
    '/organizations/:orgId/members/:memberId/suspend',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await suspendMember(repo, {
          orgId: ctx.params.orgId,
          memberId: ctx.params.memberId,
          actorUserId: user.id,
          actorRole: membership?.role ?? 'admin',
        }),
      )
    },
    { beforeHandle: [authGuard, orgGuard('admin')], detail: suspendMemberDetail },
  )
  .post(
    '/organizations/:orgId/members/:memberId/reactivate',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await reactivateMember(repo, {
          orgId: ctx.params.orgId,
          memberId: ctx.params.memberId,
          actorUserId: user.id,
          actorRole: membership?.role ?? 'admin',
        }),
      )
    },
    { beforeHandle: [authGuard, orgGuard('admin')], detail: reactivateMemberDetail },
  )
