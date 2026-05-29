import { db } from '@/shared/db/client'
import { organizationMembers, organizations } from '@/shared/db/schemas'
import { ORG_IDS } from './ids'
import { type UserIds, userId } from './users'

// One verified organization owned by the organizer, with the four captains
// added as `coach` members. Idempotent via fixed PK / unique(org,user).
export async function seedDummyOrganizations(userIds: UserIds) {
  await db
    .insert(organizations)
    .values({
      id: ORG_IDS.ligaMonterrey,
      name: 'Liga Deportiva Monterrey',
      slug: 'liga-monterrey',
      description: 'Liga amateur multideporte en Monterrey — datos de prueba.',
      country_code: 'MX',
      city: 'Monterrey',
      is_verified: true,
      onboarding_step: 1,
      created_by: userId(userIds, 'organizer'),
    })
    .onConflictDoNothing()

  const members = [
    { user_id: userId(userIds, 'organizer'), role: 'owner' as const },
    { user_id: userId(userIds, 'captain1'), role: 'coach' as const },
    { user_id: userId(userIds, 'captain2'), role: 'coach' as const },
    { user_id: userId(userIds, 'captain3'), role: 'coach' as const },
    { user_id: userId(userIds, 'captain4'), role: 'coach' as const },
  ]

  await db
    .insert(organizationMembers)
    .values(
      members.map((m) => ({
        organization_id: ORG_IDS.ligaMonterrey,
        user_id: m.user_id,
        role: m.role,
        status: 'active' as const,
        joined_at: new Date(),
      })),
    )
    .onConflictDoNothing()
}
