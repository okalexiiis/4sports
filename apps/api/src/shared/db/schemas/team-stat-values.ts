import { boolean, integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { matches } from './matches'
import { teams } from './teams'

// Estadísticas agregadas de equipo por partido (posesión, tiros a gol, etc.).
// is_draft sigue la misma mecánica que player_stat_values.
export const teamStatValues = pgTable(
  'team_stat_values',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    match_id: uuid('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    stat_key: text('stat_key').notNull(),
    stat_value: integer('stat_value').notNull().default(0),
    is_draft: boolean('is_draft').notNull().default(false),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_team_stat_value').on(t.match_id, t.team_id, t.stat_key)],
)
