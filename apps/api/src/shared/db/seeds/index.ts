import { seedNotificationTypes } from './notification-types'
import { seedPermissions } from './permissions'
import { seedRolePermissions } from './role-permissions'
import { seedSportPositions } from './sport-positions'
import { seedSports } from './sports'
import { seedSubscriptionPlans } from './subscription-plans'
import { seedTournamentFormats } from './tournament-formats'

async function seed() {
  console.log('seeding subscription plans...')
  await seedSubscriptionPlans()

  console.log('seeding permissions...')
  await seedPermissions()

  console.log('seeding role permissions...')
  await seedRolePermissions()

  console.log('seeding notification types...')
  await seedNotificationTypes()

  console.log('seeding sports...')
  await seedSports()

  console.log('seeding sport positions...')
  await seedSportPositions()

  console.log('seeding tournament formats...')
  await seedTournamentFormats()

  console.log('done')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
