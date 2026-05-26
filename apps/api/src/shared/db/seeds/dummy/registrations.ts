import { db } from '@/shared/db/client'
import { feeInvoices, tournamentFeeItems, tournamentRegistrations } from '@/shared/db/schemas'
import { TEAM_IDS } from './teams'
import { TOURNAMENT_IDS } from './tournaments'
import { USER_IDS } from './users'

const REG_IDS = {
  tigresApproved: '00000050-0000-0000-0000-000000000001',
  aguilasPending: '00000050-0000-0000-0000-000000000002',
  lobosRejected: '00000050-0000-0000-0000-000000000003',
} as const

const FEE_ITEM_ID = '00000055-0000-0000-0000-000000000001'

export async function seedDummyRegistrations() {
  const reviewedAt = new Date('2025-06-05T14:00:00Z')

  await db
    .insert(tournamentRegistrations)
    .values([
      {
        id: REG_IDS.tigresApproved,
        tournament_id: TOURNAMENT_IDS.ligaVerano,
        team_id: TEAM_IDS.tigresFC,
        status: 'approved',
        is_external: true,
        seed: 1,
        eligibility_alerts: [],
        registered_by: USER_IDS.carlos,
        reviewed_by: USER_IDS.alexis,
        reviewed_at: reviewedAt,
      },
      {
        id: REG_IDS.aguilasPending,
        tournament_id: TOURNAMENT_IDS.ligaVerano,
        team_id: TEAM_IDS.aguilasAzules,
        status: 'pending',
        is_external: true,
        eligibility_alerts: [{ player: 'Marco Ríos', issue: 'Sexo no registrado' }],
        registered_by: USER_IDS.ivan,
      },
      {
        id: REG_IDS.lobosRejected,
        tournament_id: TOURNAMENT_IDS.ligaVerano,
        team_id: TEAM_IDS.lobosFC,
        status: 'rejected',
        is_external: true,
        rejection_reason: 'El equipo no cumple con el mínimo de jugadores con perfil verificado.',
        eligibility_alerts: [
          { player: 'Daniel Cruz', issue: 'Sexo no registrado' },
          { player: 'Andrés Mora', issue: 'Fecha de nacimiento no registrada' },
        ],
        registered_by: USER_IDS.alexis,
        reviewed_by: USER_IDS.alexis,
        reviewed_at: reviewedAt,
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(tournamentFeeItems)
    .values([
      {
        id: FEE_ITEM_ID,
        tournament_id: TOURNAMENT_IDS.ligaVerano,
        name: 'Cuota de inscripción por equipo',
        type: 'per_team',
        amount: 150000, // $1,500 MXN en centavos
        currency: 'MXN',
        is_active: true,
      },
    ])
    .onConflictDoNothing()

  // Solo se genera factura para el equipo aprobado
  await db
    .insert(feeInvoices)
    .values([
      {
        registration_id: REG_IDS.tigresApproved,
        fee_item_id: FEE_ITEM_ID,
        amount: 150000,
        currency: 'MXN',
        status: 'pending',
        due_at: new Date('2025-06-20T23:59:59Z'),
      },
    ])
    .onConflictDoNothing()
}
