import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tournamentFormats = pgTable('tournament_formats', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  // Minimum plan required: 'free' | 'starter' | 'pro' | 'elite'
  plan_required: text('plan_required').notNull().default('free'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
