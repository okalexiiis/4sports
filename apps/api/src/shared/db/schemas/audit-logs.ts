import { customType, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { auditActionEnum } from './enums'
import { organizations } from './organizations'

const inet = customType<{ data: string }>({
  dataType() {
    return 'inet'
  },
})

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organization_id: uuid('organization_id').references(() => organizations.id),
  actor_user_id: text('actor_user_id'),
  actor_role: text('actor_role'),
  action: auditActionEnum('action').notNull(),
  entity_type: text('entity_type').notNull(),
  entity_id: uuid('entity_id').notNull(),
  before_data: jsonb('before_data'),
  after_data: jsonb('after_data'),
  diff: jsonb('diff'),
  ip_address: inet('ip_address'),
  user_agent: text('user_agent'),
  request_id: text('request_id'),
  notes: text('notes'),
  // immutable — no updated_at
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
