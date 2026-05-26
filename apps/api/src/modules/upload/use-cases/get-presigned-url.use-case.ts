import type { Result } from '@4sports/utils/result'
import { DomainError, err, ok } from '@4sports/utils/result'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  ALLOWED_CONTENT_TYPES,
  type AllowedContentType,
  type PresignedUrlResult,
  type UploadContext,
} from '../upload.entity'

const PRESIGNED_URL_TTL = 300

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucketName = process.env.R2_BUCKET_NAME
  const publicUrl = process.env.R2_PUBLIC_URL

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new DomainError('R2_NOT_CONFIGURED', 'File upload service is not configured')
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl }
}

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

  const config = getR2Config()

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  const sanitized = sanitizeName(input.fileName)
  const key = `${input.context}/${input.userId}/${Date.now()}-${sanitized}`

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: input.contentType as AllowedContentType,
  })

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: PRESIGNED_URL_TTL })
  const publicUrl = `${config.publicUrl}/${key}`

  return ok({ upload_url: uploadUrl, public_url: publicUrl, expires_in: PRESIGNED_URL_TTL })
}
