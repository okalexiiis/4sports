import { boolean, char, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  logo_url: text('logo_url'),
  website_url: text('website_url'),
  country_code: char('country_code', { length: 2 }),
  city: text('city'),
  is_verified: boolean('is_verified').notNull().default(false),
  gateway_type: text('gateway_type'),
  gateway_account_id: text('gateway_account_id'),
  gateway_connected_at: timestamp('gateway_connected_at', { withTimezone: true }),
  gateway_connected_by: text('gateway_connected_by'),
  // GAP-001: tracks onboarding step so users can resume after app close
  onboarding_step: integer('onboarding_step').notNull().default(1),
  metadata: jsonb('metadata').default({}),
  created_by: text('created_by').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})
