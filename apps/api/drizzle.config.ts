/// <reference types="node" />
import { defineConfig } from 'drizzle-kit'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL is required')

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/shared/db/schemas',
  out: './drizzle',
  dbCredentials: { url: DATABASE_URL },
  verbose: true,
  strict: true,
})
