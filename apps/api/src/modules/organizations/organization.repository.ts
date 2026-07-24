import type {
  AuditLogInput,
  CreateOrgInput,
  InvitationRecord,
  InviteMemberInput,
  ListMembersResult,
  Organization,
  OrgMember,
  OrgWithRole,
  UpdateOrgInput,
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
  inviteMember(orgId: string, userId: string | null, data: InviteMemberInput): Promise<OrgMember>
  updateMemberRole(memberId: string, data: UpdateRoleInput): Promise<OrgMember>
  removeMember(memberId: string): Promise<void>
  transferOwnership(
    orgId: string,
    currentOwnerMemberId: string,
    newOwnerMemberId: string,
  ): Promise<void>
  suspendMember(memberId: string): Promise<OrgMember>
  reactivateMember(memberId: string): Promise<OrgMember>
  createAuditLog(data: AuditLogInput): Promise<void>
  findInvitationById(memberId: string): Promise<InvitationRecord | null>
  acceptInvitation(memberId: string, userId: string): Promise<OrgMember>
  rejectInvitation(memberId: string): Promise<void>
  updateOrganization(orgId: string, data: UpdateOrgInput): Promise<Organization>
}
