import { DomainError } from '@4sports/utils/result'
import { SportErrorCodes } from './codes'

export const SportErrors = {
  notFound: (id: string) =>
    new DomainError(SportErrorCodes.NOT_FOUND, `Sport '${id}' not found`, { id }),
}
