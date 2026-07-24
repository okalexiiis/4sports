import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleTeamRepository } from '../../drizzle-team.repository'
import { addGuestPlayer, inviteUser } from '../../use-cases/add-player.use-case'
import { createTeam } from '../../use-cases/create-team.use-case'
import { listTeamMembers } from '../../use-cases/list-team-members.use-case'
import { removeTeamMember } from '../../use-cases/remove-team-member.use-case'
import { updateTeam } from '../../use-cases/update-team.use-case'
import {
  addPlayerDetail,
  createTeamDetail,
  listTeamMembersDetail,
  removeTeamMemberDetail,
  updateTeamDetail,
} from './docs'
import { AddPlayerBodySchema, CreateTeamBodySchema, UpdateTeamBodySchema } from './schemas'

const repo = new DrizzleTeamRepository()

type AuthStore = { user: { id: string; name: string | null } }

export const teamsV1Routes = new Elysia({ tags: ['Teams'] })
  .post(
    '/teams',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await createTeam(repo, {
        userId: user.id,
        captainDisplayName: user.name ?? user.id,
        data: {
          name: ctx.body.name,
          short_name: ctx.body.short_name,
          logo_url: ctx.body.logo_url,
          primary_color: ctx.body.primary_color,
          secondary_color: ctx.body.secondary_color,
          city: ctx.body.city,
          country_code: ctx.body.country_code,
          gender_type: ctx.body.gender_type,
          join_policy: ctx.body.join_policy,
          organization_id: ctx.body.organization_id,
        },
      })
      if (result.ok) ctx.set.status = 201
      return toApiResponse(ctx, result)
    },
    { beforeHandle: [authGuard], body: CreateTeamBodySchema, detail: createTeamDetail },
  )
  .patch(
    '/teams/:teamId',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await updateTeam(repo, {
          teamId: ctx.params.teamId,
          actorUserId: user.id,
          data: {
            name: ctx.body.name,
            short_name: ctx.body.short_name,
            logo_url: ctx.body.logo_url,
            primary_color: ctx.body.primary_color,
            secondary_color: ctx.body.secondary_color,
            city: ctx.body.city,
            country_code: ctx.body.country_code,
            gender_type: ctx.body.gender_type,
            join_policy: ctx.body.join_policy,
          },
        }),
      )
    },
    { beforeHandle: [authGuard], body: UpdateTeamBodySchema, detail: updateTeamDetail },
  )
  .get(
    '/teams/:teamId/members',
    async (ctx) => {
      const result = await listTeamMembers(repo, { teamId: ctx.params.teamId })
      if (!result.ok) return toApiResponse(ctx, result)
      return { data: result.value }
    },
    { beforeHandle: [authGuard], detail: listTeamMembersDetail },
  )
  .post(
    '/teams/:teamId/players',
    async (ctx) => {
      const { user } = ctx.store as AuthStore

      if (ctx.body.type === 'guest') {
        const result = await addGuestPlayer(repo, {
          teamId: ctx.params.teamId,
          actorUserId: user.id,
          data: {
            display_name: ctx.body.display_name,
            avatar_url: ctx.body.avatar_url,
            jersey_number: ctx.body.jersey_number,
            position: ctx.body.position,
            sex: ctx.body.sex,
            date_of_birth: ctx.body.date_of_birth,
            email: ctx.body.email,
            phone: ctx.body.phone,
          },
        })
        if (result.ok) ctx.set.status = 201
        return toApiResponse(ctx, result)
      }

      const result = await inviteUser(repo, {
        teamId: ctx.params.teamId,
        actorUserId: user.id,
        data: {
          invited_user_id: ctx.body.invited_user_id,
          role: ctx.body.role,
          jersey_number: ctx.body.jersey_number,
        },
      })
      if (result.ok) ctx.set.status = 201
      return toApiResponse(ctx, result)
    },
    { beforeHandle: [authGuard], body: AddPlayerBodySchema, detail: addPlayerDetail },
  )
  .delete(
    '/teams/:teamId/members/:memberId',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await removeTeamMember(repo, {
        teamId: ctx.params.teamId,
        memberId: ctx.params.memberId,
        actorUserId: user.id,
      })
      if (!result.ok) return toApiResponse(ctx, result)
      ctx.set.status = 204
      return
    },
    { beforeHandle: [authGuard], detail: removeTeamMemberDetail },
  )
