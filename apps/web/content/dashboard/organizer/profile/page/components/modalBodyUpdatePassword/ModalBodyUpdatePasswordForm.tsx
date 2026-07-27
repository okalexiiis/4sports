'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'

/* TYPES */
import { UpdatePasswordFormType } from './types/updatePasswordFormType'

export function ModalBodyUpdatePasswordForm() {
  const { setModal, modal } = useModal()
  const { setAnnouncement } = useAnnouncement()

  const [saving, setSaving] = useState(false)

  const methods = useForm<UpdatePasswordFormType>({
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirm: '',
    },
  })

  const onSubmit = async (data: UpdatePasswordFormType) => {
    try {
      setSaving(true)

      const new_password = data.new_password
      const new_password_confirm = data.new_password_confirm

      if (new_password.length < 8) {
        methods.setError('new_password', {
          message: 'La contraseña debe ser mayor de 8 caracteres',
        })
      }

      if (new_password !== new_password_confirm) {
        methods.setError('new_password_confirm', { message: 'La s contraseñas deben ser iguales' })
      }

      const request = await fetch(PORT + '/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword: new_password,
          currentPassword: data.current_password,
          revokeOtherSessions: false,
        }),
        credentials: 'include',
      })

      if (request.status === 200) {
        setSaving(false)
        setAnnouncement({
          isActivated: true,
          announceType: 'ok',
          message: 'Contraseña actualizada correctamente',
        })
        setModal({
          isActivated: false,
          title: modal.title ?? '',
          body: modal.body,
        })
      } else {
        const response = await request.json()
        console.log(response)
        setSaving(false)
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message: 'Algo salió mal al actualizar la contraseña, intente nuevamente más tarde',
        })
      }
    } catch {
      setSaving(false)
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'Error al actualizar la contraseña, intente nuevamente más tarde',
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col w-full h-fit">
        <div className="w-full p-6 overflow-y-auto max-h-96">
          {/* PASSWORD */}
          <DinamicInputText<UpdatePasswordFormType>
            name="current_password"
            label="Contraseña actual"
            placeholder="********"
            type="password"
            rules={{ required: { message: 'La contraseña actual es requerida', value: true } }}
          />

          <div className="grid w-full grid-cols-2 gap-4 h-fit">
            <DinamicInputText<UpdatePasswordFormType>
              name="new_password"
              label="Nueva contraseña"
              type="password"
              placeholder="********"
              rules={{ required: { message: 'La contraseña es necesaria', value: true } }}
            />
            <DinamicInputText<UpdatePasswordFormType>
              name="new_password_confirm"
              label="Confirmar"
              type="password"
              placeholder="********"
              rules={{
                required: { message: 'La contraseña confirmada es necesaria', value: true },
              }}
            />
          </div>
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
