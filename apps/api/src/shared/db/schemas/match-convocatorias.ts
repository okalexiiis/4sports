import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { convocatoriaResponseEnum } from './enums'
import { matches } from './matches'
import { players, teams } from './teams'

// Respuesta de asistencia de cada jugador convocado para un partido.
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
    sent_by: text('sent_by').notNull(),
    responded_at: timestamp('responded_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_match_convocatoria').on(t.match_id, t.player_id)],
)
