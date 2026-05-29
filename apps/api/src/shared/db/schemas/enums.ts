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

// Hito 2 — Torneos y Equipos

export const tournamentStatusEnum = pgEnum('tournament_status', [
  'draft',
  'private',
  'open_registration',
  'active',
  'completed',
  'archived',
])

export const genderRestrictionEnum = pgEnum('gender_restriction', [
  'none',
  'male',
  'female',
  'mixed',
])

export const validationModeEnum = pgEnum('validation_mode', ['strict', 'flexible', 'hybrid'])

export const eligibilityModeEnum = pgEnum('eligibility_mode', ['strict', 'flexible'])

export const registrationStatusEnum = pgEnum('registration_status', [
  'pending',
  'approved',
  'rejected',
  'waitlisted',
  'withdrawn',
])

export const teamScopeEnum = pgEnum('team_scope', ['tournament_scoped', 'permanent'])

export const teamMemberRoleEnum = pgEnum('team_member_role', ['captain', 'coach', 'player'])

// Hito 3 — Partidos y Resultados

export const matchStatusEnum = pgEnum('match_status', [
  'scheduled',
  'postponed',
  'live',
  'suspended',
  'finished',
  'disputed',
  'walkover',
  'cancelled',
])

export const assignmentRoleEnum = pgEnum('assignment_role', [
  'referee',
  'assistant_referee',
  'scorekeeper',
])

export const convocatoriaResponseEnum = pgEnum('convocatoria_response', [
  'pending',
  'va',
  'no_va',
  'duda',
])

export const lineupRoleEnum = pgEnum('lineup_role', ['starter', 'substitute', 'did_not_play'])

export const disputeStatusEnum = pgEnum('dispute_status', ['open', 'resolved'])

export const bracketTypeEnum = pgEnum('bracket_type', ['winners', 'losers', 'grand_final'])
