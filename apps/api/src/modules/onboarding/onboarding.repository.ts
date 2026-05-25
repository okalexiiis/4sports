import type { PlayerOnboardingInput, PlayerProfile } from './onboarding.entity'

export interface IOnboardingRepository {
  existsProfile(userId: string): Promise<boolean>
  isUsernameTaken(username: string): Promise<boolean>
  createPlayerProfile(userId: string, data: PlayerOnboardingInput): Promise<PlayerProfile>
}
