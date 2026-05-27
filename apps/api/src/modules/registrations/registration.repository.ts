import type {
  EligibilityAlert,
  PaginatedRegistrations,
  Registration,
  RegistrationFilters,
  RegistrationStatus,
} from './registration.entity'

export interface IRegistrationRepository {
  create(
    tournamentId: string,
    teamId: string,
    registeredBy: string,
    alerts: EligibilityAlert[],
    status: RegistrationStatus,
  ): Promise<Registration>
  findById(id: string): Promise<Registration | null>
  findByTournamentAndTeam(tournamentId: string, teamId: string): Promise<Registration | null>
  countApprovedByTournament(tournamentId: string): Promise<number>
  updateStatus(
    id: string,
    status: RegistrationStatus,
    opts?: { rejectionReason?: string; reviewedBy?: string },
  ): Promise<Registration>
  list(tournamentId: string, filters: RegistrationFilters): Promise<PaginatedRegistrations>
  listFeeItems(
    tournamentId: string,
  ): Promise<{ id: string; name: string; type: string; amount: number; currency: string }[]>
  createInvoices(registrationId: string, feeItemIds: string[]): Promise<void>
}
