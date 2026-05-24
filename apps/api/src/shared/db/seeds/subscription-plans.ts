import { db } from '@/shared/db/client'
import { subscriptionPlans } from '@/shared/db/schemas'

export async function seedSubscriptionPlans() {
  await db
    .insert(subscriptionPlans)
    .values([
      {
        name: 'Free',
        slug: 'free',
        price_monthly: 0,
        price_yearly: 0,
        currency: 'MXN',
        is_active: true,
        features: {
          max_active_tournaments: 2,
          can_use_world_cup_format: false,
          can_accept_online_payments: false,
          can_use_sub_admins: false,
        },
      },
      {
        name: 'Starter',
        slug: 'starter',
        price_monthly: 29900,
        price_yearly: 288000,
        currency: 'MXN',
        is_active: true,
        features: {
          max_active_tournaments: 3,
          can_use_world_cup_format: false,
          can_accept_online_payments: false,
          can_use_sub_admins: false,
        },
      },
      {
        name: 'Pro',
        slug: 'pro',
        price_monthly: 79900,
        price_yearly: 768000,
        currency: 'MXN',
        is_active: true,
        features: {
          max_active_tournaments: null,
          can_use_world_cup_format: true,
          can_accept_online_payments: true,
          can_use_sub_admins: false,
        },
      },
      {
        name: 'Elite',
        slug: 'elite',
        price_monthly: 149900,
        price_yearly: 1440000,
        currency: 'MXN',
        is_active: true,
        features: {
          max_active_tournaments: null,
          can_use_world_cup_format: true,
          can_accept_online_payments: true,
          can_use_sub_admins: true,
        },
      },
    ])
    .onConflictDoNothing()
}
