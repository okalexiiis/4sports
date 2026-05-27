import { Elysia } from 'elysia'
import { DrizzleTournamentFormatRepository } from '@/modules/tournament-formats/drizzle-tournament-format.repository'
import { toApiResponse } from '@/shared/api-response'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { orgGuard } from '@/shared/middleware/org.guard'
import { DrizzleTournamentRepository } from '../../drizzle-tournament.repository'
import { createTournament } from '../../use-cases/create-tournament.use-case'
import { getTournament } from '../../use-cases/get-tournament.use-case'
import { listOrgTournaments } from '../../use-cases/list-org-tournaments.use-case'
import { listPublicTournaments } from '../../use-cases/list-public-tournaments.use-case'
import { publishTournament } from '../../use-cases/publish-tournament.use-case'
import { updateTournament } from '../../use-cases/update-tournament.use-case'
import {
  createTournamentDetail,
  getTournamentDetail,
  listOrgTournamentsDetail,
  listPublicTournamentsDetail,
  publishTournamentDetail,
  updateTournamentDetail,
} from './docs'
import {
  CreateTournamentBodySchema,
  PublicTournamentQuerySchema,
  PublishTournamentBodySchema,
  TournamentQuerySchema,
  UpdateTournamentBodySchema,
} from './schemas'

const repo = new DrizzleTournamentRepository()
const formatRepo = new DrizzleTournamentFormatRepository()

type AuthStore = { user: { id: string }; membership?: { organization_id: string; role: string } }

function parseTags(raw: string | undefined): string[] | undefined {
  if (!raw) return undefined
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export const tournamentsV1Routes = new Elysia({ tags: ['Tournaments'] })
  .post(
    '/organizations/:orgId/tournaments',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await createTournament(repo, formatRepo, {
        userId: user.id,
        orgId: ctx.params.orgId,
        name: ctx.body.name,
        slug: ctx.body.slug,
        description: ctx.body.description,
        sport_id: ctx.body.sport_id,
        format_id: ctx.body.format_id,
        tags: ctx.body.tags,
        settings: ctx.body.settings,
        player_fields: ctx.body.player_fields,
        max_teams: ctx.body.max_teams,
        min_teams: ctx.body.min_teams,
        min_players_per_team: ctx.body.min_players_per_team,
        max_players_per_team: ctx.body.max_players_per_team,
        is_public: ctx.body.is_public,
        requires_approval: ctx.body.requires_approval,
        gender_restriction: ctx.body.gender_restriction,
        validation_mode: ctx.body.validation_mode,
        eligibility_mode: ctx.body.eligibility_mode,
        starts_at: ctx.body.starts_at,
        ends_at: ctx.body.ends_at,
        registration_opens_at: ctx.body.registration_opens_at,
        registration_closes_at: ctx.body.registration_closes_at,
      })
      if (result.ok) ctx.set.status = 201
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, orgGuard('organizer')],
      body: CreateTournamentBodySchema,
      detail: createTournamentDetail,
    },
  )
  .put(
    '/tournaments/:tournamentId',
    async (ctx) => {
      const { membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await updateTournament(repo, {
          tournamentId: ctx.params.tournamentId,
          actorOrgId: membership?.organization_id ?? '',
          data: {
            name: ctx.body.name,
            description: ctx.body.description,
            sport_id: ctx.body.sport_id,
            format_id: ctx.body.format_id,
            tags: ctx.body.tags,
            settings: ctx.body.settings,
            player_fields: ctx.body.player_fields,
            max_teams: ctx.body.max_teams,
            min_teams: ctx.body.min_teams,
            min_players_per_team: ctx.body.min_players_per_team,
            max_players_per_team: ctx.body.max_players_per_team,
            is_public: ctx.body.is_public,
            requires_approval: ctx.body.requires_approval,
            gender_restriction: ctx.body.gender_restriction,
            validation_mode: ctx.body.validation_mode,
            eligibility_mode: ctx.body.eligibility_mode,
            wizard_step: undefined,
            starts_at: ctx.body.starts_at,
            ends_at: ctx.body.ends_at,
            registration_opens_at: ctx.body.registration_opens_at,
            registration_closes_at: ctx.body.registration_closes_at,
          },
        }),
      )
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      body: UpdateTournamentBodySchema,
      detail: updateTournamentDetail,
    },
  )
  .post(
    '/tournaments/:tournamentId/publish',
    async (ctx) => {
      const { membership } = ctx.store as AuthStore
      return toApiResponse(
        ctx,
        await publishTournament(repo, {
          tournamentId: ctx.params.tournamentId,
          actorOrgId: membership?.organization_id ?? '',
          visibility: ctx.body.visibility,
        }),
      )
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      body: PublishTournamentBodySchema,
      detail: publishTournamentDetail,
    },
  )
  .get(
    '/tournaments/:tournamentId',
    async (ctx) => {
      const store = ctx.store as { membership?: { organization_id: string } }
      return toApiResponse(
        ctx,
        await getTournament(repo, {
          tournamentId: ctx.params.tournamentId,
          actorOrgId: store.membership?.organization_id,
        }),
      )
    },
    { detail: getTournamentDetail },
  )
  .get(
    '/organizations/:orgId/tournaments',
    async (ctx) => {
      const result = await listOrgTournaments(repo, {
        orgId: ctx.params.orgId,
        filters: {
          status: ctx.query.status,
          tags: parseTags(ctx.query.tags),
          page: Number(ctx.query.page ?? 1),
          limit: Number(ctx.query.limit ?? 20),
        },
      })
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, orgGuard('viewer')],
      query: TournamentQuerySchema,
      detail: listOrgTournamentsDetail,
    },
  )
  .get(
    '/tournaments',
    async (ctx) => {
      const result = await listPublicTournaments(repo, {
        filters: {
          sport: ctx.query.sport,
          city: ctx.query.city,
          tags: parseTags(ctx.query.tags),
          q: ctx.query.q,
          page: Number(ctx.query.page ?? 1),
          limit: Number(ctx.query.limit ?? 20),
        },
      })
      return toApiResponse(ctx, result)
    },
    {
      query: PublicTournamentQuerySchema,
      detail: listPublicTournamentsDetail,
    },
  )
