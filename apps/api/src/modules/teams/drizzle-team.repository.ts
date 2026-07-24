import { and, count, eq, isNull } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { players, teamInvitations, teamMembers, teams } from '@/shared/db/schemas'
import type {
  AddGuestPlayerInput,
  CreateTeamInput,
  InviteUserInput,
  Team,
  TeamInvitation,
  TeamMember,
  UpdateTeamInput,
} from './team.entity'
import type { ITeamRepository } from './team.repository'

function rowToTeam(row: typeof teams.$inferSelect): Team {
  return {
    id: row.id,
    organization_id: row.organization_id,
    name: row.name,
    short_name: row.short_name,
    logo_url: row.logo_url,
    primary_color: row.primary_color,
    secondary_color: row.secondary_color,
    city: row.city,
    country_code: row.country_code,
    gender_type: row.gender_type,
    join_policy: row.join_policy,
    scope: row.scope,
    owned_by_user_id: row.owned_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function rowToTeamMember(row: {
  id: string
  team_id: string
  player_id: string
  role: string
  status: string
  joined_at: Date | null
  player_id_ref: string
  user_id: string | null
  display_name: string
  avatar_url: string | null
  jersey_number: number | null
  position: string | null
  sex: string | null
  date_of_birth: Date | null
  email: string | null
  phone: string | null
  is_guest: boolean
  guest_created_by: string | null
  player_created_at: Date
  player_updated_at: Date
}): TeamMember {
  return {
    id: row.id,
    team_id: row.team_id,
    player_id: row.player_id,
    role: row.role,
    status: row.status,
    joined_at: row.joined_at,
    player: {
      id: row.player_id_ref,
      user_id: row.user_id,
      display_name: row.display_name,
      avatar_url: row.avatar_url,
      jersey_number: row.jersey_number,
      position: row.position,
      sex: row.sex,
      date_of_birth: row.date_of_birth,
      email: row.email,
      phone: row.phone,
      is_guest: row.is_guest,
      guest_created_by: row.guest_created_by,
      created_at: row.player_created_at,
      updated_at: row.player_updated_at,
    },
  }
}

export class DrizzleTeamRepository implements ITeamRepository {
  async create(userId: string, captainDisplayName: string, data: CreateTeamInput): Promise<Team> {
    return db.transaction(async (tx) => {
      const [teamRow] = await tx
        .insert(teams)
        .values({
          name: data.name,
          short_name: data.short_name ?? null,
          logo_url: data.logo_url ?? null,
          primary_color: data.primary_color ?? null,
          secondary_color: data.secondary_color ?? null,
          city: data.city ?? null,
          country_code: data.country_code ?? null,
          gender_type: data.gender_type ?? 'mixed',
          join_policy: data.join_policy ?? 'request',
          scope: 'tournament_scoped',
          owned_by_user_id: userId,
          organization_id: data.organization_id ?? null,
        })
        .returning()

      // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
      const team = rowToTeam(teamRow!)

      const [captainPlayer] = await tx
        .insert(players)
        .values({ user_id: userId, display_name: captainDisplayName, is_guest: false })
        .returning()

      await tx.insert(teamMembers).values({
        team_id: team.id,
        // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
        player_id: captainPlayer!.id,
        role: 'captain',
        status: 'active',
        joined_at: new Date(),
      })

      return team
    })
  }

  async update(teamId: string, data: UpdateTeamInput): Promise<Team> {
    const updateValues: Partial<typeof teams.$inferInsert> = { updated_at: new Date() }
    if (data.name !== undefined) updateValues.name = data.name
    if (data.short_name !== undefined) updateValues.short_name = data.short_name
    if (data.logo_url !== undefined) updateValues.logo_url = data.logo_url
    if (data.primary_color !== undefined) updateValues.primary_color = data.primary_color
    if (data.secondary_color !== undefined) updateValues.secondary_color = data.secondary_color
    if (data.city !== undefined) updateValues.city = data.city
    if (data.country_code !== undefined) updateValues.country_code = data.country_code
    if (data.gender_type !== undefined)
      updateValues.gender_type = data.gender_type as 'male' | 'female' | 'mixed'
    if (data.join_policy !== undefined)
      updateValues.join_policy = data.join_policy as 'open' | 'request' | 'invite_only'

    await db.update(teams).set(updateValues).where(eq(teams.id, teamId))

    const updated = await this.findById(teamId)
    // biome-ignore lint/style/noNonNullAssertion: just updated
    return updated!
  }

  async findById(id: string): Promise<Team | null> {
    const [row] = await db
      .select()
      .from(teams)
      .where(and(eq(teams.id, id), isNull(teams.deleted_at)))
      .limit(1)

    return row ? rowToTeam(row) : null
  }

  async listMembers(teamId: string): Promise<TeamMember[]> {
    const rows = await db
      .select({
        id: teamMembers.id,
        team_id: teamMembers.team_id,
        player_id: teamMembers.player_id,
        role: teamMembers.role,
        status: teamMembers.status,
        joined_at: teamMembers.joined_at,
        player_id_ref: players.id,
        user_id: players.user_id,
        display_name: players.display_name,
        avatar_url: players.avatar_url,
        jersey_number: players.jersey_number,
        position: players.position,
        sex: players.sex,
        date_of_birth: players.date_of_birth,
        email: players.email,
        phone: players.phone,
        is_guest: players.is_guest,
        guest_created_by: players.guest_created_by,
        player_created_at: players.created_at,
        player_updated_at: players.updated_at,
      })
      .from(teamMembers)
      .innerJoin(players, eq(teamMembers.player_id, players.id))
      .where(eq(teamMembers.team_id, teamId))
      .orderBy(teamMembers.role, teamMembers.joined_at)

    return rows.map(rowToTeamMember)
  }

  async addGuestPlayer(
    teamId: string,
    data: AddGuestPlayerInput,
    createdBy: string,
  ): Promise<TeamMember> {
    return db.transaction(async (tx) => {
      const playerRows = await tx
        .insert(players)
        .values({
          display_name: data.display_name,
          avatar_url: data.avatar_url ?? null,
          jersey_number: data.jersey_number ?? null,
          position: data.position ?? null,
          sex: data.sex ?? null,
          date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
          email: data.email ?? null,
          phone: data.phone ?? null,
          is_guest: true,
          guest_created_by: createdBy,
        })
        .returning()

      const p = playerRows[0]
      if (!p) throw new Error('Player insert returned no row')

      const memberRows = await tx
        .insert(teamMembers)
        .values({
          team_id: teamId,
          player_id: p.id,
          role: 'player',
          status: 'active',
          joined_at: new Date(),
        })
        .returning()

      const m = memberRows[0]
      if (!m) throw new Error('TeamMember insert returned no row')

      return rowToTeamMember({
        id: m.id,
        team_id: m.team_id,
        player_id: m.player_id,
        role: m.role,
        status: m.status,
        joined_at: m.joined_at,
        player_id_ref: p.id,
        user_id: p.user_id,
        display_name: p.display_name,
        avatar_url: p.avatar_url,
        jersey_number: p.jersey_number,
        position: p.position,
        sex: p.sex,
        date_of_birth: p.date_of_birth,
        email: p.email,
        phone: p.phone,
        is_guest: p.is_guest,
        guest_created_by: p.guest_created_by,
        player_created_at: p.created_at,
        player_updated_at: p.updated_at,
      })
    })
  }

  async inviteUser(
    teamId: string,
    data: InviteUserInput,
    invitedBy: string,
  ): Promise<TeamInvitation> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const [row] = await db
      .insert(teamInvitations)
      .values({
        team_id: teamId,
        invited_user_id: data.invited_user_id,
        invited_by: invitedBy,
        role: (data.role ?? 'player') as 'captain' | 'coach' | 'player',
        jersey_number: data.jersey_number ?? null,
        status: 'pending',
        expires_at: expiresAt,
      })
      .returning()

    // biome-ignore lint/style/noNonNullAssertion: insert always returns a row
    const invitation = row!
    return {
      id: invitation.id,
      team_id: invitation.team_id,
      invited_user_id: invitation.invited_user_id,
      invited_by: invitation.invited_by,
      role: invitation.role,
      jersey_number: invitation.jersey_number,
      status: invitation.status,
      expires_at: invitation.expires_at,
      created_at: invitation.created_at,
    }
  }

  async removeMember(teamId: string, memberId: string): Promise<void> {
    await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.id, memberId), eq(teamMembers.team_id, teamId)))
  }

  async isCaptain(teamId: string, userId: string): Promise<boolean> {
    const [row] = await db
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .innerJoin(players, eq(teamMembers.player_id, players.id))
      .where(
        and(
          eq(teamMembers.team_id, teamId),
          eq(players.user_id, userId),
          eq(teamMembers.role, 'captain'),
          eq(teamMembers.status, 'active'),
        ),
      )
      .limit(1)

    return row !== undefined
  }

  async captainCount(teamId: string): Promise<number> {
    const [row] = await db
      .select({ count: count() })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.team_id, teamId),
          eq(teamMembers.role, 'captain'),
          eq(teamMembers.status, 'active'),
        ),
      )

    return Number(row?.count ?? 0)
  }
}
