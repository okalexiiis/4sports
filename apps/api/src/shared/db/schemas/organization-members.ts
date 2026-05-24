import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { membershipStatusEnum, orgRoleEnum } from './enums'
import { organizations } from './organizations'

export const organizationMembers = pgTable(
  'organization_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organization_id: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    user_id: text('user_id').notNull(),
    role: orgRoleEnum('role').notNull().default('viewer'),
    tournament_ids: uuid('tournament_ids').array().default([]),
    invited_by: text('invited_by'),
    // GAP-002: invitations had no expiry — now enforced at 7 days
    invitation_expires_at: timestamp('invitation_expires_at', { withTimezone: true }),
    joined_at: timestamp('joined_at', { withTimezone: true }),
    // gap fix: use cases reference left_at = NOW() on removal
    left_at: timestamp('left_at', { withTimezone: true }),
    status: membershipStatusEnum('status').notNull().default('invited'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.organization_id, t.user_id)],
)
