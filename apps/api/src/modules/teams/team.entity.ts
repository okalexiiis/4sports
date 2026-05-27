export interface Team {
  id: string
  organization_id: string | null
  name: string
  short_name: string | null
  logo_url: string | null
  primary_color: string | null
  secondary_color: string | null
  city: string | null
  country_code: string | null
  gender_type: string
  join_policy: string
  scope: string
  owned_by_user_id: string
  created_at: Date
  updated_at: Date
}

export interface Player {
  id: string
  user_id: string | null
  display_name: string
  avatar_url: string | null
  jersey_number: number | null
  position: string | null
  sex: string | null
  date_of_birth: Date | null
  email: string | null
  phone: string | null
  is_guest: boolean
  guest_created_by: string | null
  created_at: Date
  updated_at: Date
}

export interface TeamMember {
  id: string
  team_id: string
  player_id: string
  role: string
  status: string
  joined_at: Date | null
  player: Player
}

export interface TeamInvitation {
  id: string
  team_id: string
  invited_user_id: string
  invited_by: string
  role: string
  jersey_number: number | null
  status: string
  expires_at: Date | null
  created_at: Date
}

export interface CreateTeamInput {
  name: string
  short_name?: string | null
  logo_url?: string | null
  primary_color?: string | null
  secondary_color?: string | null
  city?: string | null
  country_code?: string | null
  gender_type?: string
  join_policy?: string
  organization_id?: string | null
}

export interface AddGuestPlayerInput {
  display_name: string
  avatar_url?: string | null
  jersey_number?: number | null
  position?: string | null
  sex?: string | null
  date_of_birth?: string | null
  email?: string | null
  phone?: string | null
}

export interface InviteUserInput {
  invited_user_id: string
  role?: string
  jersey_number?: number | null
}
