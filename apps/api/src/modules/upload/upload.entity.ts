export interface PresignedUrlResult {
  upload_url: string
  public_url: string
  expires_in: number
}

export type UploadContext = 'avatar' | 'org-logo' | 'banner'

export const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
] as const

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number]
