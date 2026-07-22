'use client'

/* COMPONENTS */
import Link from 'next/link'
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* ICONS */
import { FourSportsIcon } from '@/content/shared/icons/fourSports/FourSportsIcon'
import { GoogleIcon } from '@/content/shared/icons/google/GoogleIcon'
import { FacebookIcon } from '@/content/shared/icons/facebook/FacebookIcon'

/* HOOKS */
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { LoginForm } from '@/content/auth/login/types/LoginForm'
import { PORT } from '@/content/shared/consts/PORT'

export function LoginContent() {
  const router = useRouter()

  const { setAnnouncement } = useAnnouncement()
  const { setUser } = useAuthStore()

  const [saving, setSaving] = useState(false)

  const methods = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setSaving(true)

      const request = await fetch(PORT + '/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          callbackURL: '',
          rememberMe: false,
        }),
        credentials: 'include',
      })

      if (request.status === 200) {
        setUser(null, 'idle')
        router.push('/organizer/home')
      } else if (request.status === 401) {
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

      <h1 className="mb-2 text-lg font-medium text-center">Ingresa a tu cuenta</h1>

      <DinamicInputText<LoginForm>
        name="email"
        label="Correo"
        type="text"
        placeholder="tucorreo@email.com"
        rules={{}}
      />

      <DinamicInputText<LoginForm>
        name="password"
        label="Contraseña"
        type="password"
        placeholder="********"
        rules={{}}
      />

      <div className="w-full mb-4 h-fit">
        <Link href={'/login/#'} className="text-sm underline text-primary">
          Olvidé mi contraseña
        </Link>
      </div>

      <DinamicButton
        action={methods.handleSubmit(onSubmit)}
        twClassName="mb-4"
        disabled={saving}
        disabledSpinner={true}
        type={saving ? 'disabled' : 'filled'}
        label="Ingresar"
        spinFromText
      />

      <div className="flex items-center justify-center w-full gap-2 mb-4 h-fit">
        <div className="w-24 h-px rounded-full bg-line" />
        <p className="text-sm text-muted">O también</p>
        <div className="w-24 h-px rounded-full bg-line" />
      </div>

      <div className="flex gap-4 mb-6">
        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          disabled={saving}
          type={saving ? 'disabled' : 'unfilled'}
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
          disabled={saving}
          type={saving ? 'disabled' : 'unfilled'}
          label="Ingresar"
          spinFromText
          icon={
            <div className="w-4 h-4">
              <FacebookIcon />
            </div>
          }
        />
      </div>

      <div className="flex justify-center w-full gap-2 mb-4 h-fit">
        <p>¿No tienes una cuenta?</p>
        <Link href={'/register'} className="underline text-primary">
          Ir a Registrarse
        </Link>
      </div>
    </FormProvider>
  )
}
