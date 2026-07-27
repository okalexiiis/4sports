'use client'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { useEffect, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

/* TYPES */
import { AddOrganizationFormType } from '../../types/addOrganizationFormType'
import { UsernameCheckResult } from '../../../../../../../../../api/src/modules/onboarding/onboarding.entity'

export function InputTextOrganizationSlug() {
  const [debouncedValue, setDebouncedValue] = useState<string | undefined>('')

  const {
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<AddOrganizationFormType>()

  const organizationSlug = useWatch({
    control: control,
    name: 'slug',
  })

  // Espera a que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(organizationSlug)
    }, 500) // 500ms

    return () => clearTimeout(timer)
  }, [organizationSlug])

  // Aquí haces la búsqueda REAL
  useEffect(() => {
    const searchValue = async () => {
      if (debouncedValue) {
        try {
          const request = await fetch(PORT + '/v1/check-slug?slug=' + organizationSlug, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          })

          if (request.status === 200) {
            const response = await request.json()
            const data: UsernameCheckResult = response.data

            if (data.available) {
              clearErrors('slug')
            } else {
              setError('slug', { message: 'Apodo no disponible' })
            }
          } else if (request.status === 401) {
            setError('slug', { message: 'Sesión inactiva' })
          } else {
            setError('slug', {
              message: 'Error desde el servidor, intente nuevamente más tarde',
            })
          }
        } catch {
          setError('slug', {
            message: 'Ocurrió un error al comprobar el apodo de la organización',
          })
        }
      } else {
        setError('slug', { message: 'El apodo de la organización es necesario' })
      }
    }

    searchValue()
  }, [debouncedValue, setError, clearErrors])

  const error = errors['slug']

  return (
    <div className="flex flex-col gap-2 mb-4">
      <p>Apodo</p>

      <Controller
        name={'slug'}
        control={control}
        rules={{ required: { message: 'Campo requerido', value: true } }}
        render={({ field }) => (
          <input
            {...field}
            id="slug"
            type="text"
            placeholder="Apodo cool"
            className="w-full px-4 py-2 text-sm transition-all duration-300 border outline-none h-fit bg-background border-line rounded-xl hover:bg-surface placeholder:text-faint focus:ring-2 focus:ring-lucide"
          />
        )}
      />

      {error?.message ? (
        <p className="text-sm text-danger">{String(error.message)}</p>
      ) : (
        <p className="text-sm text-primary">Apodo disponible</p>
      )}
    </div>
  )
}
