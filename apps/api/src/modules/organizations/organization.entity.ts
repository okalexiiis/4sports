export interface Organization {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  country_code: string | null
  city: string | null
  is_verified: boolean
  created_at: Date
}

export interface OrgWithRole extends Organization {
  role: string
}

export interface OrgMember {
  id: string
  user: {
    name: string | null
    email: string
    avatar_url: string | null
  }
  role: string
  status: string
  tournament_ids: string[]
  joined_at: Date | null
}

export interface ListMembersResult {
  members: OrgMember[]
  meta: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface InviteMemberInput {
  role: string
  tournament_ids: string[]
  invitedBy: string
}

export interface UpdateRoleInput {
  role: string
  tournament_ids: string[]
}

export interface CreateOrgInput {
  name: string
  slug?: string
  description?: string
  city?: string
  country_code?: string
  plan: string
}

export interface AuditLogInput {
  organization_id: string
  actor_user_id: string
  actor_role: string
  action: 'update' | 'delete'
  entity_type: string
  entity_id: string
  before_data?: Record<string, unknown>
  after_data?: Record<string, unknown>
}
