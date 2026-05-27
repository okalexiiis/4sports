import { Type } from '@sinclair/typebox'

export const EligibilityAlertSchema = Type.Object({
  player_id: Type.String({ format: 'uuid' }),
  player_name: Type.String(),
  rule: Type.String(),
  message: Type.String(),
  severity: Type.Union([Type.Literal('error'), Type.Literal('warning')]),
})

export const RegistrationSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  tournament_id: Type.String({ format: 'uuid' }),
  team_id: Type.String({ format: 'uuid' }),
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('approved'),
    Type.Literal('rejected'),
    Type.Literal('waitlisted'),
    Type.Literal('withdrawn'),
  ]),
  is_external: Type.Boolean(),
  seed: Type.Union([Type.Number(), Type.Null()]),
  rejection_reason: Type.Union([Type.String(), Type.Null()]),
  eligibility_alerts: Type.Array(EligibilityAlertSchema),
  registered_by: Type.String(),
  reviewed_by: Type.Union([Type.String(), Type.Null()]),
  reviewed_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
})

export const RegisterTeamBodySchema = Type.Object({
  team_id: Type.String({ format: 'uuid' }),
})

export const ReviewRegistrationBodySchema = Type.Object({
  status: Type.Union([
    Type.Literal('approved'),
    Type.Literal('rejected'),
    Type.Literal('waitlisted'),
  ]),
  rejection_reason: Type.Optional(Type.String({ maxLength: 500 })),
})

export const RegistrationsQuerySchema = Type.Object({
  status: Type.Optional(Type.String()),
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
})
