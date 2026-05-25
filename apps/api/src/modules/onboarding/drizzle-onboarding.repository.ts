import { eq, ilike } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { profiles } from '@/shared/db/schemas'
import type { PlayerOnboardingInput, PlayerProfile } from './onboarding.entity'
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

    // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
    // The schema allows null for username but we always insert with a non-null value
    return row! as PlayerProfile
  }
}
