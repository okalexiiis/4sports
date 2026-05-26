import type {
  AuditLogInput,
  InviteMemberInput,
  ListMembersResult,
  OrgMember,
  OrgWithRole,
  UpdateRoleInput,
} from './organization.entity'

export interface IOrganizationRepository {
  findById(orgId: string, requestingUserId: string): Promise<OrgWithRole | null>
  listMembers(orgId: string, page: number, limit: number): Promise<ListMembersResult>
  findMemberById(orgId: string, memberId: string): Promise<OrgMember | null>
  findMemberByEmail(orgId: string, email: string): Promise<{ status: string } | null>
  findUserByEmail(email: string): Promise<{ id: string } | null>
  countActiveOwners(orgId: string): Promise<number>
  inviteMember(orgId: string, userId: string, data: InviteMemberInput): Promise<OrgMember>
  updateMemberRole(memberId: string, data: UpdateRoleInput): Promise<OrgMember>
  removeMember(memberId: string): Promise<void>
  transferOwnership(
    orgId: string,
    currentOwnerMemberId: string,
    newOwnerMemberId: string,
  ): Promise<void>
  createAuditLog(data: AuditLogInput): Promise<void>
}
