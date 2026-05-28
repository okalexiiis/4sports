import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { sportEventTypes } from './match-stats'
import { matches } from './matches'
import { players, teams } from './teams'
import { tournaments } from './tournaments'

export const playerSuspensions = pgTable(
  'player_suspensions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    player_id: uuid('player_id')
      .notNull()
      .references(() => players.id, { onDelete: 'cascade' }),
    tournament_id: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    match_id: uuid('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    event_type_id: uuid('event_type_id')
      .notNull()
      .references(() => sportEventTypes.id, { onDelete: 'restrict' }),
    suspension_matches: integer('suspension_matches').notNull(),
    // true = pending organizer review in the Discipline Panel
    // false = confirmed; player is blocked for the next suspension_matches matches
    is_draft: boolean('is_draft').notNull().default(true),
    // BetterAuth user ID of the organizer who confirmed the suspension
    confirmed_by: text('confirmed_by'),
    confirmed_at: timestamp('confirmed_at', { withTimezone: true }),
    // Written when the organizer overrides the default suspension_matches value
    justification: text('justification'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_player_suspensions_player_tournament').on(t.player_id, t.tournament_id),
    index('idx_player_suspensions_match').on(t.match_id),
    index('idx_player_suspensions_draft').on(t.is_draft),
  ],
)

export const standings = pgTable(
  'standings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tournament_id: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    // group_id will reference tournament_groups once that table is created.
    // Null for single-group (league) tournaments.
    group_id: uuid('group_id'),
    calculated_at: timestamp('calculated_at', { withTimezone: true }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_standings_tournament_group').on(t.tournament_id, t.group_id)],
)

export const standingEntries = pgTable(
  'standing_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    standing_id: uuid('standing_id')
      .notNull()
      .references(() => standings.id, { onDelete: 'cascade' }),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    played: integer('played').notNull().default(0),
    won: integer('won').notNull().default(0),
    drawn: integer('drawn').notNull().default(0),
    lost: integer('lost').notNull().default(0),
    goals_for: integer('goals_for').notNull().default(0),
    goals_against: integer('goals_against').notNull().default(0),
    goal_difference: integer('goal_difference').notNull().default(0),
    points: integer('points').notNull().default(0),
  },
  (t) => [unique('uq_standing_entry_team').on(t.standing_id, t.team_id)],
)
