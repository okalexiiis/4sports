'use client'

/* COMPONENTS */
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'
import { DinamicTextArea } from '@/content/shared/form/dinamicTextArea/DinamicTextArea'
import { InputTextOrganizationSlug } from '../../inputTextOrganizationSlug/InputTextOrganizationSlug'
import { DinamicCombobox } from '@/content/shared/form/dinamicComboBox/DinamicCombobox'

/* HOOKS */
import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

/* TYPES */
import { OnboardingForm } from '@/content/auth/onboarding/types/onboardingForm'

/* UTILS */
import { Country, State, City } from 'country-state-city'

export function OnboardingOrganizerFormStep1() {
  const { setValue, control } = useFormContext<OnboardingForm>()

  const selectedCountry = useWatch({
    control: control,
    name: 'organizationCountry',
  })
  const selectedState = useWatch({
    control: control,
    name: 'organizationState',
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
    setValue('organizationState', '')
    setValue('organizationCity', '')
  }, [selectedCountry, setValue])

  // Reiniciar ciudad cuando cambia estado
  useEffect(() => {
    setValue('organizationCity', '')
  }, [selectedState, setValue])

  return (
    <div className="flex justify-center w-full p-6 h-fit">
      <div className="flex flex-col w-1/2 h-fit">
        <div className="flex flex-col w-full h-fit">
          {/* ORGANIZATION_NAME */}
          <DinamicInputText<OnboardingForm>
            name="organizationName"
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
          <DinamicCombobox<OnboardingForm>
            name="organizationCountry"
            items={countries.map((c) => {
              return { value: c.isoCode, label: c.name }
            })}
            label="País"
            placeholder="Seleccionar país"
            rules={{ required: { message: 'El país es requerido', value: true } }}
          />

          {/* STATE */}
          <DinamicCombobox<OnboardingForm>
            name="organizationState"
            items={states.map((s) => {
              return { value: s.isoCode, label: s.name }
            })}
            label="Estado"
            placeholder="Seleccionar estado"
            rules={{ required: { message: 'El estado es requerido', value: true } }}
          />

          {/* CITY */}
          <DinamicCombobox<OnboardingForm>
            name="organizationCity"
            items={cities.map((c) => {
              return { value: c.name, label: c.name }
            })}
            label="Ciudad"
            placeholder="Seleccionar ciudad"
            rules={{ required: { message: 'La ciudad es requerida', value: true } }}
          />
        </div>

        {/* DESCRIPTION */}
        <DinamicTextArea<OnboardingForm>
          name="organizationDescription"
          placeholder="Ingrese la descripción de la organización"
          label="Descripción"
          twHeight="h-20"
          rules={{
            required: { message: 'La descripción de la organización es requerida', value: true },
          }}
        />
      </div>
    </div>
  )
}
