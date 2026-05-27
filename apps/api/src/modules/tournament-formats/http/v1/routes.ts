import { Elysia } from 'elysia'
import { toApiResponse } from '@/shared/api-response'
import { DrizzleTournamentFormatRepository } from '../../drizzle-tournament-format.repository'
import { listTournamentFormats } from '../../use-cases/list-tournament-formats.use-case'
import { listTournamentFormatsDetail } from './docs'

const repo = new DrizzleTournamentFormatRepository()

export const tournamentFormatsV1Routes = new Elysia({ tags: ['Tournament Formats'] }).get(
  '/tournament-formats',
  async (ctx) => toApiResponse(ctx, await listTournamentFormats(repo)),
  { detail: listTournamentFormatsDetail },
)
