import { db } from '@/shared/db/client'
import { profiles } from '@/shared/db/schemas'
import { account, user } from '@/shared/db/schemas/auth.schema'

export const USER_IDS = {
  alexis: 'dummy_user_alexis',
  josue: 'dummy_user_josue',
  garib: 'dummy_user_garib',
  carlos: 'dummy_user_carlos',
  ivan: 'dummy_user_ivan',
} as const

const USERS = [
  {
    id: USER_IDS.alexis,
    name: 'Alexis Organizer',
    email: 'alexis@4sports.dev',
    username: 'alexis_org',
  },
  { id: USER_IDS.josue, name: 'Josue Admin', email: 'josue@4sports.dev', username: 'josue_admin' },
  {
    id: USER_IDS.garib,
    name: 'Garib Organizer',
    email: 'garib@4sports.dev',
    username: 'garib_org',
  },
  {
    id: USER_IDS.carlos,
    name: 'Carlos Capitan',
    email: 'carlos@4sports.dev',
    username: 'carlos_cap',
  },
  { id: USER_IDS.ivan, name: 'Ivan Player', email: 'ivan@4sports.dev', username: 'ivan_player' },
]

export async function seedDummyUsers() {
  const now = new Date()
  const passwordHash = await Bun.password.hash('Test1234!', { algorithm: 'bcrypt', cost: 10 })

  await db
    .insert(user)
    .values(
      USERS.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing()

  await db
    .insert(account)
    .values(
      USERS.map((u) => ({
        id: `dummy_account_${u.id}`,
        accountId: u.id,
        providerId: 'credential',
        userId: u.id,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing()

  const onboardedAt = new Date('2025-06-01T10:00:00Z')

  await db
    .insert(profiles)
    .values(
      USERS.map((u) => ({
        user_id: u.id,
        username: u.username,
        city: 'Hermosillo',
        country_code: 'MX',
        initial_intent: u.id === USER_IDS.carlos || u.id === USER_IDS.ivan ? 'player' : 'organizer',
        onboarding_completed_at: onboardedAt,
      })),
    )
    .onConflictDoNothing()
}
