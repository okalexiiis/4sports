import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { matches } from './matches'
import { sportEventTypes } from './sport-event-types'
import { players, teams } from './teams'

// Evento individual registrado en un partido (gol, tarjeta, cambio, etc.).
// is_draft = true mientras el partido no ha sido cerrado formalmente.
export const playerStatValues = pgTable(
  'player_stat_values',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    match_id: uuid('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    player_id: uuid('player_id')
      .notNull()
      .references(() => players.id, { onDelete: 'restrict' }),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    event_type_id: uuid('event_type_id')
      .notNull()
      .references(() => sportEventTypes.id, { onDelete: 'restrict' }),
    // Minuto del evento (opcional; no aplica en deportes sin tiempo corrido como voleibol).
    minute: integer('minute'),
    period_index: integer('period_index').notNull(),
    // true mientras el partido está en curso; false al confirmar cierre.
    is_draft: boolean('is_draft').notNull().default(false),
    registered_by: text('registered_by').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_player_stat_values_match').on(t.match_id),
    index('idx_player_stat_values_player').on(t.player_id),
    index('idx_player_stat_values_team').on(t.team_id),
  ],
)
