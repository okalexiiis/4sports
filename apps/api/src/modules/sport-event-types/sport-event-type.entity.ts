export interface SportEventType {
  id: string
  tournament_id: string
  name: string
  slug: string
  forces_game_ejection: boolean
  suspension_matches: number
  created_at: Date
}
