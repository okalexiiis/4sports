export interface UserIdentity {
  id: string
  email: string
  name: string
}

export interface ProfileData {
  username: string | null
  avatar_url: string | null
  city: string | null
  initial_intent: string | null
  onboarding_completed_at: Date | null
}

export interface OrgMembership {
  id: string
  name: string
  slug: string
  role: string
}

export interface ActiveContext {
  organization_id: string
  role: string
}

export interface MeData {
  user: UserIdentity
  profile: ProfileData | null
  organizations: OrgMembership[]
  active_context: ActiveContext | null
  onboarding_pending: boolean
}
