import { boolean, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { notificationChannelEnum, notificationStatusEnum } from './enums'
import { organizations } from './organizations'

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  organization_id: uuid('organization_id').references(() => organizations.id),
  user_id: text('user_id').notNull(),
  title: text('title').notNull(),
  body: text('body'),
  type: text('type').notNull(),
  channel: notificationChannelEnum('channel').notNull().default('in_app'),
  status: notificationStatusEnum('status').notNull().default('pending'),
  entity_type: text('entity_type'),
  entity_id: uuid('entity_id'),
  action_url: text('action_url'),
  read_at: timestamp('read_at', { withTimezone: true }),
  sent_at: timestamp('sent_at', { withTimezone: true }),
  is_public: boolean('is_public').notNull().default(false),
  announcement_type: text('announcement_type'),
  audience_segment: text('audience_segment'),
  audience_filter: jsonb('audience_filter').default({}),
  metadata: jsonb('metadata').default({}),
  // append-only — no updated_at
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
