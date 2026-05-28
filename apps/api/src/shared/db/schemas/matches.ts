import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { assignmentRoleEnum, matchStatusEnum } from './enums'
import { teams } from './teams'
import { tournaments } from './tournaments'
import { venues } from './venues'

export const matches = pgTable(
  'matches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tournament_id: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    home_team_id: uuid('home_team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    away_team_id: uuid('away_team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    venue_id: uuid('venue_id').references(() => venues.id, { onDelete: 'set null' }),
    // round_id will reference tournament_rounds once that table is created in a future issue
    round_id: uuid('round_id'),
    status: matchStatusEnum('status').notNull().default('scheduled'),
    home_score: integer('home_score'),
    away_score: integer('away_score'),
    winner_team_id: uuid('winner_team_id').references(() => teams.id, { onDelete: 'set null' }),
    scheduled_at: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    started_at: timestamp('started_at', { withTimezone: true }),
    ended_at: timestamp('ended_at', { withTimezone: true }),
    // Token that grants a referee access to this match without a platform account.
    // Passed as Bearer token; scoped strictly to this match.
    referee_session_token: text('referee_session_token').unique(),
    // Points to the next match in a bracket where the winner advances automatically.
    next_match_id: uuid('next_match_id').references((): AnyPgColumn => matches.id, {
      onDelete: 'set null',
    }),
    notes: text('notes'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_matches_tournament_status').on(t.tournament_id, t.status),
    index('idx_matches_scheduled_at').on(t.scheduled_at),
    index('idx_matches_referee_token').on(t.referee_session_token),
  ],
)

export const matchResults = pgTable('match_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  match_id: uuid('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  period_label: text('period_label').notNull(),
  period_index: integer('period_index').notNull(),
  home_score: integer('home_score').notNull(),
  away_score: integer('away_score').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const matchAssignments = pgTable('match_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  match_id: uuid('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  // Null when the referee accesses via referee_session_token without a platform account.
  user_id: text('user_id'),
  role: assignmentRoleEnum('role').notNull(),
  assigned_at: timestamp('assigned_at', { withTimezone: true }).notNull().defaultNow(),
})
