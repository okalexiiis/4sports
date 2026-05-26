import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import {
  eligibilityModeEnum,
  genderRestrictionEnum,
  tournamentStatusEnum,
  validationModeEnum,
} from './enums'
import { organizations } from './organizations'
import { sports } from './sports'
import { tournamentFormats } from './tournament-formats'

export const tournaments = pgTable(
  'tournaments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organization_id: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    sport_id: uuid('sport_id').references(() => sports.id, { onDelete: 'set null' }),
    format_id: uuid('format_id').references(() => tournamentFormats.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    banner_url: text('banner_url'),
    rules_pdf_url: text('rules_pdf_url'),
    // GAP-103: tags for filtering (e.g. 'Femenil', 'Sub-17', 'Veteranos')
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    status: tournamentStatusEnum('status').notNull().default('draft'),
    gender_restriction: genderRestrictionEnum('gender_restriction').notNull().default('none'),
    validation_mode: validationModeEnum('validation_mode').notNull().default('hybrid'),
    eligibility_mode: eligibilityModeEnum('eligibility_mode').notNull().default('flexible'),
    // GAP-104: settings JSONB shape:
    // { points_win, points_draw, points_loss, tiebreaker: string[],
    //   walkover_score: { winner, loser }, has_third_place_match,
    //   rounds_per_match, sets_to_win, dispute_window_hours }
    settings: jsonb('settings').notNull().default({}),
    // player_fields shape: { sex: { visible, required }, birth_date: { visible, required }, ... }
    player_fields: jsonb('player_fields').notNull().default({}),
    max_teams: integer('max_teams'),
    min_teams: integer('min_teams'),
    min_players_per_team: integer('min_players_per_team'),
    max_players_per_team: integer('max_players_per_team'),
    is_public: boolean('is_public').notNull().default(true),
    requires_approval: boolean('requires_approval').notNull().default(true),
    join_code: text('join_code'),
    // Stamped at publish, immutable after. Null = draft.
    created_under_plan: text('created_under_plan'),
    // GAP-101: tracks wizard progress so organizers can resume after closing the app
    wizard_step: integer('wizard_step').notNull().default(1),
    wizard_completed_at: timestamp('wizard_completed_at', { withTimezone: true }),
    starts_at: timestamp('starts_at', { withTimezone: true }),
    ends_at: timestamp('ends_at', { withTimezone: true }),
    registration_opens_at: timestamp('registration_opens_at', { withTimezone: true }),
    registration_closes_at: timestamp('registration_closes_at', { withTimezone: true }),
    created_by: text('created_by').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    unique('uq_tournament_org_slug').on(t.organization_id, t.slug),
    index('idx_tournaments_org_status').on(t.organization_id, t.status),
    index('idx_tournaments_public_directory')
      .on(t.status, t.is_public)
      .where(sql`${t.is_public} = true AND ${t.status} IN ('open_registration', 'active')`),
  ],
)

// Tracks which sport metrics are enabled for a tournament.
// Initialized from sports.metadata when the tournament is created.
export const tournamentMetrics = pgTable('tournament_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  tournament_id: uuid('tournament_id')
    .notNull()
    .references(() => tournaments.id, { onDelete: 'cascade' }),
  metric_key: text('metric_key').notNull(),
  metric_name: text('metric_name').notNull(),
  is_enabled: boolean('is_enabled').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Optional sub-divisions within a tournament (e.g. 'Primera Fuerza', 'Segunda Fuerza').
export const tournamentCategories = pgTable('tournament_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tournament_id: uuid('tournament_id')
    .notNull()
    .references(() => tournaments.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
