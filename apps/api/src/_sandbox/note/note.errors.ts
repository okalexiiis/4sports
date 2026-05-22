import { DomainError } from '@4sports/utils/result'

export const NoteErrors = {
  notFound: (id: string) => new DomainError('NOTE_NOT_FOUND', `Note '${id}' not found`, { id }),
  titleRequired: () => new DomainError('NOTE_VALIDATION', 'Title is required'),
  titleTooLong: (max: number) =>
    new DomainError('NOTE_VALIDATION', `Title exceeds ${max} characters`, { max }),
}
