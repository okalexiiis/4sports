// apps/api/src/shared/db/client.ts
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schemas";

export const db = drizzle(Bun.env.DATABASE_URL!, { schema });
export type DB = typeof db;