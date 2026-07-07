export type MatchStatus =
  | 'scheduled'
  | 'postponed'
  | 'live'
  | 'suspended'
  | 'finished'
  | 'disputed'
  | 'walkover'
  | 'cancelled'

export interface Match {
  id: string
  tournament_id: string
  home_team_id: string
  away_team_id: string
  venue_id: string | null
  round_id: string | null
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  winner_team_id: string | null
  scheduled_at: Date
  started_at: Date | null
  ended_at: Date | null
  referee_session_token: string | null
  next_match_id: string | null
  notes: string | null
  created_at: Date
  updated_at: Date
}

export interface MatchResult {
  id: string
  match_id: string
  period_label: string
  period_index: number
  home_score: number
  away_score: number
  created_at: Date
}

export interface MatchAssignment {
  id: string
  match_id: string
  user_id: string | null
  role: 'referee' | 'assistant_referee' | 'scorekeeper'
  assigned_at: Date
}

export interface CreateMatchInput {
  tournament_id: string
  home_team_id: string
  away_team_id: string
  scheduled_at: Date
  venue_id?: string | null
  round_id?: string | null
  notes?: string | null
}

export interface UpdateMatchInput {
  scheduled_at?: Date
  venue_id?: string | null
  notes?: string | null
}

export interface ListMatchesFilters {
  round_id?: string
  status?: MatchStatus
  team_id?: string
}
