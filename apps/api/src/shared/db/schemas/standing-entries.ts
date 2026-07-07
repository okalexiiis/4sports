import { integer, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { standings } from './standings'
import { teams } from './teams'

// Fila de posición de un equipo en la tabla de posiciones.
// PJ=Jugados, PG=Ganados, PE=Empatados, PP=Perdidos,
// GF=Goles Favor, GC=Goles Contra, DG=Diferencia, PTS=Puntos.
export const standingEntries = pgTable(
  'standing_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    standing_id: uuid('standing_id')
      .notNull()
      .references(() => standings.id, { onDelete: 'cascade' }),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    position: integer('position').notNull(),
    pj: integer('pj').notNull().default(0),
    pg: integer('pg').notNull().default(0),
    pe: integer('pe').notNull().default(0),
    pp: integer('pp').notNull().default(0),
    gf: integer('gf').notNull().default(0),
    gc: integer('gc').notNull().default(0),
    dg: integer('dg').notNull().default(0),
    pts: integer('pts').notNull().default(0),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_standing_entry').on(t.standing_id, t.team_id)],
)
