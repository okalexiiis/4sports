import { boolean, char, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  price_monthly: integer('price_monthly').notNull().default(0),
  price_yearly: integer('price_yearly'),
  currency: char('currency', { length: 3 }).notNull().default('MXN'),
  is_active: boolean('is_active').notNull().default(true),
  features: jsonb('features').notNull().default({}),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
