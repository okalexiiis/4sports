import type { OrgMembership, ProfileData } from './auth.entity'

export interface IAuthRepository {
  findProfile(userId: string): Promise<ProfileData | null>
  findMemberships(userId: string): Promise<OrgMembership[]>
}
