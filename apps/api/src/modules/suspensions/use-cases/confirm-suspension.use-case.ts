import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { notificationsQueue } from '@/shared/lib/bullmq'
import { SuspensionErrors } from '../errors'
import type { Suspension } from '../suspension.entity'
import type { ISuspensionRepository } from '../suspension.repository'

export interface ConfirmSuspensionInput {
  suspensionId: string
  confirmedBy: string
  suspensionMatches?: number
  justification?: string
}

export async function confirmSuspension(
  repo: ISuspensionRepository,
  input: ConfirmSuspensionInput,
): Promise<Result<Suspension>> {
  const suspension = await repo.findById(input.suspensionId)
  if (!suspension) return err(SuspensionErrors.notFound(input.suspensionId))
  if (!suspension.is_draft) return err(SuspensionErrors.alreadyConfirmed(input.suspensionId))

  const confirmed = await repo.confirm(input.suspensionId, {
    confirmed_by: input.confirmedBy,
    confirmed_at: new Date(),
    suspension_matches: input.suspensionMatches,
    justification: input.justification,
  })

  await notificationsQueue.add('suspension.confirmed', {
    type: 'suspension.confirmed',
    payload: { suspensionId: confirmed.id },
  })

  return ok(confirmed)
}
