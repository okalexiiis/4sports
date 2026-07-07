export interface MatchEvent {
  id: string
  match_id: string
  player_id: string
  team_id: string
  event_type_id: string
  minute: number | null
  period_index: number
  is_draft: boolean
  registered_by: string
  created_at: Date
}

export interface CreateMatchEventInput {
  match_id: string
  player_id: string
  team_id: string
  event_type_id: string
  minute?: number
  period_index: number
  registered_by: string
}
