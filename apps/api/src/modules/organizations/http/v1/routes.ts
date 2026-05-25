import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { orgGuard } from '@/shared/middleware/org.guard'
import { DrizzleOrganizationRepository } from '../../drizzle-organization.repository'
import { acceptInvitation } from '../../use-cases/accept-invitation.use-case'
import { createOrganization } from '../../use-cases/create-organization.use-case'
import { getOrganization } from '../../use-cases/get-organization.use-case'
import { inviteMember } from '../../use-cases/invite-member.use-case'
import { listMembers } from '../../use-cases/list-members.use-case'
import { rejectInvitation } from '../../use-cases/reject-invitation.use-case'
import { removeMember } from '../../use-cases/remove-member.use-case'
import { suspendMember } from '../../use-cases/suspend-member.use-case'
import { transferOwnership } from '../../use-cases/transfer-ownership.use-case'
import { updateMemberRole } from '../../use-cases/update-member-role.use-case'
import {
  acceptInvitationDetail,
  createOrganizationDetail,
  getOrganizationDetail,
  inviteMemberDetail,
  listMembersDetail,
  rejectInvitationDetail,
  removeMemberDetail,
  suspendMemberDetail,
  transferOwnershipDetail,
  updateMemberRoleDetail,
} from './docs'
import {
  CreateOrgBodySchema,
  InviteMemberBodySchema,
  MembersQuerySchema,
  SuspendMemberBodySchema,
  TransferOwnershipBodySchema,
  UpdateMemberRoleBodySchema,
} from './schemas'

const repo = new DrizzleOrganizationRepository()

type AuthStore = { user: { id: string }; membership?: { role: string } }

export const organizationsV1Routes = new Elysia({ tags: ['Organizations'] })
  .post(
    '/organizations',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(ctx, await createOrganization(repo, { userId: user.id, data: ctx.body }))
    },
    { beforeHandle: authGuard, body: CreateOrgBodySchema, detail: createOrganizationDetail },
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
  .patch(
    '/organizations/:orgId/members/:memberId',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await suspendMember(repo, {
          orgId: ctx.params.orgId,
          memberId: ctx.params.memberId,
          actorUserId: user.id,
          actorRole: membership?.role ?? 'admin',
          action: ctx.body.action,
        }),
      )
    },
    {
      beforeHandle: [authGuard, orgGuard('admin')],
      body: SuspendMemberBodySchema,
      detail: suspendMemberDetail,
    },
  )
  .post(
    '/organizations/:orgId/transfer-ownership',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await transferOwnership(repo, {
          orgId: ctx.params.orgId,
          newOwnerMemberId: ctx.body.new_owner_member_id,
          actorUserId: user.id,
          actorRole: membership?.role ?? 'owner',
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
    '/organizations/:orgId/invitation/accept',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await acceptInvitation(repo, { orgId: ctx.params.orgId, userId: user.id }),
      )
    },
    { beforeHandle: authGuard, detail: acceptInvitationDetail },
  )
  .post(
    '/organizations/:orgId/invitation/reject',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await rejectInvitation(repo, { orgId: ctx.params.orgId, userId: user.id }),
      )
    },
    { beforeHandle: authGuard, detail: rejectInvitationDetail },
  )
