import type { Result } from '@4sports/utils/result'
import { err, ok } from '@4sports/utils/result'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/shared/env'
import {
  ALLOWED_CONTENT_TYPES,
  type AllowedContentType,
  type PresignedUrlResult,
  type UploadContext,
} from '../upload.entity'

const PRESIGNED_URL_TTL = 300

function sanitizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .slice(0, 100)
}

export async function getPresignedUrl(input: {
  userId: string
  fileName: string
  contentType: string
  context: UploadContext
}): Promise<Result<PresignedUrlResult>> {
  if (!(ALLOWED_CONTENT_TYPES as readonly string[]).includes(input.contentType)) {
    return err(
      new DomainError(
        'INVALID_CONTENT_TYPE',
        `Content type not allowed. Allowed: ${ALLOWED_CONTENT_TYPES.join(', ')}`,
      ),
    )
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  })

  const sanitized = sanitizeName(input.fileName)
  const key = `${input.context}/${input.userId}/${Date.now()}-${sanitized}`

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ContentType: input.contentType as AllowedContentType,
  })

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: PRESIGNED_URL_TTL })
  const publicUrl = `${env.R2_PUBLIC_URL}/${key}`

  return ok({ upload_url: uploadUrl, public_url: publicUrl, expires_in: PRESIGNED_URL_TTL })
}
