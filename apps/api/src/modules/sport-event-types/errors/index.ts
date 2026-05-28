import { DomainError } from '@4sports/utils/result'
import { SportEventTypeErrorCodes } from './codes'

export const SportEventTypeErrors = {
  notFound: (id: string) =>
    new DomainError(SportEventTypeErrorCodes.NOT_FOUND, `Sport event type '${id}' not found`),
}
