import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { db } from '@/shared/db/client'
import { tournaments } from '@/shared/db/schemas'
import { activeOrgGuard } from '@/shared/middleware/active-org.guard'
import { authGuard } from '@/shared/middleware/auth.guard'
import { DrizzleMatchRepository } from '../../drizzle-match.repository'
import { MatchErrors } from '../../errors'
import { createMatch } from '../../use-cases/create-match.use-case'
import { getMatch } from '../../use-cases/get-match.use-case'
import { listMatches } from '../../use-cases/list-matches.use-case'
import { transitionMatchStatus } from '../../use-cases/transition-match-status.use-case'
import {
  createMatchDetail,
  deleteMatchDetail,
  getMatchDetail,
  listMatchesDetail,
  transitionStatusDetail,
  updateMatchDetail,
} from './docs'
import {
  CreateMatchBodySchema,
  ListMatchesQuerySchema,
  TransitionStatusBodySchema,
  UpdateMatchBodySchema,
} from './schemas'

const repo = new DrizzleMatchRepository()

type AuthStore = { user: { id: string } }

export const matchesV1Routes = new Elysia({ tags: ['Matches'] })
  .post(
    '/tournaments/:tournamentId/matches',
    async (ctx) => {
      const result = await createMatch(repo, {
        tournament_id: ctx.params.tournamentId,
        home_team_id: ctx.body.home_team_id,
        away_team_id: ctx.body.away_team_id,
        scheduled_at: new Date(ctx.body.scheduled_at),
        venue_id: ctx.body.venue_id ?? null,
        round_id: ctx.body.round_id ?? null,
        notes: ctx.body.notes ?? null,
      })
      if (result.ok) ctx.set.status = 201
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      body: CreateMatchBodySchema,
      detail: createMatchDetail,
    },
  )
  .get(
    '/tournaments/:tournamentId/matches',
    async (ctx) => {
      const result = await listMatches(repo, {
        tournamentId: ctx.params.tournamentId,
        filters: {
          status: ctx.query.status as never,
          round_id: ctx.query.round_id,
          team_id: ctx.query.team_id,
        },
      })
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard],
      query: ListMatchesQuerySchema,
      detail: listMatchesDetail,
    },
  )
  .get(
    '/matches/:matchId',
    async (ctx) => {
      const result = await getMatch(repo, { matchId: ctx.params.matchId })
      return toApiResponse(ctx, result)
    },
    { detail: getMatchDetail },
  )
  .patch(
    '/matches/:matchId',
    async (ctx) => {
      const match = await repo.findById(ctx.params.matchId)
      if (!match) {
        return toApiResponse(ctx, {
          ok: false as const,
          error: MatchErrors.notFound(ctx.params.matchId),
        })
      }
      if (match.status !== 'scheduled') {
        return toApiResponse(ctx, {
          ok: false as const,
          error: MatchErrors.notEditable(match.status),
        })
      }
      const updated = await repo.update(ctx.params.matchId, {
        scheduled_at: ctx.body.scheduled_at ? new Date(ctx.body.scheduled_at) : undefined,
        venue_id: ctx.body.venue_id,
        notes: ctx.body.notes,
      })
      return toApiResponse(ctx, { ok: true as const, value: updated })
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      body: UpdateMatchBodySchema,
      detail: updateMatchDetail,
    },
  )
  .delete(
    '/matches/:matchId',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      const result = await transitionMatchStatus(repo, {
        matchId: ctx.params.matchId,
        newStatus: 'cancelled',
        actorId: user.id,
      })
      if (!result.ok) return toApiResponse(ctx, result)
      ctx.set.status = 204
      return
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('admin')],
      detail: deleteMatchDetail,
    },
  )
  .patch(
    '/matches/:matchId/status',
    async (ctx) => {
      const { user } = ctx.store as AuthStore
      let walkoverScore: string | undefined

      if (ctx.body.status === 'walkover') {
        const match = await repo.findById(ctx.params.matchId)
        if (!match) {
          return toApiResponse(ctx, {
            ok: false as const,
            error: MatchErrors.notFound(ctx.params.matchId),
          })
        }
        const [tournament] = await db
          .select({ settings: tournaments.settings })
          .from(tournaments)
          .where(eq(tournaments.id, match.tournament_id))
          .limit(1)

        const settings = tournament?.settings as Record<string, unknown> | undefined
        const rawScore = settings?.walkover_score
        walkoverScore = typeof rawScore === 'string' ? rawScore : undefined
      }

      const result = await transitionMatchStatus(repo, {
        matchId: ctx.params.matchId,
        newStatus: ctx.body.status,
        actorId: user.id,
        reason: ctx.body.reason,
        walkoverScore,
        winnerTeamId: ctx.body.winner_team_id,
      })
      return toApiResponse(ctx, result)
    },
    {
      beforeHandle: [authGuard, activeOrgGuard('organizer')],
      body: TransitionStatusBodySchema,
      detail: transitionStatusDetail,
    },
  )
