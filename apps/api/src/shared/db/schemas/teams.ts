import { sql } from 'drizzle-orm'
import {
  boolean,
  char,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { membershipStatusEnum, teamMemberRoleEnum, teamScopeEnum } from './enums'
import { organizations } from './organizations'
import { tournaments } from './tournaments'

export const teams = pgTable(
  'teams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organization_id: uuid('organization_id').references(() => organizations.id, {
      onDelete: 'set null',
    }),
    name: text('name').notNull(),
    short_name: text('short_name'),
    logo_url: text('logo_url'),
    primary_color: text('primary_color'),
    secondary_color: text('secondary_color'),
    city: text('city'),
    country_code: char('country_code', { length: 2 }),
    // 'male' | 'female' | 'mixed' — stored as text to avoid adding gender_restriction dep here
    gender_type: text('gender_type').notNull().default('mixed'),
    join_policy: text('join_policy').notNull().default('request'),
    scope: teamScopeEnum('scope').notNull().default('tournament_scoped'),
    owned_by_user_id: text('owned_by_user_id').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deleted_at: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [index('idx_teams_owner').on(t.owned_by_user_id)],
)

// Represents a person on a team roster. Can be a real platform user (user_id set)
// or a guest profile created by the captain (is_guest = true, user_id = null).
export const players = pgTable(
  'players',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Null until a guest profile is claimed and approved by the captain/coach.
    user_id: text('user_id'),
    display_name: text('display_name').notNull(),
    avatar_url: text('avatar_url'),
    jersey_number: integer('jersey_number'),
    position: text('position'),
    sex: text('sex'),
    date_of_birth: timestamp('date_of_birth', { withTimezone: false }),
    email: text('email'),
    phone: text('phone'),
    is_guest: boolean('is_guest').notNull().default(false),
    // Tracks who created this guest profile so they can be notified on claim.
    guest_created_by: text('guest_created_by'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_players_user_id').on(t.user_id).where(sql`${t.user_id} IS NOT NULL`)],
)

export const teamMembers = pgTable(
  'team_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    player_id: uuid('player_id')
      .notNull()
      .references(() => players.id, { onDelete: 'cascade' }),
    role: teamMemberRoleEnum('role').notNull().default('player'),
    status: membershipStatusEnum('status').notNull().default('active'),
    joined_at: timestamp('joined_at', { withTimezone: true }),
    left_at: timestamp('left_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_team_member').on(t.team_id, t.player_id)],
)

// Secondary positions a player holds within a team (beyond the primary on players.position).
export const teamMemberPositions = pgTable('team_member_positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  team_member_id: uuid('team_member_id')
    .notNull()
    .references(() => teamMembers.id, { onDelete: 'cascade' }),
  position: text('position').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Invitations sent to existing platform users to join a team.
// The user must accept before appearing as an active team member.
export const teamInvitations = pgTable(
  'team_invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    team_id: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    invited_user_id: text('invited_user_id').notNull(),
    invited_by: text('invited_by').notNull(),
    role: teamMemberRoleEnum('role').notNull().default('player'),
    jersey_number: integer('jersey_number'),
    status: text('status').notNull().default('pending'),
    expires_at: timestamp('expires_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_team_invitation').on(t.team_id, t.invited_user_id)],
)

// Requests submitted by players who want to join a team with join_policy = 'request'.
export const teamJoinRequests = pgTable('team_join_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  team_id: uuid('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  requester_user_id: text('requester_user_id').notNull(),
  message: text('message'),
  status: text('status').notNull().default('pending'),
  reviewed_by: text('reviewed_by'),
  reviewed_at: timestamp('reviewed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Short-lived tokens that let a captain manage their team without a full account.
// Used when the organizer creates an internal team and shares a link with the captain.
export const captainInviteTokens = pgTable('captain_invite_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  team_id: uuid('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  tournament_id: uuid('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  created_by: text('created_by').notNull(),
  claimed_by: text('claimed_by'),
  claimed_at: timestamp('claimed_at', { withTimezone: true }),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
