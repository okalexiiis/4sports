export interface PlayerOnboardingInput {
  username: string
  city?: string
  country_code?: string
  phone?: string
  is_looking_for_team?: boolean
}

export interface PlayerProfile {
  id: string
  username: string
  city: string | null
  country_code: string | null
  initial_intent: string
  onboarding_completed_at: Date
}

export interface UsernameCheckResult {
  available: boolean
  suggestions: string[]
}

export interface SlugCheckResult {
  available: boolean
  suggestions: string[]
}

export interface OrgOnboardingInput {
  profile: {
    username: string
    city?: string
    country_code?: string
  }
  organization: {
    name: string
    slug?: string
    description?: string
    city?: string
    country_code?: string
  }
  plan: string
}

export interface OrgCreated {
  profile: PlayerProfile
  organization: {
    id: string
    name: string
    slug: string
  }
}
