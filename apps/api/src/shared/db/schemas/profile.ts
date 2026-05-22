// apps/api/src/shared/db/schema/profiles.ts
import { boolean, char, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: text('user_id').notNull().unique(), // → user.id de BetterAuth
  username: varchar('username', { length: 40 }).unique(),
  avatar_url: text('avatar_url'),
  phone: varchar('phone', { length: 20 }),
  city: varchar('city', { length: 80 }),
  country_code: char('country_code', { length: 2 }),
  is_looking_for_team: boolean('is_looking_for_team').default(false),
  initial_intent: text('initial_intent'), // 'player' | 'organizer'
  onboarding_completed_at: timestamp('onboarding_completed_at', { withTimezone: true }),
  metadata: jsonb('metadata').default({}),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
