import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { organizationMembers, organizations, profiles } from '@/shared/db/schemas'
import type { OrgMembership, ProfileData } from './auth.entity'
import type { IAuthRepository } from './auth.repository'
import type { UpdateProfileData } from './use-cases/update-profile.use-case'

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

  async updateProfile(userId: string, data: UpdateProfileData): Promise<ProfileData | null> {
    const updateValues: Record<string, unknown> = { updated_at: new Date() }
    if (data.avatar_url !== undefined) updateValues.avatar_url = data.avatar_url
    if (data.city !== undefined) updateValues.city = data.city
    if (data.country_code !== undefined) updateValues.country_code = data.country_code
    if (data.phone !== undefined) updateValues.phone = data.phone

    const [row] = await db
      .update(profiles)
      .set(updateValues)
      .where(eq(profiles.user_id, userId))
      .returning({
        username: profiles.username,
        avatar_url: profiles.avatar_url,
        city: profiles.city,
        initial_intent: profiles.initial_intent,
        onboarding_completed_at: profiles.onboarding_completed_at,
      })

    return row ?? null
  }

  async findMembership(userId: string, orgId: string): Promise<{ role: string } | null> {
    const [row] = await db
      .select({ role: organizationMembers.role })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizationMembers.organization_id, organizations.id))
      .where(
        and(
          eq(organizationMembers.user_id, userId),
          eq(organizationMembers.organization_id, orgId),
          eq(organizationMembers.status, 'active'),
          isNull(organizations.deleted_at),
        ),
      )
      .limit(1)

    return row ?? null
  }
}
