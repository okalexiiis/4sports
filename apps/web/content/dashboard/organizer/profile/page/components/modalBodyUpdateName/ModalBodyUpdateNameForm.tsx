'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'

/* HOOKS */
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { UpdateProfileInfoFormType } from './types/updateNameFormType'
import { PORT } from '@/content/shared/consts/PORT'

export function ModalBodyUpdateNameForm() {
  const data = useAuthStore((s) => s.data)
  const setUser = useAuthStore((s) => s.setUser)
  const { setModal, modal } = useModal()
  const { setAnnouncement } = useAnnouncement()

  const [saving, setSaving] = useState(false)

  const methods = useForm<UpdateProfileInfoFormType>({
    defaultValues: {
      name: data?.user?.name ?? '...',
    },
  })

  const onSubmit = async (data: UpdateProfileInfoFormType) => {
    try {
      setSaving(true)

      const request = await fetch(PORT + '/auth/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
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
          message: 'Nombre de usuario actualizado correctamente',
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
          message:
            'Algo salió mal al actualizar el nombre de usuario, intente nuevamente más tarde',
        })
      }
    } catch {
      setSaving(false)
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'Error al actualizar el nombre de usuario, intente nuevamente más tarde',
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col w-full h-fit">
        <div className="w-full p-6 overflow-y-auto max-h-96">
          {/* NAME */}
          <DinamicInputText<UpdateProfileInfoFormType>
            name="name"
            label="Nombre"
            placeholder="Ingrese su nombre"
            rules={{}}
          />
        </div>

        <div className="flex gap-6 px-6 pb-6">
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
            label="Actualizar"
          />
        </div>
      </div>
    </FormProvider>
  )
}
