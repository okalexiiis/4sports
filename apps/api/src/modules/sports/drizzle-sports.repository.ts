import { eq } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { sportPositions, sports } from '@/shared/db/schemas'
import type { Sport, SportPosition } from './sports.entity'
import type { ISportsRepository } from './sports.repository'

export class DrizzleSportsRepository implements ISportsRepository {
  async listAll(): Promise<Sport[]> {
    const rows = await db
      .select()
      .from(sports)
      .where(eq(sports.is_active, true))
      .orderBy(sports.name)

    if (rows.length === 0) return []

    const allPositions = await db.select().from(sportPositions)

    const positionsBySportId = allPositions.reduce<Record<string, SportPosition[]>>((acc, pos) => {
      const list = acc[pos.sport_id] ?? []
      list.push({
        id: pos.id,
        name: pos.name,
        slug: pos.slug,
        abbreviation: pos.abbreviation,
      })
      acc[pos.sport_id] = list
      return acc
    }, {})

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon_url: row.icon_url,
      metadata: row.metadata as Record<string, unknown>,
      positions: positionsBySportId[row.id] ?? [],
    }))
  }

  async findById(id: string): Promise<Sport | null> {
    const [row] = await db.select().from(sports).where(eq(sports.id, id)).limit(1)

    if (!row) return null

    const positions = await db.select().from(sportPositions).where(eq(sportPositions.sport_id, id))

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon_url: row.icon_url,
      metadata: row.metadata as Record<string, unknown>,
      positions: positions.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        abbreviation: p.abbreviation,
      })),
    }
  }
}
