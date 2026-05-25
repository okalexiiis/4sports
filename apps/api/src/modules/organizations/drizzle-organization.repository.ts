import { and, count, eq, isNull } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { db } from '@/shared/db/client'
import { organizationMembers, organizations } from '@/shared/db/schemas'
import type { ListMembersResult, OrgWithRole } from './organization.entity'
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
          eq(organizationMembers.user_id, requestingUserId),
          eq(organizationMembers.status, 'active'),
        ),
      )
      .where(and(eq(organizations.id, orgId), isNull(organizations.deleted_at)))
      .limit(1)

    return row ?? null
  }

  async listMembers(orgId: string, page: number, limit: number): Promise<ListMembersResult> {
    const offset = (page - 1) * limit

    const [members, [countRow]] = await Promise.all([
      db
        .select({
          id: organizationMembers.id,
          role: organizationMembers.role,
          status: organizationMembers.status,
          tournament_ids: organizationMembers.tournament_ids,
          joined_at: organizationMembers.joined_at,
          user_name: betterAuthUsers.name,
          user_email: betterAuthUsers.email,
          user_image: betterAuthUsers.image,
        })
        .from(organizationMembers)
        .innerJoin(betterAuthUsers, eq(betterAuthUsers.id, organizationMembers.user_id))
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
          name: m.user_name,
          email: m.user_email,
          avatar_url: m.user_image,
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
}
