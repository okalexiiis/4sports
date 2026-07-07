import { db } from '@/shared/db/client'
import { venues } from '@/shared/db/schemas'
import { ORG_IDS, VENUE_IDS } from './ids'
import { type UserIds, userId } from './users'

// Two venues for the org. Idempotent via fixed PK.
export async function seedDummyVenues(userIds: UserIds) {
  await db
    .insert(venues)
    .values([
      {
        id: VENUE_IDS.estadioNorte,
        organization_id: ORG_IDS.ligaMonterrey,
        name: 'Estadio Norte',
        address: 'Av. Universidad 100',
        city: 'Monterrey',
        country_code: 'MX',
        capacity: 5000,
        created_by: userId(userIds, 'organizer'),
      },
      {
        id: VENUE_IDS.canchaSur,
        organization_id: ORG_IDS.ligaMonterrey,
        name: 'Cancha Sur',
        address: 'Calle Sur 250',
        city: 'Monterrey',
        country_code: 'MX',
        capacity: 1200,
        created_by: userId(userIds, 'organizer'),
      },
    ])
    .onConflictDoNothing()
}
