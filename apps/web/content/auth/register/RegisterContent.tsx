'use client'

/* COMPONENTS */
import Link from 'next/link'
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* ICONS */
import { FourSportsIcon } from '@/content/shared/icons/fourSports/FourSportsIcon'
/* import { GoogleIcon } from '@/content/shared/icons/google/GoogleIcon'
import { FacebookIcon } from '@/content/shared/icons/facebook/FacebookIcon' */

/* HOOKS */
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { RegisterForm } from '@/content/auth/register/types/RegisterForm'

export function RegisterContent() {
  const router = useRouter()

  const { setAnnouncement } = useAnnouncement()
  const { setUser } = useAuthStore()

  const [saving, setSaving] = useState(false)

  const methods = useForm<RegisterForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirm: '',
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setSaving(true)

      const password = data.password
      const password_confirm = data.password_confirm

      if (password.length < 8) {
        methods.setError('password', { message: 'La contraseña debe ser mayor de 8 caracteres' })
        setSaving(false)
        return
      }

      if (password !== password_confirm) {
        methods.setError('password_confirm', { message: 'Las contraseñas deben ser iguales' })
        setSaving(false)
        return
      }

      const request = await fetch(PORT + '/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password,
          callbackURL: '',
          rememberMe: false,
        }),
        credentials: 'include',
      })

      if (request.status === 200) {
        setUser(null, 'empty')
        router.push('/organizer/home')
      } else if (request.status === 400) {
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message: 'Información inválida, intente nuevamente con otros datos',
        })
      } else {
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message: 'A ocurrido un error interno, intente nuevamente más tarde',
        })
      }

      setSaving(false)
    } catch {
      setAnnouncement({
        isActivated: true,
        announceType: 'error',
        message: 'A ocurrido un error interno, intente nuevamente más tarde',
      })

      setSaving(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="w-24 m-auto mb-4">
        <FourSportsIcon />
      </div>

      <h1 className="mb-2 text-lg font-medium text-center text-ink">Crear una cuenta nueva</h1>

      <DinamicInputText<RegisterForm>
        name="name"
        label="Nombre"
        type="text"
        placeholder="María, Pedro, Juan..."
        rules={{}}
      />

      <DinamicInputText<RegisterForm>
        name="email"
        label="Correo"
        type="text"
        placeholder="tucorreo@email.com"
        rules={{ required: { message: 'El correo es necesario', value: true } }}
      />

      <div className="grid w-full grid-cols-2 gap-4 h-fit">
        <DinamicInputText<RegisterForm>
          name="password"
          label="Contraseña"
          type="password"
          placeholder="********"
          rules={{ required: { message: 'La contraseña es necesaria', value: true } }}
        />
        <DinamicInputText<RegisterForm>
          name="password_confirm"
          label="Confirmar"
          type="password"
          placeholder="********"
          rules={{ required: { message: 'La contraseña confirmada es necesaria', value: true } }}
        />
      </div>

      <DinamicButton
        action={methods.handleSubmit(onSubmit)}
        twClassName="w-full h-fit py-2 px-4 rounded-xl mb-4"
        disabled={saving}
        disabledSpinner={false}
        type={saving ? 'disabled' : 'filled'}
        label="Registrarse"
        spinFromText
      />

      {/* <div className="flex items-center justify-center w-full gap-2 mb-4 h-fit">
        <div className="w-24 h-px rounded-full bg-line" />
        <p className="text-sm text-muted">O también</p>
        <div className="w-24 h-px rounded-full bg-line" />
      </div> */}

      {/* <div className="flex gap-4 mb-6">
        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          twClassName="w-full h-fit py-2 px-4 rounded-xl"
          disabled={saving}
          disabledSpinner={false}
          type={saving ? "disabled" : "unfilled"}
          label="Google"
          spinFromText
          icon={
            <div className="w-4 h-4">
              <GoogleIcon />
            </div>
          }
        />

        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          twClassName="w-full h-fit py-2 px-4 rounded-xl"
          disabled={saving}
          disabledSpinner={true}
          type={saving ? "disabled" : "unfilled"}
          label="Ingresar"
          spinFromText
          icon={
            <div className="w-4 h-4">
              <FacebookIcon />
            </div>
          }
        />
      </div> */}

      <div className="flex justify-center w-full gap-2 mb-4 h-fit">
        <p>¿Ya tienes una cuenta?</p>
        <Link href={'/login'} className="underline text-primary">
          Ir a Ingresar
        </Link>
      </div>
    </FormProvider>
  )
}
