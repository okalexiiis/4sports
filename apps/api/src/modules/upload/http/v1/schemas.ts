import { Type } from '@sinclair/typebox'

export const PresignedUrlBodySchema = Type.Object({
  file_name: Type.String({ minLength: 1, maxLength: 255 }),
  content_type: Type.String({ minLength: 1 }),
  context: Type.Union([
    Type.Literal('avatar'),
    Type.Literal('org-logo'),
    Type.Literal('team-logo'),
    Type.Literal('banner'),
  ]),
})

export const PresignedUrlResponseSchema = Type.Object({
  upload_url: Type.String(),
  public_url: Type.String(),
  expires_in: Type.Number(),
})
