import { sql } from 'drizzle-orm'
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { disputeStatusEnum } from './enums'
import { matches } from './matches'

// Disputa formal de resultado. Abierta por el capitán dentro de la ventana configurable.
// El organizador puede mantener el resultado o modificarlo al resolver.
export const matchDisputes = pgTable('match_disputes', {
  id: uuid('id').primaryKey().defaultRandom(),
  match_id: uuid('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  opened_by: text('opened_by').notNull(),
  reason: text('reason').notNull(),
  description: text('description').notNull(),
  // URLs de evidencias adjuntas (imágenes, videos, documentos).
  evidence_urls: text('evidence_urls').array().notNull().default(sql`'{}'::text[]`),
  status: disputeStatusEnum('status').notNull().default('open'),
  resolution_notes: text('resolution_notes'),
  resolved_by: text('resolved_by'),
  resolved_at: timestamp('resolved_at', { withTimezone: true }),
  // Si el organizador modifica el resultado: { home_score, away_score, winner_team_id }
  final_score_override: jsonb('final_score_override'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
