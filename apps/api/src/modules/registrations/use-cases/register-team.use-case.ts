import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import type { ITeamRepository } from '@/modules/teams/team.repository'
import { RegistrationErrors } from '../errors'
import type { EligibilityAlert, Registration } from '../registration.entity'
import type { IRegistrationRepository } from '../registration.repository'

interface TournamentSnapshot {
  id: string
  status: string
  max_teams: number | null
  requires_approval: boolean
  gender_restriction: string
  validation_mode: string
  eligibility_mode: string
}

function runEligibilityCheck(
  members: Awaited<ReturnType<ITeamRepository['listMembers']>>,
  tournament: TournamentSnapshot,
): { eligible: boolean; alerts: EligibilityAlert[] } {
  const alerts: EligibilityAlert[] = []

  for (const member of members) {
    if (member.status !== 'active') continue

    const p = member.player

    if (
      tournament.gender_restriction !== 'none' &&
      p.sex &&
      p.sex !== tournament.gender_restriction
    ) {
      alerts.push({
        player_id: p.id,
        player_name: p.display_name,
        rule: 'gender_restriction',
        message: `Player sex '${p.sex}' does not match tournament restriction '${tournament.gender_restriction}'`,
        severity: p.is_guest ? 'warning' : 'error',
      })
    }
  }

  const errors = alerts.filter((a) => a.severity === 'error')

  if (tournament.validation_mode === 'strict' && errors.length > 0) {
    return { eligible: false, alerts }
  }

  if (
    tournament.validation_mode === 'hybrid' &&
    errors.some((a) => !members.find((m) => m.player_id === a.player_id)?.player.is_guest)
  ) {
    return { eligible: false, alerts }
  }

  return { eligible: true, alerts }
}

export async function registerTeam(
  registrationRepo: IRegistrationRepository,
  teamRepo: ITeamRepository,
  input: {
    tournamentId: string
    teamId: string
    registeredBy: string
    tournament: TournamentSnapshot
  },
): Promise<Result<Registration>> {
  const { tournament } = input

  if (tournament.status !== 'open_registration') {
    return err(RegistrationErrors.tournamentNotOpen())
  }

  const isCaptain = await teamRepo.isCaptain(input.teamId, input.registeredBy)
  if (!isCaptain) {
    return err(RegistrationErrors.notCaptain())
  }

  const existing = await registrationRepo.findByTournamentAndTeam(input.tournamentId, input.teamId)
  if (existing) {
    return err(RegistrationErrors.alreadyRegistered())
  }

  if (tournament.max_teams !== null) {
    const approved = await registrationRepo.countApprovedByTournament(input.tournamentId)
    if (approved >= tournament.max_teams) {
      return err(RegistrationErrors.tournamentFull(tournament.max_teams))
    }
  }

  const members = await teamRepo.listMembers(input.teamId)
  const { eligible, alerts } = runEligibilityCheck(members, tournament)

  if (!eligible) {
    return err(RegistrationErrors.eligibilityBlocked(alerts))
  }

  const status = tournament.requires_approval ? 'pending' : 'approved'

  const registration = await registrationRepo.create(
    input.tournamentId,
    input.teamId,
    input.registeredBy,
    alerts,
    status,
  )

  return ok(registration)
}
