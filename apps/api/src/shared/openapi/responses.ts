import { type TSchema, Type } from '@sinclair/typebox'

export const ErrorBody = Type.Object({
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    details: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  }),
})

const PaginationMeta = Type.Object({
  page: Type.Optional(Type.Number()),
  total: Type.Optional(Type.Number()),
})

const jsonContent = (schema: TSchema) => ({
  'application/json': { schema },
})

export const ApiResponses = {
  success: <T extends TSchema>(schema: T, description = 'Success') => ({
    description,
    content: jsonContent(Type.Object({ data: schema })),
  }),

  list: <T extends TSchema>(schema: T, description = 'OK') => ({
    description,
    content: jsonContent(Type.Object({ data: Type.Array(schema) })),
  }),

  paginated: <T extends TSchema>(schema: T, description = 'OK') => ({
    description,
    content: jsonContent(Type.Object({ data: Type.Array(schema), meta: PaginationMeta })),
  }),

  error: (description: string) => ({
    description,
    content: jsonContent(ErrorBody),
  }),

  notFound: (description = 'Not found') => ({
    description,
    content: jsonContent(ErrorBody),
  }),

  validation: (description = 'Validation error') => ({
    description,
    content: jsonContent(ErrorBody),
  }),

  unauthorized: (description = 'Unauthorized') => ({
    description,
    content: jsonContent(ErrorBody),
  }),

  forbidden: (description = 'Forbidden') => ({
    description,
    content: jsonContent(ErrorBody),
  }),

  conflict: (description = 'Conflict') => ({
    description,
    content: jsonContent(ErrorBody),
  }),
}
