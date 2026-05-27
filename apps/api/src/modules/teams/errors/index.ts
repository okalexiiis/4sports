import { DomainError } from '@4sports/utils/result'
import { TeamErrorCodes } from './codes'

export const TeamErrors = {
  notFound: (id: string) =>
    new DomainError(TeamErrorCodes.NOT_FOUND, `Team '${id}' not found`, { id }),

  forbidden: () =>
    new DomainError(TeamErrorCodes.FORBIDDEN, 'You do not have permission to modify this team'),

  memberNotFound: (id: string) =>
    new DomainError(TeamErrorCodes.MEMBER_NOT_FOUND, `Team member '${id}' not found`, { id }),

  lastCaptain: () =>
    new DomainError(TeamErrorCodes.LAST_CAPTAIN, 'Cannot remove the only captain of the team'),

  alreadyInvited: (userId: string) =>
    new DomainError(
      TeamErrorCodes.ALREADY_INVITED,
      `User '${userId}' already has a pending invitation`,
      {
        user_id: userId,
      },
    ),

  alreadyMember: (userId: string) =>
    new DomainError(TeamErrorCodes.ALREADY_MEMBER, `User '${userId}' is already a team member`, {
      user_id: userId,
    }),
}
