import type {
  CreateTournamentInput,
  OrgContext,
  PaginatedTournaments,
  PublicTournamentFilters,
  PublishTournamentInput,
  Tournament,
  TournamentFilters,
  UpdateTournamentInput,
} from './tournament.entity'

export interface ITournamentRepository {
  create(userId: string, orgId: string, data: CreateTournamentInput): Promise<Tournament>
  findById(id: string): Promise<Tournament | null>
  update(id: string, data: UpdateTournamentInput): Promise<Tournament>
  publish(id: string, opts: PublishTournamentInput): Promise<Tournament>
  listByOrg(orgId: string, filters: TournamentFilters): Promise<PaginatedTournaments>
  listPublic(filters: PublicTournamentFilters): Promise<PaginatedTournaments>
  isSlugTaken(slug: string, orgId: string, excludeId?: string): Promise<boolean>
  findOrgContext(tournamentId: string): Promise<OrgContext | null>
  findOrgPlanContext(orgId: string): Promise<OrgContext | null>
  countActiveByOrg(orgId: string): Promise<number>
}
