import { boolean, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const sports = pgTable('sports', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  icon_url: text('icon_url'),
  is_active: boolean('is_active').notNull().default(true),
  // Contains default tiebreakers, points system, and scoring metadata for this sport.
  // Shape: { tiebreaker: string[], points_win: number, points_draw: number, points_loss: number, scoring_type: 'points' | 'pct' }
  metadata: jsonb('metadata').notNull().default({}),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const sportPositions = pgTable('sport_positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sport_id: uuid('sport_id')
    .notNull()
    .references(() => sports.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  abbreviation: text('abbreviation'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
