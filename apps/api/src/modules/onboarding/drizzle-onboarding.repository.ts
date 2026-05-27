import { eq, ilike } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import {
  organizationMembers,
  organizations,
  organizerSubscriptions,
  profiles,
  subscriptionPlans,
} from '@/shared/db/schemas'
import type {
  OrgCreated,
  OrgOnboardingInput,
  PlayerOnboardingInput,
  PlayerProfile,
} from './onboarding.entity'
import type { IOnboardingRepository } from './onboarding.repository'

export class DrizzleOnboardingRepository implements IOnboardingRepository {
  async existsProfile(userId: string): Promise<boolean> {
    const [row] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.user_id, userId))
      .limit(1)

    return row !== undefined
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const [row] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(ilike(profiles.username, username))
      .limit(1)

    return row !== undefined
  }

  async createPlayerProfile(userId: string, data: PlayerOnboardingInput): Promise<PlayerProfile> {
    const [row] = await db
      .insert(profiles)
      .values({
        user_id: userId,
        username: data.username,
        city: data.city ?? null,
        country_code: data.country_code ?? null,
        phone: data.phone ?? null,
        is_looking_for_team: data.is_looking_for_team ?? false,
        initial_intent: 'player',
        onboarding_completed_at: new Date(),
      })
      .returning({
        id: profiles.id,
        username: profiles.username,
        city: profiles.city,
        country_code: profiles.country_code,
        initial_intent: profiles.initial_intent,
        onboarding_completed_at: profiles.onboarding_completed_at,
      })

    // The schema allows null for username but we always insert with a non-null value
    // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
    return row! as PlayerProfile
  }

  async isSlugTaken(slug: string): Promise<boolean> {
    const [row] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1)

    return row !== undefined
  }

  async findPlanIdBySlug(planSlug: string): Promise<string | null> {
    const [row] = await db
      .select({ id: subscriptionPlans.id })
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.slug, planSlug))
      .limit(1)

    return row?.id ?? null
  }

  async createOrgWithOwner(
    userId: string,
    data: OrgOnboardingInput,
    planId: string,
  ): Promise<OrgCreated> {
    return db.transaction(async (tx) => {
      const [profile] = await tx
        .insert(profiles)
        .values({
          user_id: userId,
          username: data.profile.username,
          city: data.profile.city ?? null,
          country_code: data.profile.country_code ?? null,
          initial_intent: 'organizer',
          onboarding_completed_at: new Date(),
        })
        .returning({
          id: profiles.id,
          username: profiles.username,
          city: profiles.city,
          country_code: profiles.country_code,
          initial_intent: profiles.initial_intent,
          onboarding_completed_at: profiles.onboarding_completed_at,
        })

      // slug is always resolved before calling this method
      // biome-ignore lint/style/noNonNullAssertion: slug is resolved in the use-case before this call
      const resolvedSlug = data.organization.slug!

      const [org] = await tx
        .insert(organizations)
        .values({
          name: data.organization.name,
          slug: resolvedSlug,
          description: data.organization.description ?? null,
          city: data.organization.city ?? null,
          country_code: data.organization.country_code ?? null,
          created_by: userId,
        })
        .returning({ id: organizations.id, name: organizations.name, slug: organizations.slug })

      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      const newOrgId = org!.id
      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      const newProfile = profile! as PlayerProfile
      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      const newOrg = org!

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

      return { profile: newProfile, organization: newOrg }
    })
  }
}
