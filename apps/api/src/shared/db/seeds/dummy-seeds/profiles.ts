import { db } from '@/shared/db/client'
import { profiles } from '@/shared/db/schemas'
import { ACCOUNTS, type UserIds, userId } from './users'

// One profile per dummy user. Free-agent players (player1..6) are flagged
// is_looking_for_team so they show up in the player-finding-team UX.
// Idempotent via the user_id unique constraint (onConflictDoNothing).
export async function seedDummyProfiles(userIds: UserIds) {
  const rows = ACCOUNTS.map((account) => ({
    user_id: userId(userIds, account.key),
    username: account.key,
    city: 'Monterrey',
    country_code: 'MX',
    initial_intent: account.intent,
    is_looking_for_team: account.key.startsWith('player'),
    onboarding_completed_at: new Date(),
  }))

  await db.insert(profiles).values(rows).onConflictDoNothing()
}
