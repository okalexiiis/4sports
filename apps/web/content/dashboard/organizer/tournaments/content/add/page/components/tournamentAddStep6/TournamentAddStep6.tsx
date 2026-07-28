'use client'

/* COMPONENTS */
import Image from 'next/image'
import { SpecificInputFileImage } from '../specificInputFileImage/SpecificInputFileImage'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* HOOKS */
import { useFormContext, useWatch } from 'react-hook-form'

/* ICONS */
import {
  CalendarDays,
  CircleQuestionMark,
  ClockAlert,
  Download,
  Grid2x2,
  LoaderPinwheel,
  MapPin,
  Mars,
  Merge,
  UserRound,
  Venus,
  VenusAndMars,
  X,
  Image as Photo,
} from 'lucide-react'

/* IMAGES */
import banner1 from '../../images/banner1.jpg'
import banner2 from '../../images/banner2.jpg'
import banner3 from '../../images/banner3.jpg'
import banner4 from '../../images/banner4.jpg'
import banner5 from '../../images/banner5.jpg'
import organization1 from '../../images/organization1.png'

/* LIBS */
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

/* STORES */
import { useOrganizationStore } from '@/content/dashboard/organizer/organizations/page/stores/organizationStore/organizationStore'

/* TYPES */
import { TournamentAddFormType } from '../../types/tournamentAddFormType'
import { DateRange } from 'react-day-picker'
import { CheckboxOption } from '@/content/shared/form/dinamicCheckboxOptions/types/dinamicCheckboxOptionsProps'

export function TournamentAddStep6({
  preview,
  sports,
}: {
  preview: string | null
  sports: CheckboxOption[] | null
}) {
  const { control } = useFormContext()

  const organization = useOrganizationStore((s) => s.organization)

  const name = useWatch({
    control: control,
    name: 'name',
  })

  const format_id = useWatch({
    control: control,
    name: 'format_id',
  })

  const sport_id = useWatch({
    control: control,
    name: 'sport_id',
  })

  const description = useWatch({
    control: control,
    name: 'description',
  })

  const registrationInterval: DateRange | undefined = useWatch({
    control: control,
    name: 'registrationInterval',
  })

  const gameInterval: DateRange | undefined = useWatch({
    control: control,
    name: 'gameInterval',
  })

  const gender_restriction = useWatch({
    control: control,
    name: 'gender_restriction',
  })

  const tags: string[] | undefined = useWatch({
    control: control,
    name: 'tags',
  })

  const getActualSport = () => {
    if (sports === null) return null

    const sport = sports.find((s) => s.value === sport_id)
    return sport
  }

  return (
    <div className="flex flex-col w-full gap-6 p-6 h-fit">
      <div className="relative w-full h-54 rounded-xl bg-surface mb-22">
        {getActualSport() !== null && getActualSport() !== undefined && (
          <Image
            alt="Banner"
            src={
              getActualSport()?.label === 'Fútbol'
                ? banner1
                : getActualSport()?.label === 'Básquetbol'
                  ? banner2
                  : getActualSport()?.label === 'Béisbol'
                    ? banner5
                    : getActualSport()?.label === 'Voleibol'
                      ? banner4
                      : banner3
            }
            quality={70}
            fill
            loading="eager"
            className="object-cover object-center rounded-xl"
          />
        )}

        <div className="absolute bottom-0 w-48 h-48 translate-y-1/2 rounded-full min-w-48 min-h-48 left-6 border-background">
          {/* FOTO */}
          <SpecificInputFileImage<TournamentAddFormType>
            name="banner_url"
            preview={preview}
            rules={{
              validate: (file) => {
                if (!(file instanceof File)) return true

                if (file.size > 5_000_000) {
                  return 'El archivo debe pesar menos de 5MB'
                }

                return true
              },
            }}
            twClassNameContainer={`border-8 border-background ${preview === null ? 'bg-surface' : 'bg-background'}`}
            twClassNameButton="border-6"
          />
        </div>

        <div className="flex flex-col gap-1 absolute bottom-0 left-60 translate-y-[calc(100%+1.5rem)]">
          <h2 className="text-3xl font-bold text-ink">
            {name !== undefined && name !== '' ? name : 'Nombre Vacío'}
          </h2>

          <div className="flex items-center gap-2">
            {format_id === 'single_elimination' ? (
              <Merge className="size-4 min-w-4 min-h-4" />
            ) : (
              <Grid2x2 className="size-4 min-w-4 min-h-4" />
            )}

            <h3 className="text-sm font-semibold text-primary">
              {format_id !== undefined
                ? format_id === 'round_robin'
                  ? 'Todos contra todos'
                  : format_id === 'single_elimination'
                    ? 'Eliminación directa'
                    : 'Tipo Vacío'
                : 'Tipo Vacío'}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-rows-2 gap-6 rounded-xl">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center gap-2 p-6 bg-surface rounded-xl">
            <div className="flex items-center justify-center gap-2">
              {gender_restriction !== undefined && gender_restriction !== '' ? (
                gender_restriction === 'male' ? (
                  <Mars className="size-4 min-w-4 min-h-4 text-ink" />
                ) : gender_restriction === 'female' ? (
                  <Venus className="size-4 min-w-4 min-h-4 text-ink" />
                ) : gender_restriction === 'mixed' ? (
                  <VenusAndMars className="size-4 min-w-4 min-h-4 text-ink" />
                ) : (
                  <X className="size-4 min-w-4 min-h-4 text-ink" />
                )
              ) : (
                <CircleQuestionMark className="size-4 min-w-4 min-h-4 text-ink" />
              )}
              <p>Tipo</p>
            </div>
            <p className="text-sm text-muted">
              {gender_restriction !== undefined && gender_restriction !== ''
                ? gender_restriction === 'male'
                  ? 'Masculino'
                  : gender_restriction === 'female'
                    ? 'Femenino'
                    : gender_restriction === 'mixed'
                      ? 'Mixto'
                      : 'Sin tipo'
                : 'Sin tipo'}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 p-6 bg-surface rounded-xl">
            <div className="flex items-center justify-center gap-2">
              <LoaderPinwheel className="size-4 min-w-4 min-h-4 text-ink" />
              <p>Deporte</p>
            </div>
            <p className="text-sm text-muted">{getActualSport()?.label ?? '...'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center gap-2 p-6 bg-surface rounded-xl">
            <div className="flex items-center justify-center gap-2">
              <ClockAlert className="size-4 min-w-4 min-h-4 text-ink" />
              <p>Inscripciones</p>
            </div>
            <p className="text-sm text-muted">
              {registrationInterval === undefined
                ? 'Fechas no establecidas'
                : renderValue(registrationInterval) === null
                  ? 'Fechas vacías'
                  : renderValue(registrationInterval)}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 p-6 bg-surface rounded-xl">
            <div className="flex items-center justify-center gap-2">
              <CalendarDays className="size-4 min-w-4 min-h-4 text-ink" />
              <p>Duración</p>
            </div>
            <p className="text-sm text-muted">
              {gameInterval === undefined
                ? 'Fechas no establecidas'
                : renderValue(gameInterval) === null
                  ? 'Fechas vacías'
                  : renderValue(gameInterval)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-6">
        <div className="flex flex-col w-full gap-2 p-10 bg-surface rounded-xl">
          <p className="text-lg font-semibold">Descripción</p>
          <p className="text-muted">
            {description !== undefined && description !== '' ? description : 'Sin descripción'}
          </p>
        </div>

        <div className="flex flex-col w-full gap-6 p-10 bg-surface rounded-xl min-w-1/3">
          <p className="text-lg font-semibold">Organización</p>

          <div className="flex gap-6">
            {organization?.logo_url && organization.logo_url !== '' ? (
              <div className='relative w-24 h-24 rounded-full min-h-24 min-w-24'>
                <Image
                alt="Organización"
                src={organization.logo_url}
                quality={70}
                loading="lazy"
                fill
                className="object-cover object-center rounded-full"
              />
              </div>
            ) : (
              <div className="flex items-center justify-center w-24 h-24 rounded-full min-h-24 min-w-24 bg-surface-hover">
                <Photo className="size-6 min-w-6 min-h-6" />
              </div>
            )}

            <div className="min-w-0">
              <p className="mb-1 text-lg font-bold text-ink">{organization?.name ?? '...'}</p>
              <p className="mb-4 text-sm line-clamp-2">{organization?.description ?? '...'}</p>
              <DinamicButton
                action={() => {}}
                type="filled"
                label="Ver más"
                twClassName="w-fit text-sm py-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-6 p-10 bg-surface rounded-xl">
        <p className="text-lg font-semibold">Equipos</p>
        <p className="text-muted">El torneo no cuenta con equipos</p>
      </div>

      <div className="flex flex-col w-full gap-6 p-10 bg-surface rounded-xl">
        <p className="text-lg font-semibold">Hashtags</p>
        <div className="flex flex-wrap gap-6">
          {tags === undefined ? (
            <p>Hashtags vacío</p>
          ) : tags.length === 0 ? (
            <p>No se encontraron hashtags</p>
          ) : (
            tags.map((t, i) => <p key={i}>#{t}</p>)
          )}
        </div>
      </div>
    </div>
  )
}

const renderValue = (value: DateRange) => {
  const range = value as DateRange

  if (range?.from && range?.to) {
    return `${format(range.from, 'PPP', { locale: es })} al ${format(range.to, 'PPP', {
      locale: es,
    })}`
  }

  if (range?.from) {
    return format(range.from, 'PPP', { locale: es })
  }

  return null
}
