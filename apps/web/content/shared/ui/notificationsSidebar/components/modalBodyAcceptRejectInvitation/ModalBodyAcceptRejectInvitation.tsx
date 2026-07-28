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
import { useNotificationsSidebarStore } from '../../stores/notificationsSidebarStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export function ModalBodyAcceptRejectInvitation({
  id,
  accept,
  orgName,
}: {
  id: string
  accept: boolean
  orgName: string
}) {
  const { setAnnouncement } = useAnnouncement()
  const { modal, setModal } = useModal()
  const { setTrigger } = useNotificationsSidebarStore()
  const setUser = useAuthStore((s) => s.setUser)

  const [changingStatus, setChangingStatus] = useState(false)

  const onSubmit = async () => {
    try {
      setChangingStatus(true)

      if (accept) {
        const request = await fetch(PORT + `/v1/invitations/${id}/accept`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

          setTrigger({ total: 0 })
          setAnnouncement({
            isActivated: true,
            announceType: 'ok',
            message: 'Invitación aceptada correctamente',
          })
          setModal({
            isActivated: false,
            title: modal.title ?? '',
            body: modal.body,
          })
          setChangingStatus(false)
        } else {
          setAnnouncement({
            isActivated: true,
            announceType: 'error',
            message: 'Ocurrió un error al aceptar la invitación, intente nuevamente más tarde',
          })
          setChangingStatus(false)
        }
      } else {
        const request = await fetch(PORT + `/v1/invitations/${id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

          setTrigger({ total: 0 })
          setAnnouncement({
            isActivated: true,
            announceType: 'ok',
            message: 'Invitación rechazada correctamente',
          })
          setModal({
            isActivated: false,
            title: modal.title ?? '',
            body: modal.body,
          })
          setChangingStatus(false)
        } else {
          setAnnouncement({
            isActivated: true,
            announceType: 'error',
            message: 'Ocurrió un error al rechazar la invitación, intente nuevamente más tarde',
          })
          setChangingStatus(false)
        }
      }
    } catch {
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'Ocurrió un error, intente nuevamente más tarde',
      })
      setChangingStatus(false)
    }
  }

  return (
    <>
      <div className="p-6 overflow-y-auto lg:max-h-3/4 max-h-40">
        {!accept ? (
          <>
            <p>
              Al dar clic en <span className="font-bold text-danger">Rechazar</span>, la invitación
              a la organización {orgName}, será{' '}
              <span className="font-bold text-danger">Rechazada</span>
            </p>
            <p>¿Desea Continuar?</p>
          </>
        ) : (
          <>
            <p>
              Al dar clic en <span className="font-bold text-primary">Aceptar</span>, la invitación
              a la organización {orgName}, será{' '}
              <span className="font-bold text-primary">Aceptada</span>
            </p>
            <p>¿Desea Continuar?</p>
          </>
        )}
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-6 px-6 pb-6">
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

        {/* FILTRAR */}
        <DinamicButton
          action={onSubmit}
          type={changingStatus ? 'disabled' : !accept ? 'destructive' : 'filled'}
          disabled={changingStatus}
          disabledSpinner={true}
          spinFromText={true}
          label={accept ? 'Aceptar' : 'Rechazar'}
        />
      </div>
    </>
  )
}
