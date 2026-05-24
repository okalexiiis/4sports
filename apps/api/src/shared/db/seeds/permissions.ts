import { db } from '@/shared/db/client'
import { permissions } from '@/shared/db/schemas'

export const PERMISSION_KEYS = {
  // org module
  ORG_READ: 'org.read',
  ORG_MANAGE_MEMBERS: 'org.manage_members',
  ORG_MANAGE_SETTINGS: 'org.manage_settings',
  ORG_MANAGE_BILLING: 'org.manage_billing',
  // tournament module
  TOURNAMENT_VIEW: 'tournament.view',
  TOURNAMENT_CREATE: 'tournament.create',
  TOURNAMENT_MANAGE: 'tournament.manage',
  TOURNAMENT_PUBLISH: 'tournament.publish',
  // team module
  TEAM_VIEW: 'team.view',
  TEAM_CREATE: 'team.create',
  TEAM_MANAGE: 'team.manage',
} as const

export async function seedPermissions() {
  await db
    .insert(permissions)
    .values([
      {
        name: PERMISSION_KEYS.ORG_READ,
        module: 'org',
        description: 'Ver detalles de la organización',
      },
      {
        name: PERMISSION_KEYS.ORG_MANAGE_MEMBERS,
        module: 'org',
        description: 'Invitar, editar y remover miembros',
      },
      {
        name: PERMISSION_KEYS.ORG_MANAGE_SETTINGS,
        module: 'org',
        description: 'Editar configuración de la organización',
      },
      {
        name: PERMISSION_KEYS.ORG_MANAGE_BILLING,
        module: 'org',
        description: 'Gestionar suscripción y facturación',
      },
      {
        name: PERMISSION_KEYS.TOURNAMENT_VIEW,
        module: 'tournament',
        description: 'Ver torneos de la organización',
      },
      {
        name: PERMISSION_KEYS.TOURNAMENT_CREATE,
        module: 'tournament',
        description: 'Crear nuevos torneos',
      },
      {
        name: PERMISSION_KEYS.TOURNAMENT_MANAGE,
        module: 'tournament',
        description: 'Editar configuración del torneo',
      },
      {
        name: PERMISSION_KEYS.TOURNAMENT_PUBLISH,
        module: 'tournament',
        description: 'Publicar torneos',
      },
      {
        name: PERMISSION_KEYS.TEAM_VIEW,
        module: 'team',
        description: 'Ver equipos e inscripciones',
      },
      { name: PERMISSION_KEYS.TEAM_CREATE, module: 'team', description: 'Crear equipos' },
      {
        name: PERMISSION_KEYS.TEAM_MANAGE,
        module: 'team',
        description: 'Gestionar roster y jugadores',
      },
    ])
    .onConflictDoNothing()
}
