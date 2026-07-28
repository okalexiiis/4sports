'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'
import { DinamicTextArea } from '@/content/shared/form/dinamicTextArea/DinamicTextArea'
import { DinamicCombobox } from '@/content/shared/form/dinamicComboBox/DinamicCombobox'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'

/* ICONS */
import { MapPin } from 'lucide-react'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useOrganizationStore } from '@/content/dashboard/organizer/organizations/page/stores/organizationStore/organizationStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { UpdateOrganizationInfoFormType } from './types/updateOrganizationInfoFormType'

/* UTILS */
import { Country, State, City } from 'country-state-city'

export function ModalBodyUpdateOrganizationInfoForm({ id }: { id: string }) {
  const setOrganization = useOrganizationStore((s) => s.setOrganization)
  const organization = useOrganizationStore((s) => s.organization)
  const setUser = useAuthStore((s) => s.setUser)
  const { setModal, modal } = useModal()
  const { setAnnouncement } = useAnnouncement()

  const [saving, setSaving] = useState(false)

  const methods = useForm<UpdateOrganizationInfoFormType>({
    defaultValues: {
      name: organization?.name ?? '',
      description: organization?.description ?? '',
      country: '',
      state: '',
      city: '',
      website_url: organization?.website_url ?? '',
    },
  })

  const onSubmit = async (data: UpdateOrganizationInfoFormType) => {
    try {
      setSaving(true)

      let objData: {
        name: string
        description: string
        website_url: string
        city?: string
        country?: string
      } = {
        name: data.name,
        description: data.description,
        website_url: data.website_url,
      }

      if (data.country && data.state && data.city) {
        objData = { ...objData, city: data.city, country: data.country }
      }

      const request = await fetch(PORT + '/v1/organizations/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objData),
        credentials: 'include',
      })

      if (request.status === 200) {
        const response = await request.json()
        setOrganization({ ...response.data, role: organization?.role ?? 'Miembro' }, 'finished')

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
          message: 'Foto de organización cambiada correctamente',
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
          message: 'Error al subir información al servidor, intente nuevamente más tarde',
        })
      }
    } catch {
      setSaving(false)
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'Error al subir información al servidor, intente nuevamente más tarde',
      })
    }
  }

  const selectedCountry = useWatch({
    control: methods.control,
    name: 'country',
  })
  const selectedState = useWatch({
    control: methods.control,
    name: 'state',
  })

  // Obtener países
  const countries = useMemo(() => {
    return Country.getAllCountries()
  }, [])

  // Obtener estados según país
  const states = useMemo(() => {
    if (!selectedCountry) return []

    return State.getStatesOfCountry(selectedCountry)
  }, [selectedCountry])

  // Obtener ciudades según estado
  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return []

    return City.getCitiesOfState(selectedCountry, selectedState)
  }, [selectedCountry, selectedState])

  // Reiniciar estado y ciudad cuando cambia país
  useEffect(() => {
    methods.setValue('state', '')
    methods.setValue('city', '')
  }, [selectedCountry, methods])

  // Reiniciar ciudad cuando cambia estado
  useEffect(() => {
    methods.setValue('city', '')
  }, [selectedState, methods])

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col w-full px-6 pt-6 overflow-y-auto h-fit max-h-96">
        {/* NAME */}
        <DinamicInputText<UpdateOrganizationInfoFormType>
          name="name"
          label="Nombre"
          placeholder="Ingrese el nombre de la organización"
          rules={{ required: { message: 'El nombre es requerido', value: true } }}
        />

        {/* DESCRIPTION */}
        <DinamicTextArea<UpdateOrganizationInfoFormType>
          name="description"
          label="Descripción"
          placeholder="Ingrese la descripción de la organización"
          rules={{ required: { message: 'La descripción es requerida', value: true } }}
        />

        <p className="mb-2">Ciudad actual</p>
        <div className="flex gap-2 mb-4 ml-2">
          <MapPin className="size-4 min-w-4 min-h-4 text-ink" />
          <p className="text-sm font-bold text-ink">{organization?.city ?? '...'}</p>
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-3 md:gap-4 h-fit">
          {/* COUNTRY */}
          <DinamicCombobox<UpdateOrganizationInfoFormType>
            name="country"
            items={countries.map((c) => {
              return { value: c.isoCode, label: c.name }
            })}
            label="País"
            placeholder="Seleccionar país"
            rules={{}}
          />

          {/* STATE */}
          <DinamicCombobox<UpdateOrganizationInfoFormType>
            name="state"
            items={states.map((s) => {
              return { value: s.isoCode, label: s.name }
            })}
            label="Estado"
            placeholder="Seleccionar estado"
            rules={{}}
          />

          {/* CITY */}
          <DinamicCombobox<UpdateOrganizationInfoFormType>
            name="city"
            items={cities.map((c) => {
              return { value: c.name, label: c.name }
            })}
            label="Ciudad"
            placeholder="Seleccionar ciudad"
            rules={{}}
          />
        </div>

        {/* WEBSITE_URL */}
        <DinamicInputText<UpdateOrganizationInfoFormType>
          name="website_url"
          label="Sitio web (Opcional)"
          placeholder="Ingrese el sitio web de la organización"
          rules={{}}
        />
      </div>

      <div className="flex gap-6 p-6">
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
    </FormProvider>
  )
}
