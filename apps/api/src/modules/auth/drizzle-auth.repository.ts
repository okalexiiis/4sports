import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { organizationMembers, organizations, profiles } from '@/shared/db/schemas'
import type { OrgMembership, ProfileData } from './auth.entity'
import type { IAuthRepository } from './auth.repository'

export class DrizzleAuthRepository implements IAuthRepository {
  async findProfile(userId: string): Promise<ProfileData | null> {
    const [row] = await db
      .select({
        username: profiles.username,
        avatar_url: profiles.avatar_url,
        city: profiles.city,
        initial_intent: profiles.initial_intent,
        onboarding_completed_at: profiles.onboarding_completed_at,
      })
      .from(profiles)
      .where(eq(profiles.user_id, userId))
      .limit(1)

    return row ?? null
  }

  async findMemberships(userId: string): Promise<OrgMembership[]> {
    const rows = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizationMembers.organization_id, organizations.id))
      .where(
        and(
          eq(organizationMembers.user_id, userId),
          eq(organizationMembers.status, 'active'),
          isNull(organizations.deleted_at),
        ),
      )

    return rows
  }
}
