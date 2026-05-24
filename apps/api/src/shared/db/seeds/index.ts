import { seedNotificationTypes } from './notification-types'
import { seedPermissions } from './permissions'
import { seedRolePermissions } from './role-permissions'
import { seedSubscriptionPlans } from './subscription-plans'

async function seed() {
  console.log('seeding subscription plans...')
  await seedSubscriptionPlans()

  console.log('seeding permissions...')
  await seedPermissions()

  console.log('seeding role permissions...')
  await seedRolePermissions()

  console.log('seeding notification types...')
  await seedNotificationTypes()

  console.log('done')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
