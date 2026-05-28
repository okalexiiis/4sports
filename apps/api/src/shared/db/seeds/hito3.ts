import { db } from '@/shared/db/client'
import { notificationTypes } from '@/shared/db/schemas'
import { sportEventTypes } from '@/shared/db/schemas/match-stats'

// Seeds sport_event_types for a specific tournament.
// Call this after creating a tournament in your local dev environment.
export async function seedSportEventTypesFutbol(tournamentId: string) {
  await db
    .insert(sportEventTypes)
    .values([
      {
        tournament_id: tournamentId,
        name: 'Gol',
        slug: 'goal',
        forces_game_ejection: false,
        suspension_matches: 0,
      },
      {
        tournament_id: tournamentId,
        name: 'Autogol',
        slug: 'own_goal',
        forces_game_ejection: false,
        suspension_matches: 0,
      },
      {
        tournament_id: tournamentId,
        name: 'Tarjeta Amarilla',
        slug: 'yellow_card',
        forces_game_ejection: false,
        suspension_matches: 0,
      },
      {
        tournament_id: tournamentId,
        name: 'Tarjeta Roja',
        slug: 'red_card',
        forces_game_ejection: true,
        suspension_matches: 1,
      },
      {
        tournament_id: tournamentId,
        name: 'Segunda Amarilla',
        slug: 'second_yellow',
        forces_game_ejection: true,
        suspension_matches: 1,
      },
      {
        tournament_id: tournamentId,
        name: 'Cambio',
        slug: 'substitution',
        forces_game_ejection: false,
        suspension_matches: 0,
      },
    ])
    .onConflictDoNothing()
}

// Adds the notification_types introduced in Hito 3 that are not yet in the base seed.
// match_rescheduled and dispute_resolved already exist from previous seeds.
export async function seedHito3NotificationTypes() {
  await db
    .insert(notificationTypes)
    .values([
      {
        type_key: 'match_finished',
        label: 'Partido finalizado',
        description: 'El partido ha concluido y el resultado está disponible.',
        is_mutable: true,
        default_enabled: true,
        available_channels: ['in_app', 'push'],
      },
      {
        type_key: 'suspension_confirmed',
        label: 'Sanción confirmada',
        description: 'Una sanción ha sido confirmada por el organizador.',
        is_mutable: false,
        default_enabled: true,
        available_channels: ['in_app', 'push'],
      },
      {
        type_key: 'dispute_opened',
        label: 'Disputa abierta',
        description: 'Se ha abierto una disputa formal sobre el resultado de un partido.',
        is_mutable: false,
        default_enabled: true,
        available_channels: ['in_app', 'push'],
      },
    ])
    .onConflictDoNothing()
}
