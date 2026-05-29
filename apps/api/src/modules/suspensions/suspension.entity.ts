export interface Suspension {
  id: string
  player_id: string
  tournament_id: string
  match_id: string
  event_type_id: string
  suspension_matches: number
  is_draft: boolean
  confirmed_by: string | null
  confirmed_at: Date | null
  justification: string | null
  created_at: Date
}
