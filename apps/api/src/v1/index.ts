import { authV1Routes } from '@/modules/auth/http/v1/routes'
import { createVersion } from '@/shared/versioning'

export const v1 = createVersion(1).use(authV1Routes)
