import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { registrationStatusEnum } from './enums'
import { organizations } from './organizations'
import { subscriptionPlans } from './subscription-plans'
import { teams } from './teams'
import { tournaments } from './tournaments'

export const tournamentRegistrations = pgTable(
  'tournament_registrations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tournament_id: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    status: registrationStatusEnum('status').notNull().default('pending'),
    // true = team came from outside the org; false = organizer created team internally
    is_external: boolean('is_external').notNull().default(true),
    // Seed position used for group distribution in world_cup format
    seed: integer('seed'),
    rejection_reason: text('rejection_reason'),
    // Eligibility alerts captured at inscription time from the eligibility engine
    eligibility_alerts: jsonb('eligibility_alerts').notNull().default([]),
    registered_by: text('registered_by').notNull(),
    reviewed_by: text('reviewed_by'),
    reviewed_at: timestamp('reviewed_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('uq_tournament_team').on(t.tournament_id, t.team_id),
    index('idx_registrations_tournament_status').on(t.tournament_id, t.status),
  ],
)

// Fee items defined by the organizer for a tournament (e.g. inscription fee, monthly fee).
export const tournamentFeeItems = pgTable('tournament_fee_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tournament_id: uuid('tournament_id')
    .notNull()
    .references(() => tournaments.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  // 'per_team' | 'per_player' | 'monthly'
  type: text('type').notNull().default('per_team'),
  // Amount in cents (MXN)
  amount: integer('amount').notNull().default(0),
  currency: text('currency').notNull().default('MXN'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Invoice generated per fee item when a team registration is approved.
export const feeInvoices = pgTable(
  'fee_invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    registration_id: uuid('registration_id')
      .notNull()
      .references(() => tournamentRegistrations.id, { onDelete: 'cascade' }),
    fee_item_id: uuid('fee_item_id')
      .notNull()
      .references(() => tournamentFeeItems.id, { onDelete: 'restrict' }),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull().default('MXN'),
    // 'pending' | 'paid' | 'cancelled' | 'refunded'
    status: text('status').notNull().default('pending'),
    due_at: timestamp('due_at', { withTimezone: true }),
    paid_at: timestamp('paid_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_fee_invoices_registration').on(t.registration_id)],
)

// Payment records linked to an invoice. A single invoice may have multiple
// partial payments (e.g. installments). Full payment processing is Hito 5.
export const paymentRecords = pgTable('payment_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoice_id: uuid('invoice_id')
    .notNull()
    .references(() => feeInvoices.id, { onDelete: 'restrict' }),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default('MXN'),
  // 'pending' | 'completed' | 'failed' | 'refunded'
  status: text('status').notNull().default('pending'),
  provider: text('provider'),
  provider_transaction_id: text('provider_transaction_id'),
  paid_at: timestamp('paid_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Audit log for all inbound payment provider webhooks.
export const paymentWebhooks = pgTable('payment_webhooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider: text('provider').notNull(),
  event_type: text('event_type').notNull(),
  payload: jsonb('payload').notNull().default({}),
  // 'received' | 'processed' | 'ignored' | 'failed'
  status: text('status').notNull().default('received'),
  processed_at: timestamp('processed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Immutable history of subscription plan changes per organization.
export const subscriptionPlanHistory = pgTable(
  'subscription_plan_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organization_id: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    from_plan_id: uuid('from_plan_id').references(() => subscriptionPlans.id, {
      onDelete: 'set null',
    }),
    to_plan_id: uuid('to_plan_id')
      .notNull()
      .references(() => subscriptionPlans.id, { onDelete: 'restrict' }),
    changed_by: text('changed_by').notNull(),
    reason: text('reason'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_plan_history_org').on(t.organization_id)],
)
