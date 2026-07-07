import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { playerStatValues } from './player-stat-values'
import { players } from './teams'
import { tournaments } from './tournaments'

// Suspensiones por torneo. Nunca son globales entre torneos ni entre organizaciones.
// Se crean en borrador al registrar un evento con forces_game_ejection = true;
// el organizador las confirma desde el Panel de Disciplina.
export const playerSuspensions = pgTable(
  'player_suspensions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    player_id: uuid('player_id')
      .notNull()
      .references(() => players.id, { onDelete: 'restrict' }),
    tournament_id: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    // Evento que originó la suspensión.
    stat_value_id: uuid('stat_value_id').references(() => playerStatValues.id, {
      onDelete: 'set null',
    }),
    suspension_matches: integer('suspension_matches').notNull().default(1),
    matches_served: integer('matches_served').notNull().default(0),
    // true = pendiente de confirmación; false = confirmada por el organizador.
    is_draft: boolean('is_draft').notNull().default(true),
    confirmed_by: text('confirmed_by'),
    confirmed_at: timestamp('confirmed_at', { withTimezone: true }),
    notes: text('notes'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_suspensions_tournament_player').on(t.tournament_id, t.player_id)],
)
