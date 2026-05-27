export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'withdrawn'

export interface Registration {
  id: string
  tournament_id: string
  team_id: string
  status: RegistrationStatus
  is_external: boolean
  seed: number | null
  rejection_reason: string | null
  eligibility_alerts: EligibilityAlert[]
  registered_by: string
  reviewed_by: string | null
  reviewed_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface EligibilityAlert {
  player_id: string
  player_name: string
  rule: string
  message: string
  severity: 'error' | 'warning'
}

export interface RegistrationFilters {
  status?: string
  page: number
  limit: number
}

export interface PaginatedRegistrations {
  items: Registration[]
  meta: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}
