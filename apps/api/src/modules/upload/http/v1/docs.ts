import { ApiResponses } from '@/shared/openapi/responses'
import { PresignedUrlResponseSchema } from './schemas'

export const getPresignedUrlDetail = {
  summary: 'Get presigned upload URL',
  description:
    'Returns a presigned PUT URL for uploading directly to Cloudflare R2 (valid 300s). ' +
    'Allowed content types: image/jpeg, image/png, image/webp, image/gif, application/pdf. ' +
    'After upload completes, use public_url as the asset reference.',
  responses: {
    200: ApiResponses.success(PresignedUrlResponseSchema, 'Presigned URL generated'),
    401: ApiResponses.unauthorized('No active session'),
    422: ApiResponses.validation('Invalid content type or missing fields'),
  },
}
