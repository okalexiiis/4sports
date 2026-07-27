'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { useState } from 'react'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export function ModalBodyUpdateOrganizationContext({
  id,
  orgName,
}: {
  id: string
  orgName: string
}) {
  const setUser = useAuthStore((s) => s.setUser)
  const { setAnnouncement } = useAnnouncement()
  const { modal, setModal } = useModal()

  const [changing, setChanging] = useState(false)

  const onSubmit = async () => {
    try {
      setChanging(true)

      const request = await fetch(PORT + '/v1/context', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: id,
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

        setChanging(false)
        setAnnouncement({
          isActivated: true,
          announceType: 'ok',
          message: 'Ahora gestionarás los torneos de ' + orgName,
        })
        setModal({
          isActivated: false,
          title: modal.title ?? '',
          body: modal.body,
        })
      } else {
        setChanging(false)
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message: 'Ocurrió un error al seleccionar la organización, intente nuevamente más tarde',
        })
      }
    } catch {
      setChanging(false)
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'Ocurrió un error al seleccionar la organización, intente nuevamente más tarde',
      })
    }
  }

  return (
    <div className="p-6">
      <p>
        Al dar clic en <span className="font-bold text-primary">Seleccionar</span>, empezará a
        gestionar los torneos de la organización{' '}
        <span className="font-bold text-primary">{orgName}</span>
      </p>
      <p>¿Desea Continuar?</p>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-4 mt-6">
        {/* CANCELAR */}
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

        {/* CAMBIAR */}
        <DinamicButton
          action={onSubmit}
          type={'filled'}
          disabled={changing}
          disabledSpinner={true}
          spinFromText={true}
          label={'Seleccionar'}
        />
      </div>
    </div>
  )
}
