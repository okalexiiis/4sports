'use client'

/* CLASSES */
import { ClsUploadImage, FinalMessage } from '@/content/shared/classes/uploadImage/ClsUploadImage'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { DinamicInputFile } from '@/content/shared/form/dinamicInputFile/DinamicInputFile'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { UpdateProfilePhotoFormType } from './types/updateProfilePhotoFormType'

export function ModalBodyUpdateProfilePhotoForm() {
  const setUser = useAuthStore((s) => s.setUser)
  const { setModal, modal } = useModal()
  const { setAnnouncement } = useAnnouncement()

  const [saving, setSaving] = useState(false)

  const methods = useForm<UpdateProfilePhotoFormType>()

  const onSubmit = async (data: UpdateProfilePhotoFormType) => {
    setSaving(true)

    let uploadImageRequest: FinalMessage

    if (data.image) {
      uploadImageRequest = await ClsUploadImage.upload(data.image, 'avatar')

      if (uploadImageRequest.status === 200) {
        try {
          const request = await fetch(PORT + '/v1/me/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              avatar_url: uploadImageRequest.upload_url,
            }),
            credentials: 'include',
          })

          if (request.status === 200) {
            const requestMe = await fetch(`${PORT}/v1/me`, {
              credentials: 'include',
            })

            if (requestMe.ok) {
              const responseMe = await requestMe.json()
              setUser(responseMe.data, 'authenticated')
            }

            setSaving(false)
            setAnnouncement({
              isActivated: true,
              announceType: 'ok',
              message: 'Foto de perfil cambiada correctamente',
            })
            setModal({
              isActivated: false,
              title: modal.title ?? '',
              body: modal.body,
            })
          } else {
            setSaving(false)
            setAnnouncement({
              isActivated: true,
              announceType: 'error',
              message: 'Error al subir imagen al servidor, intente nuevamente más tarde',
            })
          }
        } catch {
          setSaving(false)
          setAnnouncement({
            isActivated: true,
            announceType: 'error',
            message: 'Error al subir imagen al servidor, intente nuevamente más tarde',
          })
        }
      } else {
        setSaving(false)
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message: uploadImageRequest.message,
        })
      }
    } else {
      setSaving(false)
      methods.setError('image', { message: 'Porfavor proporcione una imagen' })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col w-full gap-6 p-6 h-fit">
        <DinamicInputFile<UpdateProfilePhotoFormType>
          variant="select-photo"
          name="image"
          rules={{ required: { message: 'La imagen es requerida', value: true } }}
        />

        <div className="flex gap-6">
          <DinamicButton
            action={() =>
              setModal({
                isActivated: false,
                title: modal.title ?? '',
                body: modal.body,
              })
            }
            type="unfilled"
            label="Cancelar"
          />
          <DinamicButton
            action={methods.handleSubmit(onSubmit)}
            type={saving ? 'disabled' : 'filled'}
            disabled={saving}
            disabledSpinner={true}
            spinFromText={true}
            label="Cambiar"
          />
        </div>
      </div>
    </FormProvider>
  )
}
