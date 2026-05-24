import { db } from '@/shared/db/client'
import { notificationTypes } from '@/shared/db/schemas'

export async function seedNotificationTypes() {
  await db
    .insert(notificationTypes)
    .values([
      {
        type_key: 'match_rescheduled',
        label: 'Partido reprogramado',
        description: 'El horario de un partido ha sido modificado.',
        is_mutable: false,
        default_enabled: true,
        available_channels: ['in_app', 'push', 'email'],
      },
      {
        type_key: 'match_result',
        label: 'Resultado de partido',
        description: 'Se ha registrado el resultado de un partido.',
        is_mutable: true,
        default_enabled: true,
        available_channels: ['in_app', 'push'],
      },
      {
        type_key: 'team_approved',
        label: 'Equipo aprobado',
        description: 'Tu equipo ha sido aprobado para participar en el torneo.',
        is_mutable: true,
        default_enabled: true,
        available_channels: ['in_app', 'push', 'email'],
      },
      {
        type_key: 'team_rejected',
        label: 'Equipo rechazado',
        description: 'Tu equipo no fue aprobado para participar en el torneo.',
        is_mutable: false,
        default_enabled: true,
        available_channels: ['in_app', 'push', 'email'],
      },
      {
        type_key: 'player_suspended',
        label: 'Jugador suspendido',
        description: 'Un jugador ha sido suspendido en la organización.',
        is_mutable: false,
        default_enabled: true,
        available_channels: ['in_app', 'push'],
      },
      {
        type_key: 'dispute_resolved',
        label: 'Disputa resuelta',
        description: 'Una disputa de partido ha sido resuelta.',
        is_mutable: false,
        default_enabled: true,
        available_channels: ['in_app', 'push'],
      },
      {
        type_key: 'financial_hold',
        label: 'Retención financiera',
        description: 'Tu equipo tiene una deuda pendiente que bloquea su participación.',
        is_mutable: false,
        default_enabled: true,
        available_channels: ['in_app', 'push', 'email'],
      },
      {
        type_key: 'payment_received',
        label: 'Pago recibido',
        description: 'Se ha confirmado un pago en la plataforma.',
        is_mutable: true,
        default_enabled: true,
        available_channels: ['in_app', 'email'],
      },
    ])
    .onConflictDoNothing()
}
