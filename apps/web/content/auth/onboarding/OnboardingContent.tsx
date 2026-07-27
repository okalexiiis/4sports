'use client'

/* COMPONENTS */
import { OnboardingGeneralFormStep1 } from '@/content/auth/onboarding/components/steps/general/OnboardingGeneralFormStep1'
import { OnboardingGeneralFormStep2 } from '@/content/auth/onboarding/components/steps/general/OnboardingGeneralFormStep2'
import { OnboardingPlayerStep1 } from '@/content/auth/onboarding/components/steps/player/OnboardingPlayerFormStep1'
import { OnboardingOrganizerFormStep1 } from '@/content/auth/onboarding/components/steps/organizer/OnboardingOrganizerStep1'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { SectionContainer } from '@/content/shared/ui/sectionContainer/SectionContainer'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { useMemo, useState } from 'react'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'

/* ICONS */
import { FourSportsIcon } from '@/content/shared/icons/fourSports/FourSportsIcon'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

/* LIBS */
import { AnimatePresence, motion } from 'framer-motion'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { OnboardingForm } from '@/content/auth/onboarding/types/onboardingForm'
import { Step } from '@/content/auth/onboarding/types/step'

export function OnboardingContent() {
  const { setAnnouncement } = useAnnouncement()
  const setUser = useAuthStore((s) => s.setUser)

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const methods = useForm<OnboardingForm>({
    mode: 'onTouched',
    shouldUnregister: false,
    defaultValues: {
      /* COMMON */
      username: '',
      country: '',
      state: '',
      city: '',
      role: 'organizer',

      /* PLAYER */
      playerPhone: '',
      playerPhoneCode: '',
      playerIsSearchingForTeam: false,

      /* ORGANIZATION */
      organizationName: '',
      organizationSlug: '',
      organizationDescription: '',
      organizationCountry: '',
      organizationState: '',
      organizationCity: '',
    },
  })

  const { trigger, handleSubmit, resetField } = methods

  const role = useWatch({
    control: methods.control,
    name: 'role',
  })

  const steps: Step[] = useMemo(() => {
    const commonSteps: Step[] = [
      {
        title: '¿Quién eres?',
        fields: ['username'],
        component: <OnboardingGeneralFormStep1 />,
      },
      /* {
        title: 'Elige tu rol',
        description: '¿Para que deseas utilizar 4Sports?',
        fields: ['role'],
        component: <OnboardingGeneralFormStep2 />,
      }, */
    ]

    const playerSteps: Step[] = [
      {
        title: 'Tu pasión',
        fields: ['playerPhone', 'playerPhoneCode', 'playerIsSearchingForTeam'],
        component: <OnboardingPlayerStep1 />,
      },
    ]

    const organizerSteps: Step[] = [
      {
        title: 'Tu organización',
        fields: [
          'organizationName',
          'organizationSlug',
          'organizationDescription',
          'organizationCountry',
          'organizationState',
          'organizationCity',
        ],
        component: <OnboardingOrganizerFormStep1 />,
      },
    ]

    if (role === 'player') {
      resetField('organizationName')
      resetField('organizationSlug')
      resetField('organizationDescription')
      resetField('organizationCountry')
      resetField('organizationState')
      resetField('organizationCity')
    }

    if (role === 'organizer') {
      resetField('playerPhone')
      resetField('playerPhoneCode')
      resetField('playerIsSearchingForTeam')
    }

    return [...commonSteps, ...(role === 'player' ? playerSteps : organizerSteps)]
  }, [role, resetField])

  const currentStep = steps[step]
  const isLastStep = step === steps.length - 1

  const nextStep = async () => {
    const isValid = await trigger(currentStep.fields)

    if (!isValid) return

    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    if (step === 0) return

    setStep((prev) => prev - 1)
  }

  const onSubmit: SubmitHandler<OnboardingForm> = async (data) => {
    setSaving(true)

    const cleanData = { ...data }

    if (cleanData.role === 'player') {
      delete cleanData.organizationName
      delete cleanData.organizationSlug
      delete cleanData.organizationDescription
      delete cleanData.organizationCountry
      delete cleanData.organizationState
      delete cleanData.organizationCity
    }

    if (cleanData.role === 'organizer') {
      delete cleanData.playerPhone
      delete cleanData.playerPhoneCode
      delete cleanData.playerIsSearchingForTeam

      try {
        const request = await fetch(PORT + '/v1/onboarding/organizer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: {
              username: cleanData.username,
              city: cleanData.city,
              country_code: cleanData.country,
            },
            organization: {
              name: cleanData.organizationName,
              slug: cleanData.organizationSlug,
              description: cleanData.organizationDescription,
              city: cleanData.organizationCity,
              country_code: cleanData.organizationCountry,
            },
            plan: 'free',
          }),
          credentials: 'include',
        })

        if (request.status === 200) {
          const requestMe = await fetch(`${PORT}/v1/me`, {
            credentials: 'include',
          })

          if (requestMe.ok) {
            const responseMe = await request.json()

            if (!responseMe.data.onboarding_pending) {
              setUser(responseMe.data, 'authenticated')
            } else {
              setUser(responseMe.data, 'onboarding')
            }
          } else {
            setUser(null, 'authenticated')
          }

          setAnnouncement({
            isActivated: true,
            announceType: 'ok',
            message: 'Datos guardados correctamente',
          })
          setSaving(false)
        } else {
          setAnnouncement({
            isActivated: true,
            announceType: 'error',
            message: 'Ocurrió un error al guardar los datos, intente nuevamente más tarde',
          })
          setSaving(false)
        }
      } catch {
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message: 'Ocurrió un error al guardar los datos, intente nuevamente más tarde',
        })
        setSaving(false)
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <SectionContainer>
        <motion.div
          className="flex flex-col w-full h-dvh"
          animate={{
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: 'easeInOut',
            },
          }}
        >
          <div className="z-10 w-full py-6 border-b h-fit border-line">
            <div className="w-24 m-auto mb-4">
              <FourSportsIcon />
            </div>

            <h1 className="mb-2 text-5xl text-center font-bebas text-ink">
              Completar <span className="text-primary">registro</span>
            </h1>

            {/* TITLE */}
            <h2 className="mb-2 text-2xl font-bold text-center shrink-0 text-ink">
              {currentStep.title}
            </h2>

            {/* DESCRIPTION */}
            <h3 className="mb-2 text-lg text-center shrink-0 text-muted">
              {currentStep.description}
            </h3>

            {/* BUTTONS */}
            <div className="flex items-center justify-center w-full gap-6 mt-4 h-fit shrink-0">
              <DinamicButton
                action={prevStep}
                disabled={step === 0}
                disabledSpinner={false}
                label=""
                spinFromText={false}
                icon={<ChevronLeft className="size-4" />}
                twClassName="w-fit h-fit p-2 rounded-full"
                type={step === 0 ? 'disabled' : 'filled'}
              />

              {/* DOTS */}
              <div className="flex items-center justify-center gap-3">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={async () => {
                      const isValid = await trigger(currentStep.fields)
                      if (!isValid) return
                      setStep(index)
                    }}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      index === step ? 'bg-primary scale-150' : 'bg-faint'
                    }`}
                  />
                ))}
              </div>

              {!isLastStep ? (
                <DinamicButton
                  action={nextStep}
                  disabled={false}
                  disabledSpinner={false}
                  label=""
                  spinFromText={false}
                  icon={<ChevronRight className="size-4" />}
                  twClassName="w-fit h-fit p-2 rounded-full"
                  type="filled"
                />
              ) : (
                <DinamicButton
                  action={handleSubmit(onSubmit)}
                  disabled={saving}
                  disabledSpinner={true}
                  label=""
                  spinFromText={false}
                  icon={<Check className="size-4" />}
                  twClassName="w-fit h-fit p-2 rounded-full"
                  type={saving ? 'disabled' : 'filled'}
                />
              )}
            </div>
          </div>

          {/* ANIMATED CONTENT */}
          <div className="relative overflow-x-hidden overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  x: 40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -40,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="flex items-center w-full m-auto min-h-fit"
              >
                {currentStep.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </SectionContainer>
    </FormProvider>
  )
}
