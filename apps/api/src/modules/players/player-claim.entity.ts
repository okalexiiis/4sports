export type ClaimStatus = 'pending' | 'approved' | 'rejected'

export interface PlayerClaim {
  id: string
  player_id: string
  team_id: string
  claimant_user_id: string
  status: ClaimStatus
  reviewed_by: string | null
  reviewed_at: Date | null
  created_at: Date
}

export interface PlayerForClaim {
  id: string
  user_id: string | null
  is_guest: boolean
  display_name: string
}
