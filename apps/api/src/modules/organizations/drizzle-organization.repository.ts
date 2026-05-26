import { and, count, eq, isNull, or, sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { db } from '@/shared/db/client'
import {
  auditLogs,
  organizationMembers,
  organizations,
  organizerSubscriptions,
  subscriptionPlans,
} from '@/shared/db/schemas'
import type {
  AuditLogInput,
  CreateOrgInput,
  InviteMemberInput,
  ListMembersResult,
  OrgMember,
  OrgWithRole,
  UpdateRoleInput,
} from './organization.entity'
import type { IOrganizationRepository } from './organization.repository'

// Minimal read-only reference to BetterAuth's user table for join queries
const betterAuthUsers = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export class DrizzleOrganizationRepository implements IOrganizationRepository {
  async findById(orgId: string, requestingUserId: string): Promise<OrgWithRole | null> {
    const [row] = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        description: organizations.description,
        logo_url: organizations.logo_url,
        website_url: organizations.website_url,
        country_code: organizations.country_code,
        city: organizations.city,
        is_verified: organizations.is_verified,
        created_at: organizations.created_at,
        role: organizationMembers.role,
      })
      .from(organizations)
      .innerJoin(
        organizationMembers,
        and(
          eq(organizationMembers.organization_id, organizations.id),
          sql`${organizationMembers.user_id} = ${requestingUserId}`,
          eq(organizationMembers.status, 'active'),
        ),
      )
      .where(and(eq(organizations.id, orgId), isNull(organizations.deleted_at)))
      .limit(1)

    return row ?? null
  }

  async isSlugTaken(slug: string): Promise<boolean> {
    const [row] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1)

    return row !== undefined
  }

  async findPlanIdBySlug(plan: string): Promise<string | null> {
    const [row] = await db
      .select({ id: subscriptionPlans.id })
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.slug, plan))
      .limit(1)

    return row?.id ?? null
  }

  async createOrganization(
    userId: string,
    data: CreateOrgInput,
    planId: string,
  ): Promise<OrgWithRole> {
    return db.transaction(async (tx) => {
      // biome-ignore lint/style/noNonNullAssertion: slug is resolved before this call
      const resolvedSlug = data.slug!

      const [org] = await tx
        .insert(organizations)
        .values({
          name: data.name,
          slug: resolvedSlug,
          description: data.description ?? null,
          city: data.city ?? null,
          country_code: data.country_code ?? null,
          created_by: userId,
        })
        .returning({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          description: organizations.description,
          logo_url: organizations.logo_url,
          website_url: organizations.website_url,
          country_code: organizations.country_code,
          city: organizations.city,
          is_verified: organizations.is_verified,
          created_at: organizations.created_at,
        })

      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      const newOrgId = org!.id

      await tx.insert(organizationMembers).values({
        organization_id: newOrgId,
        user_id: userId,
        role: 'owner',
        status: 'active',
        joined_at: new Date(),
      })

      const farFuture = new Date()
      farFuture.setFullYear(farFuture.getFullYear() + 100)

      await tx.insert(organizerSubscriptions).values({
        organization_id: newOrgId,
        plan_id: planId,
        status: 'active',
        billing_cycle: 'monthly',
        current_period_end: farFuture,
      })

      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      return { ...org!, role: 'owner' }
    })
  }

  async listMembers(orgId: string, page: number, limit: number): Promise<ListMembersResult> {
    const offset = (page - 1) * limit

    const [members, [countRow]] = await Promise.all([
      db
        .select({
          id: organizationMembers.id,
          invited_email: organizationMembers.invited_email,
          role: organizationMembers.role,
          status: organizationMembers.status,
          tournament_ids: organizationMembers.tournament_ids,
          joined_at: organizationMembers.joined_at,
          user_name: betterAuthUsers.name,
          user_email: betterAuthUsers.email,
          user_image: betterAuthUsers.image,
        })
        .from(organizationMembers)
        .leftJoin(betterAuthUsers, sql`${betterAuthUsers.id} = ${organizationMembers.user_id}`)
        .where(eq(organizationMembers.organization_id, orgId))
        .limit(limit)
        .offset(offset),

      db
        .select({ count: count() })
        .from(organizationMembers)
        .where(eq(organizationMembers.organization_id, orgId)),
    ])

    const total = Number(countRow?.count ?? 0)
    const total_pages = Math.ceil(total / limit)

    return {
      members: members.map((m) => ({
        id: m.id,
        user: {
          name: m.user_name ?? null,
          email: m.user_email ?? m.invited_email ?? '',
          avatar_url: m.user_image ?? null,
        },
        role: m.role,
        status: m.status,
        tournament_ids: (m.tournament_ids ?? []) as string[],
        joined_at: m.joined_at,
      })),
      meta: {
        page,
        limit,
        total,
        total_pages,
        has_next: page < total_pages,
        has_prev: page > 1,
      },
    }
  }

  async findMemberById(orgId: string, memberId: string): Promise<OrgMember | null> {
    const [row] = await db
      .select({
        id: organizationMembers.id,
        invited_email: organizationMembers.invited_email,
        role: organizationMembers.role,
        status: organizationMembers.status,
        tournament_ids: organizationMembers.tournament_ids,
        joined_at: organizationMembers.joined_at,
        user_name: betterAuthUsers.name,
        user_email: betterAuthUsers.email,
        user_image: betterAuthUsers.image,
      })
      .from(organizationMembers)
      .leftJoin(betterAuthUsers, sql`${betterAuthUsers.id} = ${organizationMembers.user_id}`)
      .where(
        and(eq(organizationMembers.id, memberId), eq(organizationMembers.organization_id, orgId)),
      )
      .limit(1)

    if (!row) return null

    return {
      id: row.id,
      user: {
        name: row.user_name ?? null,
        email: row.user_email ?? row.invited_email ?? '',
        avatar_url: row.user_image ?? null,
      },
      role: row.role,
      status: row.status,
      tournament_ids: (row.tournament_ids ?? []) as string[],
      joined_at: row.joined_at,
    }
  }

  async findMemberByEmail(orgId: string, email: string): Promise<{ status: string } | null> {
    const [row] = await db
      .select({ status: organizationMembers.status })
      .from(organizationMembers)
      .leftJoin(betterAuthUsers, sql`${betterAuthUsers.id} = ${organizationMembers.user_id}`)
      .where(
        and(
          eq(organizationMembers.organization_id, orgId),
          or(eq(betterAuthUsers.email, email), eq(organizationMembers.invited_email, email)),
        ),
      )
      .limit(1)

    return row ?? null
  }

  async findUserByEmail(email: string): Promise<{ id: string } | null> {
    const [row] = await db
      .select({ id: betterAuthUsers.id })
      .from(betterAuthUsers)
      .where(eq(betterAuthUsers.email, email))
      .limit(1)

    return row ?? null
  }

  async countActiveOwners(orgId: string): Promise<number> {
    const [row] = await db
      .select({ count: count() })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, orgId),
          eq(organizationMembers.role, 'owner'),
          eq(organizationMembers.status, 'active'),
        ),
      )

    return Number(row?.count ?? 0)
  }

  async inviteMember(
    orgId: string,
    userId: string | null,
    data: InviteMemberInput,
  ): Promise<OrgMember> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const [member] = await db
      .insert(organizationMembers)
      .values({
        organization_id: orgId,
        user_id: userId,
        invited_email: userId === null ? (data.invited_email ?? null) : null,
        role: data.role as 'owner' | 'admin' | 'organizer' | 'coach' | 'viewer',
        tournament_ids: data.tournament_ids,
        invited_by: data.invitedBy,
        status: 'invited',
        invitation_expires_at: expiresAt,
      })
      .returning({
        id: organizationMembers.id,
        role: organizationMembers.role,
        status: organizationMembers.status,
        tournament_ids: organizationMembers.tournament_ids,
        joined_at: organizationMembers.joined_at,
      })

    let userRow: { name: string; email: string; image: string | null } | undefined

    if (userId !== null) {
      const [row] = await db
        .select({
          name: betterAuthUsers.name,
          email: betterAuthUsers.email,
          image: betterAuthUsers.image,
        })
        .from(betterAuthUsers)
        .where(eq(betterAuthUsers.id, userId))
        .limit(1)
      userRow = row
    }

    return {
      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      id: member!.id,
      user: {
        name: userRow?.name ?? null,
        email: userRow?.email ?? data.invited_email ?? '',
        avatar_url: userRow?.image ?? null,
      },
      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      role: member!.role,
      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      status: member!.status,
      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      tournament_ids: (member!.tournament_ids ?? []) as string[],
      joined_at: null,
    }
  }

  async updateMemberRole(memberId: string, data: UpdateRoleInput): Promise<OrgMember> {
    const [updated] = await db
      .update(organizationMembers)
      .set({
        role: data.role as 'owner' | 'admin' | 'organizer' | 'coach' | 'viewer',
        tournament_ids: data.tournament_ids,
        updated_at: new Date(),
      })
      .where(eq(organizationMembers.id, memberId))
      .returning({
        id: organizationMembers.id,
        user_id: organizationMembers.user_id,
        role: organizationMembers.role,
        status: organizationMembers.status,
        tournament_ids: organizationMembers.tournament_ids,
        joined_at: organizationMembers.joined_at,
      })

    const [userRow] = updated?.user_id
      ? await db
          .select({
            name: betterAuthUsers.name,
            email: betterAuthUsers.email,
            image: betterAuthUsers.image,
          })
          .from(betterAuthUsers)
          .where(sql`${betterAuthUsers.id} = ${updated.user_id}`)
          .limit(1)
      : []

    return {
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      id: updated!.id,
      user: {
        name: userRow?.name ?? null,
        email: userRow?.email ?? '',
        avatar_url: userRow?.image ?? null,
      },
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      role: updated!.role,
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      status: updated!.status,
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      tournament_ids: (updated!.tournament_ids ?? []) as string[],
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      joined_at: updated!.joined_at,
    }
  }

  async removeMember(memberId: string): Promise<void> {
    await db
      .update(organizationMembers)
      .set({ status: 'left', left_at: new Date(), updated_at: new Date() })
      .where(eq(organizationMembers.id, memberId))
  }

  async transferOwnership(
    _orgId: string,
    currentOwnerMemberId: string,
    newOwnerMemberId: string,
  ): Promise<void> {
    await db.transaction(async (tx) => {
      await tx
        .update(organizationMembers)
        .set({ role: 'admin', updated_at: new Date() })
        .where(eq(organizationMembers.id, currentOwnerMemberId))

      await tx
        .update(organizationMembers)
        .set({ role: 'owner', updated_at: new Date() })
        .where(eq(organizationMembers.id, newOwnerMemberId))
    })
  }

  async suspendMember(memberId: string): Promise<OrgMember> {
    const [updated] = await db
      .update(organizationMembers)
      .set({ status: 'suspended', updated_at: new Date() })
      .where(eq(organizationMembers.id, memberId))
      .returning({
        id: organizationMembers.id,
        user_id: organizationMembers.user_id,
        role: organizationMembers.role,
        status: organizationMembers.status,
        tournament_ids: organizationMembers.tournament_ids,
        joined_at: organizationMembers.joined_at,
      })

    let userRow: { name: string; email: string; image: string | null } | undefined
    if (updated?.user_id) {
      ;[userRow] = await db
        .select({
          name: betterAuthUsers.name,
          email: betterAuthUsers.email,
          image: betterAuthUsers.image,
        })
        .from(betterAuthUsers)
        .where(sql`${betterAuthUsers.id} = ${updated.user_id}`)
        .limit(1)
    }

    return {
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      id: updated!.id,
      user: {
        name: userRow?.name ?? null,
        email: userRow?.email ?? '',
        avatar_url: userRow?.image ?? null,
      },
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      role: updated!.role,
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      status: updated!.status,
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      tournament_ids: (updated!.tournament_ids ?? []) as string[],
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      joined_at: updated!.joined_at,
    }
  }

  async reactivateMember(memberId: string): Promise<OrgMember> {
    const [updated] = await db
      .update(organizationMembers)
      .set({ status: 'active', updated_at: new Date() })
      .where(eq(organizationMembers.id, memberId))
      .returning({
        id: organizationMembers.id,
        user_id: organizationMembers.user_id,
        role: organizationMembers.role,
        status: organizationMembers.status,
        tournament_ids: organizationMembers.tournament_ids,
        joined_at: organizationMembers.joined_at,
      })

    let userRow: { name: string; email: string; image: string | null } | undefined
    if (updated?.user_id) {
      ;[userRow] = await db
        .select({
          name: betterAuthUsers.name,
          email: betterAuthUsers.email,
          image: betterAuthUsers.image,
        })
        .from(betterAuthUsers)
        .where(sql`${betterAuthUsers.id} = ${updated.user_id}`)
        .limit(1)
    }

    return {
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      id: updated!.id,
      user: {
        name: userRow?.name ?? null,
        email: userRow?.email ?? '',
        avatar_url: userRow?.image ?? null,
      },
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      role: updated!.role,
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      status: updated!.status,
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      tournament_ids: (updated!.tournament_ids ?? []) as string[],
      // biome-ignore lint/style/noNonNullAssertion: update always returns a row
      joined_at: updated!.joined_at,
    }
  }

  async createAuditLog(data: AuditLogInput): Promise<void> {
    await db.insert(auditLogs).values({
      organization_id: data.organization_id,
      actor_user_id: data.actor_user_id,
      actor_role: data.actor_role,
      action: data.action,
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      before_data: data.before_data ?? null,
      after_data: data.after_data ?? null,
      diff:
        data.before_data && data.after_data
          ? { before: data.before_data, after: data.after_data }
          : null,
    })
  }
}
