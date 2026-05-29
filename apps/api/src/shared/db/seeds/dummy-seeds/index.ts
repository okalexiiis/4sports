// Dummy data seeder for local testing.
//
// Creates a full, coherent slice of test data — loginable users, an org,
// venues, tournaments, teams, players, registrations, matches (finished +
// scheduled), player stats and standings.
//
// Requirements: Postgres AND Redis must be up (BetterAuth stores sessions in
// Redis via secondaryStorage). Run `pnpm run docker:up` first, then:
//   bun run db:seed:dummy
//
// Idempotent: safe to run repeatedly. Login with any account from users.ts,
// e.g. organizer@test.com / Password123!

import { seedSportPositions } from '../sport-positions'
import { seedSports } from '../sports'
import { seedSubscriptionPlans } from '../subscription-plans'
import { seedTournamentFormats } from '../tournament-formats'
import { seedDummyEventTypes } from './event-types'
import { seedDummyMatches } from './matches'
import { seedDummyOrganizations } from './organizations'
import { seedDummyProfiles } from './profiles'
import { seedDummyRegistrations } from './registrations'
import { seedDummyStandings } from './standings'
import { seedDummyStats } from './stats'
import { seedDummyTeams } from './teams-players'
import { seedDummyTournaments } from './tournaments'
import { seedDummyUsers } from './users'
import { seedDummyVenues } from './venues'

async function seed() {
  // Reference data the dummy data depends on (idempotent).
  console.log('ensuring reference data (plans, sports, positions, formats)...')
  await seedSubscriptionPlans()
  await seedSports()
  await seedSportPositions()
  await seedTournamentFormats()

  console.log('seeding dummy users (BetterAuth)...')
  const userIds = await seedDummyUsers()

  console.log('seeding profiles...')
  await seedDummyProfiles(userIds)

  console.log('seeding organization + members...')
  await seedDummyOrganizations(userIds)

  console.log('seeding venues...')
  await seedDummyVenues(userIds)

  console.log('seeding tournaments...')
  await seedDummyTournaments(userIds)

  console.log('seeding teams + players...')
  await seedDummyTeams(userIds)

  console.log('seeding registrations...')
  await seedDummyRegistrations(userIds)

  console.log('seeding sport event types...')
  await seedDummyEventTypes()

  console.log('seeding matches + results...')
  await seedDummyMatches()

  console.log('seeding player stats...')
  await seedDummyStats(userIds)

  console.log('seeding standings...')
  await seedDummyStandings()

  console.log('done')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
