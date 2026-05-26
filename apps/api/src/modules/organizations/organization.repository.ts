import type {
  AuditLogInput,
  CreateOrgInput,
  InviteMemberInput,
  ListMembersResult,
  OrgMember,
  OrgWithRole,
  UpdateRoleInput,
} from './organization.entity'

export interface IOrganizationRepository {
  findById(orgId: string, requestingUserId: string): Promise<OrgWithRole | null>
  isSlugTaken(slug: string): Promise<boolean>
  findPlanIdBySlug(plan: string): Promise<string | null>
  createOrganization(userId: string, data: CreateOrgInput, planId: string): Promise<OrgWithRole>
  listMembers(orgId: string, page: number, limit: number): Promise<ListMembersResult>
  findMemberById(orgId: string, memberId: string): Promise<OrgMember | null>
  findMemberByEmail(orgId: string, email: string): Promise<{ status: string } | null>
  findUserByEmail(email: string): Promise<{ id: string } | null>
  countActiveOwners(orgId: string): Promise<number>
  inviteMember(orgId: string, userId: string, data: InviteMemberInput): Promise<OrgMember>
  updateMemberRole(memberId: string, data: UpdateRoleInput): Promise<OrgMember>
  removeMember(memberId: string): Promise<void>
  suspendMember(memberId: string): Promise<OrgMember>
  reactivateMember(memberId: string): Promise<OrgMember>
  createAuditLog(data: AuditLogInput): Promise<void>
}
