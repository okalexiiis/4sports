import { boolean, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { notificationChannelEnum } from './enums'

export const notificationPreferences = pgTable(
  'notification_preferences',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    notification_type: text('notification_type').notNull(),
    channel: notificationChannelEnum('channel').notNull(),
    is_enabled: boolean('is_enabled').notNull().default(true),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.user_id, t.notification_type, t.channel)],
)
