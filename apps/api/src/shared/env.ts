function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  REDIS_URL: requireEnv('REDIS_URL'),
  BETTER_AUTH_SECRET: requireEnv('BETTER_AUTH_SECRET'),
  API_URL: requireEnv('API_URL'),
  GOOGLE_CLIENT_ID: requireEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: requireEnv('GOOGLE_CLIENT_SECRET'),
  FACEBOOK_CLIENT_ID: requireEnv('FACEBOOK_CLIENT_ID'),
  FACEBOOK_CLIENT_SECRET: requireEnv('FACEBOOK_CLIENT_SECRET'),
  WEB_URL: requireEnv('WEB_URL'),
  PORT: process.env.PORT ?? '4000',
  MOBILE_URL: process.env.MOBILE_URL ?? 'exp://',
}
