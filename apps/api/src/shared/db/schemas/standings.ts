import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { tournaments } from './tournaments'

// Tabla de posiciones de un torneo o grupo.
// Se recalcula desde cero al confirmar cada resultado — no usa deltas incrementales.
export const standings = pgTable(
  'standings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tournament_id: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    // Identificador de grupo para torneos en Modo Mundial (ej. "A", "B"). Null = torneo completo.
    group_id: text('group_id'),
    last_calculated_at: timestamp('last_calculated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_standings_tournament_group').on(t.tournament_id, t.group_id)],
)
