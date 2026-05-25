import type {
  OrgCreated,
  OrgOnboardingInput,
  PlayerOnboardingInput,
  PlayerProfile,
} from './onboarding.entity'

export interface IOnboardingRepository {
  existsProfile(userId: string): Promise<boolean>
  isUsernameTaken(username: string): Promise<boolean>
  createPlayerProfile(userId: string, data: PlayerOnboardingInput): Promise<PlayerProfile>
  isSlugTaken(slug: string): Promise<boolean>
  findPlanIdBySlug(planSlug: string): Promise<string | null>
  createOrgWithOwner(userId: string, data: OrgOnboardingInput, planId: string): Promise<OrgCreated>
}
