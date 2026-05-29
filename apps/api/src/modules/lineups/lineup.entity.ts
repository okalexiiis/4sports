export type LineupRole = 'starter' | 'substitute' | 'did_not_play'

export interface LineupEntry {
  id: string
  match_id: string
  team_id: string
  player_id: string
  lineup_role: LineupRole
  field_position: string | null
  jersey_number: number | null
  published_at: Date | null
  created_at: Date
}

export interface LineupPlayerInput {
  player_id: string
  lineup_role: LineupRole
  field_position?: string
  jersey_number?: number
}
