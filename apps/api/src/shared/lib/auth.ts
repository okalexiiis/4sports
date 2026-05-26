import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { db } from '@/shared/db/client'
import { redis } from '@/shared/db/redis'
import { env } from '@/shared/env'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.API_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),

  // Sesiones en Redis (no en PostgreSQL)
  secondaryStorage: {
    get: async (key) => {
      const val = await redis.get(key)
      return val ?? null
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, value, 'EX', ttl)
      } else {
        await redis.set(key, value)
      }
    },
    delete: async (key) => {
      await redis.del(key)
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Cambiar a true en producción
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 días
    updateAge: 60 * 60 * 24, // Renueva si la sesión tiene > 1 día
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache de cookie por 5 minutos
    },
  },

  trustedOrigins: [env.WEB_URL, env.MOBILE_URL],
})

export type Auth = typeof auth
