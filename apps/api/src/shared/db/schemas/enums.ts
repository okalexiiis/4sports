import { pgEnum } from 'drizzle-orm/pg-core'

export const orgRoleEnum = pgEnum('org_role', ['owner', 'admin', 'organizer', 'coach', 'viewer'])

export const membershipStatusEnum = pgEnum('membership_status', [
  'invited',
  'pending',
  'active',
  'suspended',
  'left',
])

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing',
  'active',
  'past_due',
  'cancelled',
  'expired',
])

export const auditActionEnum = pgEnum('audit_action', [
  'create',
  'update',
  'delete',
  'restore',
  'approve',
  'reject',
  'archive',
  'lock',
])

export const notificationChannelEnum = pgEnum('notification_channel', [
  'in_app',
  'email',
  'push',
  'sms',
])

export const notificationStatusEnum = pgEnum('notification_status', [
  'pending',
  'sent',
  'failed',
  'read',
])
