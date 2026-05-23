import { DomainError } from '@4sports/utils/result'
import { NoteErrorCodes } from './codes'

export const NoteErrors = {
  notFound: (id: string) =>
    new DomainError(NoteErrorCodes.NOT_FOUND, `Note '${id}' not found`, { id }),

  titleRequired: () => new DomainError(NoteErrorCodes.VALIDATION, 'Title is required'),

  titleTooLong: (max: number) =>
    new DomainError(NoteErrorCodes.VALIDATION, `Title exceeds ${max} characters`, { max }),
}
