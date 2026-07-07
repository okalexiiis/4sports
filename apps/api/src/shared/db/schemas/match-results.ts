import { integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { matches } from './matches'

// Marcador desglosado por período (1er Tiempo, Set 1, OT, Penales, etc.).
export const matchResults = pgTable(
  'match_results',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    match_id: uuid('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    // Etiqueta legible del período, ej. "1er Tiempo", "Set 1", "Tiempo Extra"
    period_label: text('period_label').notNull(),
    period_index: integer('period_index').notNull(),
    home_score: integer('home_score').notNull().default(0),
    away_score: integer('away_score').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_match_result_period').on(t.match_id, t.period_index)],
)
