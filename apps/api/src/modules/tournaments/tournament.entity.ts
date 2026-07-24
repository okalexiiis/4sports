export interface TournamentSport {
  id: string
  name: string
  slug: string
  icon_url: string | null
}

export interface TournamentFormatRef {
  id: string
  name: string
  slug: string
  plan_required: string
}

export interface Tournament {
  id: string
  organization_id: string
  name: string
  slug: string
  description: string | null
  banner_url: string | null
  rules_pdf_url: string | null
  tags: string[]
  status: string
  gender_restriction: string
  validation_mode: string
  eligibility_mode: string
  settings: Record<string, unknown>
  player_fields: Record<string, unknown>
  max_teams: number | null
  min_teams: number | null
  min_players_per_team: number | null
  max_players_per_team: number | null
  is_public: boolean
  requires_approval: boolean
  join_code: string | null
  created_under_plan: string | null
  wizard_step: number
  starts_at: Date | null
  ends_at: Date | null
  registration_opens_at: Date | null
  registration_closes_at: Date | null
  sport: TournamentSport | null
  format: TournamentFormatRef | null
  created_by: string
  created_at: Date
  updated_at: Date
}

export interface CreateTournamentInput {
  name: string
  slug: string
  description?: string | null
  banner_url?: string | null
  sport_id?: string | null
  format_id?: string | null
  tags?: string[]
  settings?: Record<string, unknown>
  player_fields?: Record<string, unknown>
  max_teams?: number | null
  min_teams?: number | null
  min_players_per_team?: number | null
  max_players_per_team?: number | null
  is_public?: boolean
  requires_approval?: boolean
  gender_restriction?: string
  validation_mode?: string
  eligibility_mode?: string
  starts_at?: string | null
  ends_at?: string | null
  registration_opens_at?: string | null
  registration_closes_at?: string | null
}

export interface UpdateTournamentInput {
  name?: string
  description?: string | null
  banner_url?: string | null
  sport_id?: string | null
  format_id?: string | null
  tags?: string[]
  settings?: Record<string, unknown>
  player_fields?: Record<string, unknown>
  max_teams?: number | null
  min_teams?: number | null
  min_players_per_team?: number | null
  max_players_per_team?: number | null
  is_public?: boolean
  requires_approval?: boolean
  gender_restriction?: string
  validation_mode?: string
  eligibility_mode?: string
  starts_at?: string | null
  ends_at?: string | null
  registration_opens_at?: string | null
  registration_closes_at?: string | null
  wizard_step?: number
}

export interface PublishTournamentInput {
  visibility: 'public' | 'private'
  planSlug: string
  sportMetadata?: Record<string, unknown>
}

export interface TournamentFilters {
  status?: string
  tags?: string[]
  page: number
  limit: number
}

export interface PublicTournamentFilters {
  sport?: string
  city?: string
  tags?: string[]
  q?: string
  page: number
  limit: number
}

export interface PaginatedTournaments {
  items: Tournament[]
  meta: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface OrgContext {
  orgId: string
  planSlug: string
  planFeatures: Record<string, unknown>
}
