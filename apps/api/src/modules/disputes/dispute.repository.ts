import type { Dispute } from './dispute.entity'

export interface CreateDisputeInput {
  match_id: string
  opened_by: string
  reason: string
  description: string
  evidence_urls?: string[]
}

export interface ResolveDisputeInput {
  resolution_notes: string
  final_score_override?: { home: number; away: number }
  resolved_by: string
  resolved_at: Date
}

export interface IDisputeRepository {
  create(input: CreateDisputeInput): Promise<Dispute>
  findById(id: string): Promise<Dispute | null>
  findOpenByMatch(matchId: string): Promise<Dispute | null>
  listByMatch(matchId: string): Promise<Dispute[]>
  resolve(id: string, input: ResolveDisputeInput): Promise<Dispute>
}
