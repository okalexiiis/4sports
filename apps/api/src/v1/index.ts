import { createVersion } from '@/shared/versioning'

// Mount production modules here as they are created:
// import { userRoutes } from '@/modules/user/http/v1/routes'

export const v1 = createVersion(1)
// .use(userRoutes)
