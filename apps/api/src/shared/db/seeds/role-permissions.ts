import { inArray } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { permissions, rolePermissions } from '@/shared/db/schemas'
import { PERMISSION_KEYS } from './permissions'

const ROLE_MAP = {
  owner: [
    PERMISSION_KEYS.ORG_READ,
    PERMISSION_KEYS.ORG_MANAGE_MEMBERS,
    PERMISSION_KEYS.ORG_MANAGE_SETTINGS,
    PERMISSION_KEYS.ORG_MANAGE_BILLING,
    PERMISSION_KEYS.TOURNAMENT_VIEW,
    PERMISSION_KEYS.TOURNAMENT_CREATE,
    PERMISSION_KEYS.TOURNAMENT_MANAGE,
    PERMISSION_KEYS.TOURNAMENT_PUBLISH,
    PERMISSION_KEYS.TEAM_VIEW,
    PERMISSION_KEYS.TEAM_CREATE,
    PERMISSION_KEYS.TEAM_MANAGE,
  ],
  admin: [
    PERMISSION_KEYS.ORG_READ,
    PERMISSION_KEYS.ORG_MANAGE_MEMBERS,
    PERMISSION_KEYS.ORG_MANAGE_SETTINGS,
    PERMISSION_KEYS.TOURNAMENT_VIEW,
    PERMISSION_KEYS.TOURNAMENT_CREATE,
    PERMISSION_KEYS.TOURNAMENT_MANAGE,
    PERMISSION_KEYS.TOURNAMENT_PUBLISH,
    PERMISSION_KEYS.TEAM_VIEW,
    PERMISSION_KEYS.TEAM_CREATE,
    PERMISSION_KEYS.TEAM_MANAGE,
  ],
  organizer: [
    PERMISSION_KEYS.ORG_READ,
    PERMISSION_KEYS.TOURNAMENT_VIEW,
    PERMISSION_KEYS.TOURNAMENT_CREATE,
    PERMISSION_KEYS.TOURNAMENT_MANAGE,
    PERMISSION_KEYS.TOURNAMENT_PUBLISH,
    PERMISSION_KEYS.TEAM_VIEW,
  ],
  coach: [
    PERMISSION_KEYS.ORG_READ,
    PERMISSION_KEYS.TOURNAMENT_VIEW,
    PERMISSION_KEYS.TEAM_VIEW,
    PERMISSION_KEYS.TEAM_MANAGE,
  ],
  viewer: [PERMISSION_KEYS.ORG_READ, PERMISSION_KEYS.TOURNAMENT_VIEW, PERMISSION_KEYS.TEAM_VIEW],
} as const

export async function seedRolePermissions() {
  const allPermissionNames = Object.values(PERMISSION_KEYS)
  const rows = await db
    .select({ id: permissions.id, name: permissions.name })
    .from(permissions)
    .where(inArray(permissions.name, allPermissionNames))

  const permMap = new Map(rows.map((r) => [r.name, r.id]))

  const values: { role: keyof typeof ROLE_MAP; permission_id: string }[] = []

  for (const [role, perms] of Object.entries(ROLE_MAP) as [
    keyof typeof ROLE_MAP,
    readonly string[],
  ][]) {
    for (const permName of perms) {
      const permId = permMap.get(permName)
      if (permId) values.push({ role, permission_id: permId })
    }
  }

  if (values.length > 0) {
    await db.insert(rolePermissions).values(values).onConflictDoNothing()
  }
}
