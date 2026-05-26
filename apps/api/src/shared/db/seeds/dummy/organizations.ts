import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import {
  organizationMembers,
  organizations,
  organizerSubscriptions,
  subscriptionPlans,
} from '@/shared/db/schemas'
import { USER_IDS } from './users'

export const ORG_IDS = {
  ligaHermosillo: '00000010-0000-0000-0000-000000000001',
  clubSonora: '00000010-0000-0000-0000-000000000002',
} as const

export async function seedDummyOrganizations() {
  const plans = await db
    .select({ id: subscriptionPlans.id, slug: subscriptionPlans.slug })
    .from(subscriptionPlans)

  const planId = (slug: string) => {
    const plan = plans.find((p) => p.slug === slug)
    if (!plan) throw new Error(`Plan '${slug}' not found — run db:seed first`)
    return plan.id
  }

  const now = new Date()
  const periodEnd = new Date('2099-12-31T00:00:00Z')

  await db
    .insert(organizations)
    .values([
      {
        id: ORG_IDS.ligaHermosillo,
        name: 'Liga Hermosillo',
        slug: 'liga-hermosillo',
        description: 'Liga de fútbol varonil de Hermosillo, Sonora.',
        city: 'Hermosillo',
        country_code: 'MX',
        is_verified: true,
        onboarding_step: 3,
        created_by: USER_IDS.alexis,
      },
      {
        id: ORG_IDS.clubSonora,
        name: 'Club Sonora',
        slug: 'club-sonora',
        description: 'Club deportivo multidisciplinario.',
        city: 'Hermosillo',
        country_code: 'MX',
        is_verified: false,
        onboarding_step: 3,
        created_by: USER_IDS.ivan,
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(organizerSubscriptions)
    .values([
      {
        organization_id: ORG_IDS.ligaHermosillo,
        plan_id: planId('pro'),
        status: 'active',
        billing_cycle: 'monthly',
        current_period_end: periodEnd,
      },
      {
        organization_id: ORG_IDS.clubSonora,
        plan_id: planId('free'),
        status: 'active',
        billing_cycle: 'monthly',
        current_period_end: periodEnd,
      },
    ])
    .onConflictDoNothing()

  // Members of Liga Hermosillo — garib's tournament_ids are set after tournaments exist,
  // so we import TOURNAMENT_IDS here lazily to avoid circular deps.
  const { TOURNAMENT_IDS } = await import('./tournaments')

  await db
    .insert(organizationMembers)
    .values([
      {
        organization_id: ORG_IDS.ligaHermosillo,
        user_id: USER_IDS.alexis,
        role: 'owner',
        status: 'active',
        joined_at: now,
      },
      {
        organization_id: ORG_IDS.ligaHermosillo,
        user_id: USER_IDS.josue,
        role: 'admin',
        status: 'active',
        joined_at: now,
      },
      {
        organization_id: ORG_IDS.ligaHermosillo,
        user_id: USER_IDS.garib,
        role: 'organizer',
        status: 'active',
        joined_at: now,
        tournament_ids: [TOURNAMENT_IDS.ligaVerano],
      },
      {
        organization_id: ORG_IDS.clubSonora,
        user_id: USER_IDS.ivan,
        role: 'owner',
        status: 'active',
        joined_at: now,
      },
    ])
    .onConflictDoNothing()
}
