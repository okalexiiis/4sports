import type { OrgMembership, ProfileData } from './auth.entity'
import type { UpdateProfileData } from './use-cases/update-profile.use-case'

export interface IAuthRepository {
  findProfile(userId: string): Promise<ProfileData | null>
  findMemberships(userId: string): Promise<OrgMembership[]>
  findMembership(userId: string, orgId: string): Promise<{ role: string } | null>
  updateProfile(userId: string, data: UpdateProfileData): Promise<ProfileData | null>
}
