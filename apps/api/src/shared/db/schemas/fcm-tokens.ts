import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const fcmTokens = pgTable('fcm_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: text('user_id').notNull(),
  token: text('token').notNull().unique(),
  device_name: varchar('device_name', { length: 80 }),
  platform: text('platform'),
  app_version: text('app_version'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  last_used_at: timestamp('last_used_at', { withTimezone: true }).notNull().defaultNow(),
})
