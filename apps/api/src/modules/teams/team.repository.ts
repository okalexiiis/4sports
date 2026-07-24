import type {
  AddGuestPlayerInput,
  CreateTeamInput,
  InviteUserInput,
  Team,
  TeamInvitation,
  TeamMember,
  UpdateTeamInput,
} from './team.entity'

export interface ITeamRepository {
  create(userId: string, captainDisplayName: string, data: CreateTeamInput): Promise<Team>
  findById(id: string): Promise<Team | null>
  update(teamId: string, data: UpdateTeamInput): Promise<Team>
  listMembers(teamId: string): Promise<TeamMember[]>
  addGuestPlayer(teamId: string, data: AddGuestPlayerInput, createdBy: string): Promise<TeamMember>
  inviteUser(teamId: string, data: InviteUserInput, invitedBy: string): Promise<TeamInvitation>
  removeMember(teamId: string, memberId: string): Promise<void>
  isCaptain(teamId: string, userId: string): Promise<boolean>
  captainCount(teamId: string): Promise<number>
}
