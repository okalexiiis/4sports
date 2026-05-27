import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { RegistrationErrors } from '../errors'
import type { Registration, RegistrationStatus } from '../registration.entity'
import type { IRegistrationRepository } from '../registration.repository'

const VALID_TRANSITIONS: Record<string, RegistrationStatus[]> = {
  pending: ['approved', 'rejected', 'waitlisted'],
  waitlisted: ['approved', 'rejected'],
}

export async function reviewRegistration(
  repo: IRegistrationRepository,
  input: {
    registrationId: string
    actorOrgId: string
    tournamentOrgId: string
    newStatus: RegistrationStatus
    rejectionReason?: string
    reviewedBy: string
  },
): Promise<Result<Registration>> {
  if (input.actorOrgId !== input.tournamentOrgId) {
    return err(RegistrationErrors.forbidden())
  }

  const registration = await repo.findById(input.registrationId)
  if (!registration) {
    return err(RegistrationErrors.notFound(input.registrationId))
  }

  const allowed = VALID_TRANSITIONS[registration.status] ?? []
  if (!allowed.includes(input.newStatus)) {
    return err(RegistrationErrors.invalidTransition(registration.status, input.newStatus))
  }

  const updated = await repo.updateStatus(registration.id, input.newStatus, {
    rejectionReason: input.newStatus === 'rejected' ? input.rejectionReason : undefined,
    reviewedBy: input.reviewedBy,
  })

  if (input.newStatus === 'approved') {
    const feeItems = await repo.listFeeItems(registration.tournament_id)
    if (feeItems.length > 0) {
      await repo.createInvoices(
        registration.id,
        feeItems.map((f) => f.id),
      )
    }
  }

  return ok(updated)
}
