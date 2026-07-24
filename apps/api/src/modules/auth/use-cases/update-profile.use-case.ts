import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import type { ProfileData } from '../auth.entity'
import type { IAuthRepository } from '../auth.repository'

export interface UpdateProfileData {
  avatar_url?: string | null
  city?: string | null
  country_code?: string | null
  phone?: string | null
}

export async function updateProfile(
  repo: IAuthRepository,
  input: { userId: string; data: UpdateProfileData },
): Promise<Result<ProfileData>> {
  const updated = await repo.updateProfile(input.userId, input.data)
  if (!updated) {
    return err(new DomainError('PROFILE_NOT_FOUND', 'Perfil no encontrado'))
  }
  return ok(updated)
}
