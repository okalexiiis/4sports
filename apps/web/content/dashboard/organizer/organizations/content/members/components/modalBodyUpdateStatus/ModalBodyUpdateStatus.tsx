'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { useState } from 'react'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useMembersFilter } from '../membersTable/stores/membersStore'
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export function ModalBodyUpdateStatus({
  id,
  actualStatus,
  complete_name,
}: {
  id: string
  actualStatus: 'active' | 'suspended' | string
  complete_name: string
}) {
  const { setAnnouncement } = useAnnouncement()
  const { modal, setModal } = useModal()
  const { setFilter, filter } = useMembersFilter()
  const context = useAuthStore((s) => s.data)

  const [changingStatus, setChangingStatus] = useState(false)

  const onSubmit = async () => {
    try {
      setChangingStatus(true)

      if (actualStatus === 'active') {
        const request = await fetch(
          PORT +
            `/v1/organizations/${context?.active_context?.organization_id ?? 'error'}/members/${id}/suspend`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          },
        )

        if (request.status === 200) {
          setFilter({
            page: 0,
            perPage: filter?.perPage ?? 10,
          })
          setAnnouncement({
            isActivated: true,
            announceType: 'ok',
            message: 'Estatus cambiado correctamente',
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
            message: 'Ocurrió un error al cambiar el estatus, intente nuevamente más tarde',
          })
          setChangingStatus(false)
        }
      } else if (actualStatus === 'suspended') {
        const request = await fetch(
          PORT +
            `/v1/organizations/${context?.active_context?.organization_id ?? 'error'}/members/${id}/reactivate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          },
        )

        if (request.status === 200) {
          setFilter({
            page: 0,
            perPage: filter?.perPage ?? 10,
          })
          setAnnouncement({
            isActivated: true,
            announceType: 'ok',
            message: 'Estatus cambiado correctamente',
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
            message: 'Ocurrió un error al cambiar el estatus, intente nuevamente más tarde',
          })
          setChangingStatus(false)
        }
      }
    } catch {
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'Ocurrió un error al cambiar el estatus, intente nuevamente más tarde',
      })
      setChangingStatus(false)
    }
  }

  return (
    <>
      <div className="p-6 overflow-y-auto lg:max-h-3/4 max-h-40">
        {actualStatus === 'active' ? (
          <>
            <p>
              Al dar clic en <span className="font-bold text-danger">Suspender</span>, el estatus
              del miembro {complete_name}, será cambiado a{' '}
              <span className="font-bold text-danger">Suspendido</span>
            </p>
            <p>¿Desea Continuar? (Puede cambiar el estatus nuevamente más tarde)</p>
          </>
        ) : (
          <>
            <p>
              Al dar clic en <span className="font-bold text-primary">Activar</span>, el estatus del
              miembro {complete_name}, será cambiado a{' '}
              <span className="font-bold text-primary">Activado</span>
            </p>
            <p>¿Desea Continuar? (Puede cambiar el estatus nuevamente más tarde)</p>
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
          type={changingStatus ? 'disabled' : actualStatus === 'active' ? 'destructive' : 'filled'}
          disabled={changingStatus}
          disabledSpinner={true}
          spinFromText={true}
          label={actualStatus === 'active' ? 'Suspender' : 'Activar'}
        />
      </div>
    </>
  )
}
