'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { DinamicCombobox } from '@/content/shared/form/dinamicComboBox/DinamicCombobox'
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'
import { DinamicCheckboxOptions } from '@/content/shared/form/dinamicCheckboxOptions/DinamicCheckboxOptions'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* DATA */
import { roles } from './data/comboboxItems'

/* HOOKS */
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useState } from 'react'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'
import { useMembersFilter } from '../membersTable/stores/membersStore'

/* TYPES */
import { InviteMemberFormType } from './types/inviteMemberFormType'
import { CheckboxOption } from '@/content/shared/form/dinamicCheckboxOptions/types/dinamicCheckboxOptionsProps'

const tournaments: CheckboxOption[] = [
  {
    value: '1',
    label: 'Torneo Verano II',
  },
  {
    value: '2',
    label: 'Casa de Plata',
  },
  {
    value: '3',
    label: 'Tronos',
  },
]

export function ModalBodyInviteMemberForm() {
  const { setAnnouncement } = useAnnouncement()
  const { modal, setModal } = useModal()
  const context = useAuthStore((s) => s.data)
  const { setFilter, filter } = useMembersFilter()

  const [filtering, setFiltering] = useState(false)

  const methods = useForm<InviteMemberFormType>({
    defaultValues: {
      email: '',
      role: '',
      tournaments: [],
    },
  })

  const role = useWatch({
    control: methods.control,
    name: 'role',
  })

  const onSubmit = async (data: InviteMemberFormType) => {
    try {
      setFiltering(true)

      const request = await fetch(
        PORT + `/v1/organizations/${context?.active_context?.organization_id ?? 'error'}/members`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            role: 'viewer',
            tournament_ids: [],
          }),
          credentials: 'include',
        },
      )

      if (request.status === 200) {
        setFilter({
          page: 0,
          perPage: filter?.perPage ?? 10,
        })
        methods.reset()
        setAnnouncement({
          isActivated: true,
          announceType: 'ok',
          message: 'Invitación envíada',
        })
        setModal({
          isActivated: false,
          title: modal.title ?? '',
          body: modal.body,
        })
        setFiltering(false)
      } else {
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message: 'Error interno al envíar la invitación, intente nuevamente más tarde',
        })
        setFiltering(false)
      }
    } catch {
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'Error interno al envíar la invitación, intente nuevamente más tarde',
      })
      setFiltering(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full p-6 overflow-y-auto max-h-96">
        {/* CORREO */}
        <DinamicInputText<InviteMemberFormType>
          name="email"
          label="Correo"
          placeholder="Ingrese el correo"
          rules={{ required: { message: 'El correo es requerido', value: true } }}
        />

        {/* <div className="grid w-full grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-6 h-fit">
          <DinamicInputText<InviteMemberFormType>
            name="email"
            label="Correo"
            placeholder="Ingrese el correo"
            rules={{}}
          />

          <DinamicCombobox<InviteMemberFormType>
            name="role"
            items={roles}
            label="Rol"
            placeholder="Seleccionar rol"
            rules={{
              required: "El rol es necesario",
            }}
            twMarginBottom="mb-2 md:mb-0"
          />
        </div>

        {role === "organizer" && (
          <div>
            <DinamicCheckboxOptions<InviteMemberFormType>
              name="tournaments"
              options={tournaments}
              label="Torneos asignados"
              rules={{}}
            />
            <DinamicButton
              action={() => {}}
              type="unfilled"
              label="Ver más"
              twClassName="w-fit text-sm py-1"
            />
          </div>
        )} */}
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
          action={methods.handleSubmit(onSubmit)}
          type={filtering ? 'disabled' : 'filled'}
          disabled={filtering}
          disabledSpinner={true}
          spinFromText={true}
          label="Invitar"
        />
      </div>
    </FormProvider>
  )
}
