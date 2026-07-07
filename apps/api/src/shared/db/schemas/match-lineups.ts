import { integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { lineupRoleEnum } from './enums'
import { matches } from './matches'
import { players, teams } from './teams'

// Alineación táctica publicada por el capitán u organizador antes del partido.
export const matchLineups = pgTable(
  'match_lineups',
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
    lineup_role: lineupRoleEnum('lineup_role').notNull().default('starter'),
    field_position: text('field_position'),
    jersey_number: integer('jersey_number'),
    // Null hasta que el capitán/organizador publica la alineación oficialmente.
    published_at: timestamp('published_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_match_lineup_player').on(t.match_id, t.player_id)],
)
