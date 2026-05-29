export type DisputeStatus = 'open' | 'resolved'

export interface Dispute {
  id: string
  match_id: string
  opened_by: string
  reason: string
  description: string
  evidence_urls: string[] | null
  status: DisputeStatus
  resolution_notes: string | null
  final_score_override: { home: number; away: number } | null
  resolved_by: string | null
  resolved_at: Date | null
  created_at: Date
}
