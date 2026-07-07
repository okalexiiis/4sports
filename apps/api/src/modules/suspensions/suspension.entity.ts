export interface Suspension {
  id: string
  player_id: string
  tournament_id: string
  stat_value_id: string | null
  suspension_matches: number
  is_draft: boolean
  confirmed_by: string | null
  confirmed_at: Date | null
  notes: string | null
  created_at: Date
}
