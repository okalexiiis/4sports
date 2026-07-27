import { PORT } from '@/content/shared/consts/PORT'

export type UploadContext = 'avatar' | 'org-logo' | 'team-logo' | 'banner'

interface PresignedUploadResponse {
  upload_url: string
  public_url: string
  expires_in: number
}

type Message = {
  message: string
  data?: PresignedUploadResponse | undefined
  status: number
}

export type FinalMessage = {
  message: string
  status: number
  upload_url?: string | undefined
}

export class ClsUploadImage {
  /**
   * Sube un archivo y devuelve la URL pública.
   */
  static async upload(file: File, context: UploadContext): Promise<FinalMessage> {
    const preasignedUploadResponse = await this.getPresignedUpload(file, context)

    if (!preasignedUploadResponse.data) {
      return preasignedUploadResponse
    }

    const uploadToStorageResponse = await this.uploadToStorage(
      preasignedUploadResponse.data.upload_url,
      file,
    )

    if (uploadToStorageResponse.status === 500) {
      return uploadToStorageResponse
    }

    return {
      message: uploadToStorageResponse.message,
      status: uploadToStorageResponse.status,
      upload_url: preasignedUploadResponse.data.public_url,
    }
  }

  /**
   * Solicita una URL firmada al backend.
   */
  private static async getPresignedUpload(file: File, context: UploadContext): Promise<Message> {
    try {
      const response = await fetch(PORT + '/v1/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_name: file.name,
          content_type: file.type,
          context,
        }),
        credentials: 'include',
      })

      if (response.status === 200) {
        const res = await response.json()
        return { message: 'Url de imagen obtenida correctamente', status: 200, data: res.data }
      }

      if (response.status === 401) {
        return { message: 'No tiene sesión activa', status: 401 }
      }

      if (response.status === 422) {
        return { message: 'Contenido de imagen inválido', status: 422 }
      }

      return { message: 'Error desde el servidor, intente nuevamente más tarde', status: 500 }
    } catch {
      return { message: 'Error desde el servidor, intente nuevamente más tarde', status: 500 }
    }
  }

  /**
   * Sube el archivo directamente a Cloudflare R2.
   */
  private static async uploadToStorage(
    uploadUrl: string,
    file: File,
  ): Promise<Omit<Message, 'data'>> {
    try {
      console.log(file.type)
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!response.ok) {
        return { message: 'Error al subir imagen, intente nuevamente más tarde', status: 500 }
      }

      return { message: 'Imagen subida correctamente', status: 200 }
    } catch {
      return { message: 'Error al subir imagen desde el servidor, intente nuevamente más tarde', status: 500 }
    }
  }
}
