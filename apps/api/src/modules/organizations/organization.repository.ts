import type { ListMembersResult, OrgWithRole } from './organization.entity'

export interface IOrganizationRepository {
  findById(orgId: string, requestingUserId: string): Promise<OrgWithRole | null>
  listMembers(orgId: string, page: number, limit: number): Promise<ListMembersResult>
}
