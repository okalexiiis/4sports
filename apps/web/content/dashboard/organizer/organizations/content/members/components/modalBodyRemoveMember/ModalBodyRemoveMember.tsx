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

export function ModalBodyRemoveMember({
  id,
  complete_name,
}: {
  id: string
  complete_name: string
}) {
  const { setAnnouncement } = useAnnouncement()
  const { modal, setModal } = useModal()
  const { setFilter, filter } = useMembersFilter()
  const context = useAuthStore((s) => s.data)

  const [removing, setRemoving] = useState(false)

  const onSubmit = async () => {
    try {
      setRemoving(true)

      const request = await fetch(
        PORT +
          `/v1/organizations/${context?.active_context?.organization_id ?? 'error'}/members/${id}`,
        {
          method: 'DELETE',
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
          message: 'Miembro removido de la organización correctamente',
        })
        setModal({
          isActivated: false,
          title: modal.title ?? '',
          body: modal.body,
        })
        setRemoving(false)
      } else {
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message:
            'Error interno al remover el miembro de la organización, intente nuevamente más tarde',
        })
        setRemoving(false)
      }
    } catch {
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message:
          'Error interno al remover el miembro de la organización, intente nuevamente más tarde',
      })
      setRemoving(false)
    }
  }

  return (
    <>
      <div className="p-6 overflow-y-auto lg:max-h-3/4 max-h-40">
        <p>
          Al dar clic en <span className="font-bold text-danger">Remover</span>, el miembro{' '}
          {complete_name}, será removido permanentemente de la organización hasta volver a ser
          invitado
        </p>
        <p>¿Desea Continuar?</p>
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

        {/* REMOVER */}
        <DinamicButton
          action={onSubmit}
          type={removing ? 'disabled' : 'destructive'}
          disabled={removing}
          disabledSpinner={true}
          spinFromText={true}
          label={'Remover'}
        />
      </div>
    </>
  )
}
