import { sql } from 'drizzle-orm'
import { boolean, check, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { subscriptionStatusEnum } from './enums'
import { organizations } from './organizations'
import { subscriptionPlans } from './subscription-plans'

export const organizerSubscriptions = pgTable(
  'organizer_subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organization_id: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    plan_id: uuid('plan_id')
      .notNull()
      .references(() => subscriptionPlans.id),
    status: subscriptionStatusEnum('status').notNull().default('trialing'),
    billing_cycle: text('billing_cycle').notNull().default('monthly'),
    current_period_start: timestamp('current_period_start', { withTimezone: true })
      .notNull()
      .defaultNow(),
    // no default — must be set explicitly by caller (free plan: far-future date)
    current_period_end: timestamp('current_period_end', { withTimezone: true }).notNull(),
    trial_ends_at: timestamp('trial_ends_at', { withTimezone: true }),
    cancelled_at: timestamp('cancelled_at', { withTimezone: true }),
    cancel_at_period_end: boolean('cancel_at_period_end').notNull().default(false),
    pending_plan_id: uuid('pending_plan_id').references(() => subscriptionPlans.id),
    pending_change_at: timestamp('pending_change_at', { withTimezone: true }),
    pending_change_type: text('pending_change_type'),
    last_downgrade_abort_at: timestamp('last_downgrade_abort_at', { withTimezone: true }),
    last_downgrade_abort_reason: jsonb('last_downgrade_abort_reason'),
    external_id: text('external_id'),
    metadata: jsonb('metadata').default({}),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('chk_subscription_period', sql`${t.current_period_end} > ${t.current_period_start}`),
  ],
)
