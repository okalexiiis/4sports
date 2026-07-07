import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { matchStatusEnum } from './enums'
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
    // Etiqueta legible de la fase o jornada, ej. "Jornada 1", "Semifinal A"
    round_label: text('round_label'),
    match_number: integer('match_number'),
    status: matchStatusEnum('status').notNull().default('scheduled'),
    scheduled_at: timestamp('scheduled_at', { withTimezone: true }),
    started_at: timestamp('started_at', { withTimezone: true }),
    ended_at: timestamp('ended_at', { withTimezone: true }),
    home_score: integer('home_score').notNull().default(0),
    away_score: integer('away_score').notNull().default(0),
    winner_team_id: uuid('winner_team_id').references(() => teams.id, { onDelete: 'set null' }),
    // Token de acceso para árbitros sin cuenta. Se genera al crear el partido.
    referee_session_token: text('referee_session_token').unique(),
    // Referencia al partido siguiente en el bracket (eliminatoria).
    // Usamos AnyPgColumn para la auto-referencia circular.
    next_match_id: uuid('next_match_id').references((): AnyPgColumn => matches.id, {
      onDelete: 'set null',
    }),
    // Identificador de grupo para torneos en Modo Mundial (ej. "A", "B").
    group_id: text('group_id'),
    walkover_reason: text('walkover_reason'),
    notes: text('notes'),
    created_by: text('created_by').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_matches_tournament_status').on(t.tournament_id, t.status),
    index('idx_matches_home_team').on(t.home_team_id),
    index('idx_matches_away_team').on(t.away_team_id),
  ],
)
