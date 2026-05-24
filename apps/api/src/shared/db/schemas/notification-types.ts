import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const notificationTypes = pgTable('notification_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  type_key: text('type_key').notNull().unique(),
  label: text('label').notNull(),
  description: text('description'),
  is_mutable: boolean('is_mutable').notNull().default(true),
  default_enabled: boolean('default_enabled').notNull().default(true),
  available_channels: text('available_channels').array().default(['in_app', 'push']),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
