import { drizzle } from 'drizzle-orm/bun-sql'
import { env } from '@/shared/env'
import * as schema from './schemas'

export const db = drizzle(env.DATABASE_URL, { schema })
export type DB = typeof db
