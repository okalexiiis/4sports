import { seedDummyOrganizations } from './organizations'
import { seedDummyRegistrations } from './registrations'
import { seedDummyTeams } from './teams'
import { seedDummyTournaments } from './tournaments'
import { seedDummyUsers } from './users'

async function seed() {
  console.log('seeding dummy users...')
  await seedDummyUsers()

  console.log('seeding dummy tournaments (needed before org members)...')
  await seedDummyTournaments()

  console.log('seeding dummy organizations...')
  await seedDummyOrganizations()

  console.log('seeding dummy teams...')
  await seedDummyTeams()

  console.log('seeding dummy registrations...')
  await seedDummyRegistrations()

  console.log('done — dummy data ready')
  console.log('')
  console.log('  credentials: any of alexis/josue/garib/carlos/ivan @4sports.dev : Test1234!')
  console.log('  Liga Hermosillo org id :', '00000010-0000-0000-0000-000000000001')
  console.log('  Liga Verano 2025 id    :', '00000020-0000-0000-0000-000000000001')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
