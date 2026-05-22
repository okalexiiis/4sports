import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/shared/db/client";
import { redis } from "@/shared/db/redis";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  // Sesiones en Redis (no en PostgreSQL)
  secondaryStorage: {
    get: async (key) => {
      const val = await redis.get(key);
      return val ?? null;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, value, "EX", ttl);
      } else {
        await redis.set(key, value);
      }
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Cambiar a true en producción
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 días
    updateAge: 60 * 60 * 24,       // Renueva si la sesión tiene > 1 día
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache de cookie por 5 minutos
    },
  },

  trustedOrigins: [
    process.env.WEB_URL!,
    process.env.MOBILE_URL ?? "exp://",
  ],
});

export type Auth = typeof auth;