import { Elysia } from 'elysia'
import { DrizzleTeamRepository } from '@/modules/teams/drizzle-team.repository'
import { DrizzleTournamentRepository } from '@/modules/tournaments/drizzle-tournament.repository'
import { toApiResponse } from '@/shared/api-response'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleRegistrationRepository } from '../../drizzle-registration.repository'
import { RegistrationErrors } from '../../errors'
import { listRegistrations } from '../../use-cases/list-registrations.use-case'
import { registerTeam } from '../../use-cases/register-team.use-case'
import { reviewRegistration } from '../../use-cases/review-registration.use-case'
import { listRegistrationsDetail, registerTeamDetail, reviewRegistrationDetail } from './docs'
import {
  RegisterTeamBodySchema,
  RegistrationsQuerySchema,
  ReviewRegistrationBodySchema,
} from './schemas'

const registrationRepo = new DrizzleRegistrationRepository()
const teamRepo = new DrizzleTeamRepository()
const tournamentRepo = new DrizzleTournamentRepository()

type AuthStore = { user: { id: string }; membership?: { organization_id: string; role: string } }

export const registrationsV1Routes = new Elysia({ tags: ['Registrations'] })
  .post(
    '/tournaments/:tournamentId/registrations',
    async (ctx) => {
      const { user } = ctx.store as AuthStore

      const tournament = await tournamentRepo.findById(ctx.params.tournamentId)
      if (!tournament) {
        return toApiResponse(ctx, {
          ok: false as const,
          error: RegistrationErrors.tournamentNotFound(ctx.params.tournamentId),
        })
      }

      const result = await registerTeam(registrationRepo, teamRepo, {
        tournamentId: ctx.params.tournamentId,
        teamId: ctx.body.team_id,
        registeredBy: user.id,
        tournament: {
          id: tournament.id,
          status: tournament.status,
          max_teams: tournament.max_teams,
          requires_approval: tournament.requires_approval,
          gender_restriction: tournament.gender_restriction,
          validation_mode: tournament.validation_mode,
          eligibility_mode: tournament.eligibility_mode,
        },
      })

      if (result.ok) ctx.set.status = 201
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard],
      body: RegisterTeamBodySchema,
      detail: registerTeamDetail,
    },
  )
  .put(
    '/tournaments/:tournamentId/registrations/:registrationId',
    async (ctx) => {
      const { user, membership } = ctx.store as AuthStore

      const tournament = await tournamentRepo.findById(ctx.params.tournamentId)
      if (!tournament) {
        return toApiResponse(ctx, {
          ok: false as const,
          error: RegistrationErrors.tournamentNotFound(ctx.params.tournamentId),
        })
      }

      return toApiResponse(
        ctx,
        await reviewRegistration(registrationRepo, {
          registrationId: ctx.params.registrationId,
          actorOrgId: membership?.organization_id ?? '',
          tournamentOrgId: tournament.organization_id,
          newStatus: ctx.body.status,
          rejectionReason: ctx.body.rejection_reason,
          reviewedBy: user.id,
        }),
      )
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      body: ReviewRegistrationBodySchema,
      detail: reviewRegistrationDetail,
    },
  )
  .get(
    '/tournaments/:tournamentId/registrations',
    async (ctx) => {
      return toApiResponse(
        ctx,
        await listRegistrations(registrationRepo, {
          tournamentId: ctx.params.tournamentId,
          filters: {
            status: ctx.query.status,
            page: Number(ctx.query.page ?? 1),
            limit: Number(ctx.query.limit ?? 20),
          },
        }),
      )
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('viewer')],
      query: RegistrationsQuerySchema,
      detail: listRegistrationsDetail,
    },
  )
