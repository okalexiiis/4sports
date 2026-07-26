'use client'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { useEffect, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

/* TYPES */
import { OnboardingForm } from '../../types/onboardingForm'
import { UsernameCheckResult } from '../../../../../../api/src/modules/onboarding/onboarding.entity'

export function InputTextUsername() {
  const [debouncedValue, setDebouncedValue] = useState('')

  const {
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<OnboardingForm>()

  const username = useWatch({
    control: control,
    name: 'username',
  })

  // Espera a que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(username)
    }, 500) // 500ms

    return () => clearTimeout(timer)
  }, [username])

  // Aquí haces la búsqueda REAL
  useEffect(() => {
    const searchValue = async () => {
      if (debouncedValue) {
        try {
          const request = await fetch(PORT + '/v1/check-username?username=' + username, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          })

          if (request.status === 200) {
            const response = await request.json()
            const data: UsernameCheckResult = response.data

            if (data.available) {
              clearErrors('username')
            } else {
              setError('username', { message: 'Apodo no disponible' })
            }
          } else if (request.status === 401) {
            setError('username', { message: 'Sesión inactiva' })
          } else {
            setError('username', {
              message: 'Error desde el servidor, intente nuevamente más tarde',
            })
          }
        } catch {
          setError('username', { message: 'Ocurrió un error al comprobar el apodo de usuario' })
        }
      } else {
        setError('username', { message: 'El apodo de usuario es necesario' })
      }
    }

    searchValue()
  }, [debouncedValue, setError, clearErrors])

  const error = errors['username']

  return (
    <div className="flex flex-col gap-2">
      <p>Apodo de usuario</p>

      <Controller
        name={'username'}
        control={control}
        rules={{ required: { message: 'Campo requerido', value: true } }}
        render={({ field }) => (
          <input
            {...field}
            id="username"
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
