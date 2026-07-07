import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { user } from '@/shared/db/schemas'
import { auth } from '@/shared/lib/auth'

// All dummy accounts share this password so you can log in during testing.
//   email: see ACCOUNTS below   password: Password123!
//
// Examples:
//   organizer@test.com  → owns the org, creates tournaments
//   captain1@test.com   → captain of Tigres
//   player1@test.com    → free agent (looking for team)
//   referee@test.com    → match referee
export const DUMMY_PASSWORD = 'Password123!'

export interface DummyAccount {
  key: string
  name: string
  email: string
  intent: 'organizer' | 'player'
}

export const ACCOUNTS: DummyAccount[] = [
  {
    key: 'organizer',
    name: 'Olivia Organizadora',
    email: 'organizer@test.com',
    intent: 'organizer',
  },
  { key: 'captain1', name: 'Carlos Capitán', email: 'captain1@test.com', intent: 'player' },
  { key: 'captain2', name: 'Camila Capitana', email: 'captain2@test.com', intent: 'player' },
  { key: 'captain3', name: 'César Capitán', email: 'captain3@test.com', intent: 'player' },
  { key: 'captain4', name: 'Carmen Capitana', email: 'captain4@test.com', intent: 'player' },
  { key: 'player1', name: 'Pablo Jugador', email: 'player1@test.com', intent: 'player' },
  { key: 'player2', name: 'Paula Jugadora', email: 'player2@test.com', intent: 'player' },
  { key: 'player3', name: 'Pedro Jugador', email: 'player3@test.com', intent: 'player' },
  { key: 'player4', name: 'Patricia Jugadora', email: 'player4@test.com', intent: 'player' },
  { key: 'player5', name: 'Pacho Jugador', email: 'player5@test.com', intent: 'player' },
  { key: 'player6', name: 'Penélope Jugadora', email: 'player6@test.com', intent: 'player' },
  { key: 'referee', name: 'Rafael Árbitro', email: 'referee@test.com', intent: 'player' },
]

export type UserIds = Record<string, string>

// Resolves a seeded user id, throwing a clear error if the key is missing.
export function userId(ids: UserIds, key: string): string {
  const id = ids[key]
  if (!id) throw new Error(`Dummy seed: unknown user key "${key}"`)
  return id
}

// Creates loginable BetterAuth accounts (hashed password + account row).
// Idempotent: looks up by email and only signs up missing accounts.
export async function seedDummyUsers(): Promise<UserIds> {
  const ids: UserIds = {}

  for (const account of ACCOUNTS) {
    const existing = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, account.email))
      .limit(1)

    if (existing[0]) {
      ids[account.key] = existing[0].id
      continue
    }

    const result = await auth.api.signUpEmail({
      body: {
        name: account.name,
        email: account.email,
        password: DUMMY_PASSWORD,
      },
    })

    ids[account.key] = result.user.id
  }

  return ids
}
