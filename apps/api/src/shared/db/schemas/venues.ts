import { boolean, char, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { tournaments } from './tournaments'

export const venues = pgTable('venues', {
  id: uuid('id').primaryKey().defaultRandom(),
  organization_id: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address'),
  city: text('city'),
  country_code: char('country_code', { length: 2 }),
  capacity: integer('capacity'),
  created_by: text('created_by').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const tournamentVenues = pgTable('tournament_venues', {
  id: uuid('id').primaryKey().defaultRandom(),
  tournament_id: uuid('tournament_id')
    .notNull()
    .references(() => tournaments.id, { onDelete: 'cascade' }),
  venue_id: uuid('venue_id')
    .notNull()
    .references(() => venues.id, { onDelete: 'cascade' }),
  is_primary: boolean('is_primary').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
