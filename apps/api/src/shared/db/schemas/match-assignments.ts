import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { assignmentRoleEnum } from './enums'
import { matches } from './matches'

// Árbitros y staff asignados a un partido con su rol específico.
// user_id es nullable para permitir árbitros externos sin cuenta en la plataforma.
export const matchAssignments = pgTable('match_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  match_id: uuid('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  // Null si el árbitro no tiene cuenta registrada.
  user_id: text('user_id'),
  // Nombre para árbitros externos (requerido si user_id es null).
  name: text('name'),
  role: assignmentRoleEnum('role').notNull().default('referee'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
