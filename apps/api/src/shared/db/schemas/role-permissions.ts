import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { orgRoleEnum } from './enums'
import { permissions } from './permissions'

export const rolePermissions = pgTable(
  'role_permissions',
  {
    role: orgRoleEnum('role').notNull(),
    permission_id: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.role, t.permission_id] })],
)
