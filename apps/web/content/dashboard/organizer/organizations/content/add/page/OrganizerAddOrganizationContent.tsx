'use client'

/* COMPONENTS */
import { SectionContainer } from '@/content/shared/ui/sectionContainer/SectionContainer'
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'
import { InputTextOrganizationSlug } from '../components/inputTextOrganizationSlug/InputTextOrganizationSlug'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { DinamicCombobox } from '@/content/shared/form/dinamicComboBox/DinamicCombobox'
import { DinamicTextArea } from '@/content/shared/form/dinamicTextArea/DinamicTextArea'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'

/* ICONS */
import { ArrowLeft, Save } from 'lucide-react'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { AddOrganizationFormType } from '../types/addOrganizationFormType'

/* UTILS */
import { Country, State, City } from 'country-state-city'

export function OrganizerAddOrganizationContent() {
  const router = useRouter()

  const setUser = useAuthStore((s) => s.setUser)
  const { setAnnouncement } = useAnnouncement()

  const [saving, setSaving] = useState(false)

  const methods = useForm<AddOrganizationFormType>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      city: '',
      state: '',
      country: '',
    },
  })

  const onSubmit = async (data: AddOrganizationFormType) => {
    try {
      setSaving(true)

      const request = await fetch(PORT + '/v1/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          slug: data.slug,
          description: data.description,
          city: data.city,
          country_code: data.country,
          plan: 'free',
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
          message: 'Organización creada correctamente',
        })

        router.push('/organizer/organizations')
      } else {
        setSaving(false)
        setAnnouncement({
          isActivated: true,
          announceType: 'ok',
          message:
            'Error al crear organización, revise la información e intente nuevamente más tarde',
        })
      }
    } catch {
      setSaving(false)
      setAnnouncement({
        isActivated: true,
        announceType: 'ok',
        message: 'Error al crear organización, intente nuevamente más tarde',
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
    <SectionContainer>
      <div className="relative flex flex-col">
        <div className="sticky top-0 z-30 flex items-center justify-center p-6 border-b bg-background border-line">
          <DinamicButton
            action={() => router.push('/organizer/organizations')}
            type="unfilled"
            label="Regresar"
            twClassName="w-fit py-1 text-sm absolute top-1/2 left-6 -translate-y-1/2"
            icon={<ArrowLeft className="size-4 min-h-4 min-w-4 text-primary" />}
          />

          <p className="text-5xl text-center font-bebas text-ink">
            Nueva <span className="text-primary">Organización</span>
          </p>
        </div>

        <div className="flex justify-center w-full p-6">
          <div className="flex flex-col w-1/2">
            <FormProvider {...methods}>
              <div className="flex flex-col w-full h-fit">
                {/* ORGANIZATION_NAME */}
                <DinamicInputText<AddOrganizationFormType>
                  name="name"
                  label="Nombre de organización"
                  type="text"
                  placeholder="Ingresa el nombre de la organización"
                  rules={{
                    required: { message: 'El nombre de la organización es requerido', value: true },
                  }}
                />

                {/* ORGANIZATION_SLUG */}
                <InputTextOrganizationSlug />
              </div>

              <div className="grid w-full grid-cols-1 md:grid-cols-3 md:gap-4 h-fit">
                {/* COUNTRY */}
                <DinamicCombobox<AddOrganizationFormType>
                  name="country"
                  items={countries.map((c) => {
                    return { value: c.isoCode, label: c.name }
                  })}
                  label="País"
                  placeholder="Seleccionar país"
                  rules={{ required: { message: 'El país es requerido', value: true } }}
                />

                {/* STATE */}
                <DinamicCombobox<AddOrganizationFormType>
                  name="state"
                  items={states.map((s) => {
                    return { value: s.isoCode, label: s.name }
                  })}
                  label="Estado"
                  placeholder="Seleccionar estado"
                  rules={{ required: { message: 'El estado es requerido', value: true } }}
                />

                {/* CITY */}
                <DinamicCombobox<AddOrganizationFormType>
                  name="city"
                  items={cities.map((c) => {
                    return { value: c.name, label: c.name }
                  })}
                  label="Ciudad"
                  placeholder="Seleccionar ciudad"
                  rules={{ required: { message: 'La ciudad es requerida', value: true } }}
                />
              </div>

              {/* DESCRIPTION */}
              <DinamicTextArea<AddOrganizationFormType>
                name="description"
                placeholder="Ingrese la descripción de la organización"
                label="Descripción"
                twHeight="h-20"
                rules={{
                  required: {
                    message: 'La descripción de la organización es requerida',
                    value: true,
                  },
                }}
              />

              {/* BOTÓN GUARDAR */}
              <DinamicButton
                action={methods.handleSubmit(onSubmit)}
                type={saving ? 'disabled' : 'filled'}
                label="Guardar"
                icon={<Save className="size-4 min-h-4 min-w-4" />}
                disabled={saving}
                disabledSpinner={true}
                spinFromText={true}
              />
            </FormProvider>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
