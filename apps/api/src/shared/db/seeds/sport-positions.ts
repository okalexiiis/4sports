import { db } from '@/shared/db/client'
import { sportPositions, sports } from '@/shared/db/schemas'

const POSITIONS: Record<string, Array<{ name: string; slug: string; abbreviation: string }>> = {
  futbol: [
    { name: 'Portero', slug: 'portero', abbreviation: 'PO' },
    { name: 'Defensa central', slug: 'defensa_central', abbreviation: 'DC' },
    { name: 'Lateral derecho', slug: 'lateral_derecho', abbreviation: 'LD' },
    { name: 'Lateral izquierdo', slug: 'lateral_izquierdo', abbreviation: 'LI' },
    { name: 'Mediocampista defensivo', slug: 'mediocampista_defensivo', abbreviation: 'MCD' },
    { name: 'Mediocampista', slug: 'mediocampista', abbreviation: 'MC' },
    { name: 'Mediocampista ofensivo', slug: 'mediocampista_ofensivo', abbreviation: 'MCO' },
    { name: 'Extremo derecho', slug: 'extremo_derecho', abbreviation: 'ED' },
    { name: 'Extremo izquierdo', slug: 'extremo_izquierdo', abbreviation: 'EI' },
    { name: 'Segundo delantero', slug: 'segundo_delantero', abbreviation: 'SD' },
    { name: 'Delantero centro', slug: 'delantero_centro', abbreviation: 'DC2' },
  ],
  basquetbol: [
    { name: 'Base', slug: 'base', abbreviation: 'PG' },
    { name: 'Escolta', slug: 'escolta', abbreviation: 'SG' },
    { name: 'Alero', slug: 'alero', abbreviation: 'SF' },
    { name: 'Ala-pívot', slug: 'ala_pivot', abbreviation: 'PF' },
    { name: 'Pívot', slug: 'pivot', abbreviation: 'C' },
  ],
  beisbol: [
    { name: 'Lanzador', slug: 'lanzador', abbreviation: 'P' },
    { name: 'Receptor', slug: 'receptor', abbreviation: 'C' },
    { name: 'Primera base', slug: 'primera_base', abbreviation: '1B' },
    { name: 'Segunda base', slug: 'segunda_base', abbreviation: '2B' },
    { name: 'Tercera base', slug: 'tercera_base', abbreviation: '3B' },
    { name: 'Parador en corto', slug: 'parador_en_corto', abbreviation: 'SS' },
    { name: 'Jardín izquierdo', slug: 'jardin_izquierdo', abbreviation: 'LF' },
    { name: 'Jardín central', slug: 'jardin_central', abbreviation: 'CF' },
    { name: 'Jardín derecho', slug: 'jardin_derecho', abbreviation: 'RF' },
    { name: 'Bateador designado', slug: 'bateador_designado', abbreviation: 'DH' },
  ],
  voleibol: [
    { name: 'Líbero', slug: 'libero', abbreviation: 'L' },
    { name: 'Colocador', slug: 'colocador', abbreviation: 'S' },
    { name: 'Opuesto', slug: 'opuesto', abbreviation: 'OP' },
    { name: 'Central', slug: 'central', abbreviation: 'MB' },
    { name: 'Receptor/Punta', slug: 'receptor_punta', abbreviation: 'OH' },
  ],
}

export async function seedSportPositions() {
  const sportRows = await db.select({ id: sports.id, slug: sports.slug }).from(sports)

  for (const sport of sportRows) {
    const positions = POSITIONS[sport.slug]
    if (!positions) continue

    await db
      .insert(sportPositions)
      .values(positions.map((p) => ({ ...p, sport_id: sport.id })))
      .onConflictDoNothing()
  }
}
