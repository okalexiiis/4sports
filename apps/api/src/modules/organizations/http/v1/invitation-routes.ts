import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleOrganizationRepository } from '../../drizzle-organization.repository'
import { acceptInvitation } from '../../use-cases/accept-invitation.use-case'
import { listUserInvitations } from '../../use-cases/list-user-invitations.use-case'
import { rejectInvitation } from '../../use-cases/reject-invitation.use-case'
import {
  acceptInvitationDetail,
  listUserInvitationsDetail,
  rejectInvitationDetail,
} from './invitation-docs'

const repo = new DrizzleOrganizationRepository()

type AuthStore = { user: { id: string } }

export const invitationsV1Routes = new Elysia({ tags: ['Invitations'] })
  .post(
    '/invitations/:memberId/accept',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await acceptInvitation(repo, { memberId: ctx.params.memberId, requestingUserId: user.id }),
      )
    },
    { beforeHandle: [authGuard], detail: acceptInvitationDetail },
  )
  .post(
    '/invitations/:memberId/reject',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await rejectInvitation(repo, {
        memberId: ctx.params.memberId,
        requestingUserId: user.id,
      })
      if (!result.ok) return toApiResponse(ctx, result)
      ctx.set.status = 204
    },
    { beforeHandle: [authGuard], detail: rejectInvitationDetail },
  )
  .get(
    '/me/invitations',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(ctx, await listUserInvitations(repo, { userId: user.id }))
    },
    { beforeHandle: [authGuard], detail: listUserInvitationsDetail },
  )
