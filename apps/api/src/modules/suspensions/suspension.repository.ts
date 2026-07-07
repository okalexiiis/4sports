import type { Suspension } from './suspension.entity'

export interface ConfirmSuspensionInput {
  confirmed_by: string
  confirmed_at: Date
  suspension_matches?: number
  notes?: string
}

export interface ListSuspensionsFilter {
  organizationId: string
  tournamentId?: string
  isDraft?: boolean
}

export interface ISuspensionRepository {
  findById(id: string): Promise<Suspension | null>
  listByOrganization(filter: ListSuspensionsFilter): Promise<Suspension[]>
  confirm(id: string, input: ConfirmSuspensionInput): Promise<Suspension>
}
