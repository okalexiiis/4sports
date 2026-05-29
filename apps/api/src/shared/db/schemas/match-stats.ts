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
import { matches } from './matches'
import { players, teams } from './teams'
import { tournaments } from './tournaments'

export const sportEventTypes = pgTable(
  'sport_event_types',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tournament_id: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    // When true, the player is immediately blocked for the rest of the match
    // and a draft suspension is created automatically.
    forces_game_ejection: boolean('forces_game_ejection').notNull().default(false),
    // Number of subsequent matches the player is suspended if ejected.
    // Read by the sanctions engine — never hardcoded in use cases.
    suspension_matches: integer('suspension_matches').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_sport_event_type_slug').on(t.tournament_id, t.slug)],
)

export const playerStatValues = pgTable(
  'player_stat_values',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    match_id: uuid('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    player_id: uuid('player_id')
      .notNull()
      .references(() => players.id, { onDelete: 'cascade' }),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    event_type_id: uuid('event_type_id')
      .notNull()
      .references(() => sportEventTypes.id, { onDelete: 'restrict' }),
    // Optional — some sports don't track per-minute events (e.g. volleyball sets)
    minute: integer('minute'),
    period_index: integer('period_index').notNull(),
    // true while the match is live or just closed; false once the organizer confirms results
    is_draft: boolean('is_draft').notNull().default(true),
    // BetterAuth user ID of the referee or organizer who registered the event
    created_by: text('created_by').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_player_stat_values_match').on(t.match_id),
    index('idx_player_stat_values_player').on(t.player_id),
  ],
)

export const teamStatValues = pgTable(
  'team_stat_values',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    match_id: uuid('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    event_type_id: uuid('event_type_id')
      .notNull()
      .references(() => sportEventTypes.id, { onDelete: 'restrict' }),
    value: integer('value').notNull(),
    is_draft: boolean('is_draft').notNull().default(true),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_team_stat_values_match').on(t.match_id)],
)
