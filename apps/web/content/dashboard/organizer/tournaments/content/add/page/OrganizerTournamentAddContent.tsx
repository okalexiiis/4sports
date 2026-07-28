'use client'

/* CLASSES */
import { ClsUploadImage, FinalMessage } from '@/content/shared/classes/uploadImage/ClsUploadImage'

/* COMPONENTS */
import { TournamentAddStep1 } from './components/tournamentAddStep1/TournamentAddStep1'
import { TournamentAddStep2 } from './components/tournamentAddStep2/TournamentAddStep2'
import { TournamentAddStep3RoundRobin } from './components/tournamentAddStep3/TournamentAddStep3RoundRobin'
import { TournamentAddStep3DirectElimination } from './components/tournamentAddStep3/TournamentAddStep3DirectElimination'
import { TournamentAddStep4 } from './components/tournamentAddStep4/TournamentAddStep4'
import { TournamentAddStep5 } from './components/tournamentAddStep5/TournamentAddStep5'
import { TournamentAddStep6 } from './components/tournamentAddStep6/TournamentAddStep6'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { SectionContainer } from '@/content/shared/ui/sectionContainer/SectionContainer'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'

/* ICONS */
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

/* LIBS */
import { AnimatePresence, motion } from 'framer-motion'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useOrganizationStore } from '@/content/dashboard/organizer/organizations/page/stores/organizationStore/organizationStore'

/* TYPES */
import { TournamentAddFormType } from './types/tournamentAddFormType'
import { CheckboxOption } from '@/content/shared/form/dinamicCheckboxOptions/types/dinamicCheckboxOptionsProps'
import { Sport } from '../../../../../../../../api/src/modules/sports/sports.entity'
import { TournamentFormat } from '../../../../../../../../api/src/modules/tournament-formats/tournament-format.entity'

type Step = {
  title: string
  description?: string
  fields: (keyof TournamentAddFormType)[]
  component: React.ReactNode
}

export function OrganizerTournamentAddContent() {
  const router = useRouter()

  const { setAnnouncement } = useAnnouncement()
  const organization = useOrganizationStore((s) => s.organization)

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [sports, setSports] = useState<CheckboxOption[] | null>(null)
  const [formats, setFormats] = useState<TournamentFormat[] | null>(null)

  const methods = useForm<TournamentAddFormType>({
    mode: 'onTouched',
    shouldUnregister: false,
    defaultValues: {
      /* STEP 1 */
      name: '',
      description: '',
      sport_id: '',
      tags: [],
      registrationInterval: undefined,
      gameInterval: undefined,

      /* STEP 2 */
      format_id: 'single_elimination',

      /* STEP 4 */
      is_public: true,

      /* STEP 5 */
      sexVR: { visible: false, required: false },
      birthdayVR: { visible: false, required: false },
      emailVR: { visible: false, required: false },
      telphoneVR: { visible: false, required: false },
      jerseyVR: { visible: false, required: false },
    },
  })

  const { trigger, handleSubmit, resetField } = methods

  const format_id = useWatch({
    control: methods.control,
    name: 'format_id',
  })

  const file = useWatch({
    control: methods.control,
    name: 'banner_url',
  }) as File | undefined

  const preview = useMemo(() => {
    if (!file) return null

    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  useEffect(() => {
    try {
      const fetchSports = async () => {
        const request = await fetch(PORT + '/v1/sports', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })

        if (request.status === 200) {
          const response: { data: Sport[] } = await request.json()
          setSports(
            response.data.map((s) => {
              return {
                label: s.name,
                value: s.id,
              }
            }),
          )
          console.log(response)
        } else {
          setSports([])
        }
      }

      const fetchFormats = async () => {
        const request = await fetch(PORT + '/v1/tournament-formats', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })

        if (request.status === 200) {
          const response: { data: TournamentFormat[] } = await request.json()
          setFormats(response.data)
          console.log(response)
        } else {
          setFormats([])
        }
      }

      fetchSports()
      fetchFormats()
    } catch {
      const err = () => {
        setSports([])
        setFormats([])
      }

      err()
    }
  }, [])

  const steps: Step[] = useMemo(() => {
    const commonSteps: Step[] = [
      {
        title: 'Paso 1 de 3',
        description: 'Información básica',
        fields: ['name', 'description', 'sport_id', 'tags', 'registrationInterval', 'gameInterval'],
        component: <TournamentAddStep1 preview={preview} sports={sports} />,
      },
      /* {
        title: 'Paso 2 de 4',
        description: 'Formato de competición',
        fields: ['format_id'],
        component: <TournamentAddStep2 />,
      }, */
    ]

    /* const roundRobinSteps: Step[] = [
      {
        title: 'Paso 3 de 6',
        description: 'Todos contra todos',
        fields: ['teamsQuantityRoundRobin', 'laps'],
        component: <TournamentAddStep3RoundRobin />,
      },
    ] */

    /* const singleEliminationSteps: Step[] = [
      {
        title: 'Paso 3 de 4',
        description: 'Eliminación directa',
        fields: ['teamsQuantityDirectElimination', 'thirdPlaceMatch', 'bestOfX'],
        component: <TournamentAddStep3DirectElimination />,
      },
    ] */

    const finalSteps: Step[] = [
      {
        title: 'Paso 2 de 3',
        description: 'Reglas de elegibilidad',
        fields: [
          'validation_mode',
          'eligibility_mode',
          'gender_restriction',
          'is_public',
          'total_players_team',
          'total_teams',
        ],
        component: <TournamentAddStep4 />,
      },
      /* {
        title: 'Paso 5 de 6',
        description: 'Campos de jugadores',
        fields: ['sexVR', 'birthdayVR', 'emailVR', 'telphoneVR', 'jerseyVR'],
        component: <TournamentAddStep5 />,
      }, */
      {
        title: 'Paso 3 de 3',
        description: 'Vista final y Confirmar',
        fields: [],
        component: <TournamentAddStep6 preview={preview} sports={sports} />,
      },
    ]

    if (format_id === 'round_robin') {
      resetField('teamsQuantityDirectElimination')
      resetField('thirdPlaceMatch')
      resetField('bestOfX')
    }

    if (format_id === 'single_elimination') {
      resetField('teamsQuantityRoundRobin')
      resetField('laps')
    }

    return [
      ...commonSteps,
      /* ...(format_id === 'round_robin' ? roundRobinSteps : singleEliminationSteps), */
      ...finalSteps,
    ]
  }, [format_id, resetField, preview, sports])

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

  const toApiDate = (date?: Date) => date?.toISOString().replace(/\.\d{3}Z$/, 'Z')

  const onSubmit: SubmitHandler<TournamentAddFormType> = async (data) => {
    setSaving(true)

    const cleanData = { ...data }

    if (cleanData.format_id === 'round_robin') {
      delete cleanData.teamsQuantityDirectElimination
      delete cleanData.thirdPlaceMatch
      delete cleanData.bestOfX
    }

    if (cleanData.format_id === 'single_elimination') {
      delete cleanData.teamsQuantityRoundRobin
      delete cleanData.laps
    }

    let format_id: string = 'd5fb8bdf-3360-479a-bfb2-cf814dc484ee'

    if (formats !== null) {
      const format = formats.find((f) => f.slug === cleanData.format_id)

      if (format) format_id = format.id
    }

    let uploadImageRequest: FinalMessage

    if (cleanData.banner_url) {
      uploadImageRequest = await ClsUploadImage.upload(cleanData.banner_url, 'banner')

      if (uploadImageRequest.status === 200) {
        try {
          const request = await fetch(
            PORT + `/v1/organizations/${organization?.id ?? 'error'}/tournaments`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: cleanData.name,
                slug: cleanData.name,
                description: cleanData.description,
                banner_url: uploadImageRequest.upload_url,
                sport_id: cleanData.sport_id,
                format_id: format_id,
                tags: cleanData.tags,
                max_teams: cleanData.total_teams.max,
                min_teams: cleanData.total_teams.min,
                min_players_per_team: cleanData.total_players_team.min,
                max_players_per_team: cleanData.total_players_team.max,
                is_public: cleanData.is_public,
                requires_approval: false,
                gender_restriction: cleanData.gender_restriction,
                validation_mode: cleanData.validation_mode,
                eligibility_mode: cleanData.eligibility_mode,
                starts_at: toApiDate(cleanData.gameInterval.from),
                ends_at: toApiDate(cleanData.gameInterval.to),
                registration_opens_at: toApiDate(cleanData.registrationInterval.from),
                registration_closes_at: toApiDate(cleanData.registrationInterval.to),
              }),
              credentials: 'include',
            },
          )

          if (request.status === 201) {
            const response = await request.json()
            console.log(response)
            setAnnouncement({
              isActivated: true,
              announceType: 'ok',
              message: 'Torneo creado correctamente, redirigiendo...',
            })
            setSaving(false)
            router.push("/organizer/tournaments/" + response.data.id)
          } else if (request.status === 403) {
            setAnnouncement({
              isActivated: true,
              announceType: 'error',
              message: 'Has alcanzado la cantidad máxima de torneos, por favor actualize tu plan',
            })
            setSaving(false)
          } else {
            setAnnouncement({
              isActivated: true,
              announceType: 'error',
              message: 'Ocurrió un error al guardar el torneo, revise la información e intente nuevamente más tarde',
            })
            setSaving(false)
          }
        } catch {
          setAnnouncement({
            isActivated: true,
            announceType: 'error',
            message: 'Ocurrió un error al guardar el torneo, intente nuevamente más tarde',
          })
          setSaving(false)
        }
      } else {
        setAnnouncement({
          isActivated: true,
          announceType: 'error',
          message: 'Ocurrió un error al guardar la imagen, intente nuevamente más tarde',
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
            <h1 className="mb-2 text-5xl text-center font-bebas text-ink">
              Nuevo <span className="text-primary">torneo</span>
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
