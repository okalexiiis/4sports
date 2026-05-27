import { db } from '@/shared/db/client'
import { tournamentFormats } from '@/shared/db/schemas'

export async function seedTournamentFormats() {
  await db
    .insert(tournamentFormats)
    .values([
      {
        name: 'Round Robin',
        slug: 'round_robin',
        description:
          'Cada equipo juega contra todos los demás. Clasificación por tabla de puntos o PCT.',
        plan_required: 'free',
      },
      {
        name: 'Eliminación Directa',
        slug: 'single_elimination',
        description: 'El que pierde queda fuera. Bracket de llave simple.',
        plan_required: 'free',
      },
      {
        name: 'Doble Eliminación',
        slug: 'double_elimination',
        description:
          'El equipo necesita perder dos veces para quedar eliminado. Bracket ganadores + perdedores.',
        plan_required: 'starter',
      },
      {
        name: 'Modo Mundial',
        slug: 'world_cup',
        description:
          'Fase de Grupos (Round Robin interno) + Eliminación Directa para clasificados.',
        plan_required: 'pro',
      },
    ])
    .onConflictDoNothing()
}
