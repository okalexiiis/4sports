import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { tournaments } from './tournaments'

// Catálogo de eventos válidos para un torneo específico.
// El organizador define qué eventos aplican (gol, tarjeta, cambio, etc.).
export const sportEventTypes = pgTable(
  'sport_event_types',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tournament_id: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    // Si true, el jugador queda expulsado del partido y se genera una suspensión en borrador.
    forces_game_ejection: boolean('forces_game_ejection').notNull().default(false),
    // Número de partidos de suspensión que aplica al confirmar la sanción.
    suspension_matches: integer('suspension_matches').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_sport_event_types_tournament').on(t.tournament_id)],
)
