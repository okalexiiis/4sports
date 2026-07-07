import { integer, jsonb, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { convocatoriaResponseEnum, disputeStatusEnum, lineupRoleEnum } from './enums'
import { matches } from './matches'
import { players, teams } from './teams'

export const matchConvocatorias = pgTable(
  'match_convocatorias',
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
    response: convocatoriaResponseEnum('response').notNull().default('pending'),
    responded_at: timestamp('responded_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_match_convocatoria_player').on(t.match_id, t.player_id)],
)

export const matchLineups = pgTable(
  'match_lineups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    match_id: uuid('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    player_id: uuid('player_id')
      .notNull()
      .references(() => players.id, { onDelete: 'cascade' }),
    lineup_role: lineupRoleEnum('lineup_role').notNull(),
    field_position: text('field_position'),
    jersey_number: integer('jersey_number'),
    published_at: timestamp('published_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_match_lineup_player').on(t.match_id, t.player_id)],
)

export const matchDisputes = pgTable('match_disputes', {
  id: uuid('id').primaryKey().defaultRandom(),
  match_id: uuid('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  // BetterAuth users use text IDs
  opened_by: text('opened_by').notNull(),
  reason: text('reason').notNull(),
  description: text('description').notNull(),
  evidence_urls: text('evidence_urls').array(),
  status: disputeStatusEnum('status').notNull().default('open'),
  resolution_notes: text('resolution_notes'),
  // { home: number, away: number } — set only when organizer overrides the original score
  final_score_override: jsonb('final_score_override'),
  resolved_by: text('resolved_by'),
  resolved_at: timestamp('resolved_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
