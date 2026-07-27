'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { DinamicCombobox } from '@/content/shared/form/dinamicComboBox/DinamicCombobox'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useState, useMemo, useEffect } from 'react'

/* ICONS */
import { MapPin } from 'lucide-react'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { UpdateCityFormType } from './types/updateCityFormType'

/* UTILS */
import { Country, State, City } from 'country-state-city'

export function ModalBodyUpdateCityForm() {
  const data = useAuthStore((s) => s.data)
  const setUser = useAuthStore((s) => s.setUser)
  const { setModal, modal } = useModal()
  const { setAnnouncement } = useAnnouncement()

  const [saving, setSaving] = useState(false)

  const methods = useForm<UpdateCityFormType>({
    defaultValues: {
      country: '',
      state: '',
      city: '',
    },
  })

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

  const onSubmit = async (data: UpdateCityFormType) => {
    try {
      setSaving(true)

      const request = await fetch(PORT + '/v1/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: data.city,
          country_code: data.country,
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
          message: 'Ciudad del usuario actualizada correctamente',
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
            'Algo salió mal al actualizar la ciudad del usuario, intente nuevamente más tarde',
        })
      }
    } catch {
      setSaving(false)
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'Error al actualizar la ciudad del usuario, intente nuevamente más tarde',
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col w-full h-fit">
        <div className="w-full p-6 overflow-y-auto max-h-96">
          <p className='mb-2'>Ciudad actual</p>
          <div className="flex gap-2 mb-4 ml-2">
            <MapPin className="size-4 min-w-4 min-h-4 text-ink" />
            <p className="text-sm font-bold text-ink">{data?.profile?.city ?? '...'}</p>
          </div>

          <p className='mb-2'>Ciudad nueva</p>
          <div className="grid w-full grid-cols-1 md:grid-cols-3 md:gap-4 h-fit">
            {/* COUNTRY */}
            <DinamicCombobox<UpdateCityFormType>
              name="country"
              items={countries.map((c) => {
                return { value: c.isoCode, label: c.name }
              })}
              label="País"
              placeholder="Seleccionar país"
              rules={{ required: { message: 'El país es requerido', value: true } }}
            />

            {/* STATE */}
            <DinamicCombobox<UpdateCityFormType>
              name="state"
              items={states.map((s) => {
                return { value: s.isoCode, label: s.name }
              })}
              label="Estado"
              placeholder="Seleccionar estado"
              rules={{ required: { message: 'El estado es requerido', value: true } }}
            />

            {/* CITY */}
            <DinamicCombobox<UpdateCityFormType>
              name="city"
              items={cities.map((c) => {
                return { value: c.name, label: c.name }
              })}
              label="Ciudad"
              placeholder="Seleccionar ciudad"
              rules={{ required: { message: 'La ciudad es requerida', value: true } }}
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
