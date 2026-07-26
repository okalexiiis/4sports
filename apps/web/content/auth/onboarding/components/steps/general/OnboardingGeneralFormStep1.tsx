'use client'

/* COMPONENTS */
import { InputTextUsername } from '../../inputTextUsername/InputTextUsername'
import { DinamicCombobox } from '@/content/shared/form/dinamicComboBox/DinamicCombobox'

/* HOOKS */
import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

/* TYPES */
import { OnboardingForm } from '@/content/auth/onboarding/types/onboardingForm'

/* UTILS */
import { Country, State, City } from 'country-state-city'

export function OnboardingGeneralFormStep1() {
  const { setValue, control } = useFormContext<OnboardingForm>()

  const selectedCountry = useWatch({
    control: control,
    name: 'country',
  })
  const selectedState = useWatch({
    control: control,
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
    setValue('state', '')
    setValue('city', '')
  }, [selectedCountry, setValue])

  // Reiniciar ciudad cuando cambia estado
  useEffect(() => {
    setValue('city', '')
  }, [selectedState, setValue])

  return (
    <div className="flex justify-center w-full p-6 h-fit">
      <div className="flex flex-col w-full lg:w-1/2 h-fit">
        {/* USERNAME */}
        <InputTextUsername />

        <div className="grid w-full grid-cols-1 md:grid-cols-3 md:gap-4 h-fit">
          {/* COUNTRY */}
          <DinamicCombobox<OnboardingForm>
            name="country"
            items={countries.map((c) => {
              return { value: c.isoCode, label: c.name }
            })}
            label="País"
            placeholder="Seleccionar país"
            rules={{ required: { message: 'El país es requerido', value: true } }}
          />

          {/* STATE */}
          <DinamicCombobox<OnboardingForm>
            name="state"
            items={states.map((s) => {
              return { value: s.isoCode, label: s.name }
            })}
            label="Estado"
            placeholder="Seleccionar estado"
            rules={{ required: { message: 'El estado es requerido', value: true } }}
          />

          {/* CITY */}
          <DinamicCombobox<OnboardingForm>
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
    </div>
  )
}
