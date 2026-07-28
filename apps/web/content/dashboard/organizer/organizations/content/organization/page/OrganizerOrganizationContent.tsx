'use client'

/* COMPONENTS */
import { SectionContainer } from '@/content/shared/ui/sectionContainer/SectionContainer'
import Image from 'next/image'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { ModalBodyUpdateOrganizationPhotoForm } from './components/modalBodyUpdateOrganizationPhoto/ModalBodyUpdateOrganizationPhotoForm'
import { ModalBodyUpdateOrganizationInfoForm } from './components/modalBodyUpdateOrganizationInfo/ModalBodyUpdateOrganizationInfoForm'
import { TournamentCard } from '@/content/dashboard/organizer/tournaments/page/components/tournamentCard/TournamentCard'

/*  CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* HOOKS */
import { useState, useEffect } from 'react'

/* ICONS */
import { MapPin, SlidersHorizontal, SquarePen, Image as Photo, Globe } from 'lucide-react'

/* IMAGES */
import banner from '../../../../profile/page/images/banner.jpg'
import banner2 from './images/banner2.jpg'
import banner3 from './images/banner3.jpg'
import tournament1 from './images/tournament1.png'
import tournament2 from './images/tournament2.png'
import tournament3 from './images/tournament3.png'
import team1 from './images/team1.jpg'
import team2 from './images/team2.jpg'
import team3 from './images/team3.jpg'
import team4 from './images/team4.jpg'

/* LIBS */
import { AnimatePresence, motion } from 'framer-motion'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useOrganizationStore } from '@/content/dashboard/organizer/organizations/page/stores/organizationStore/organizationStore'

/* TYPES */
import { TournamentCardType } from '@/content/dashboard/organizer/tournaments/page/components/tournamentCard/types/TournamentCardType'

/* UTILS */
import { getRole } from '../../../page/utils/getRole'

const tournaments: TournamentCardType[] = [
  {
    slug: 'torneo-verano-ii',
    name: 'Torneo Verano II',
    description: 'Pre Elecciones de Verano II',
    image: tournament1,
    state: 'Inscribiendo',
    sex: 'Femenino',
    sport: 'Básquetbol',
    teams: [{ image: team1 }, { image: team2 }, { image: team3 }, { image: team4 }],
    teamsQuantity: 20,
    type: 'Eliminatoria directa',
    banner: banner3,
    location: 'Nogales, Sonora. México',
  },
  {
    slug: 'casa-de-plata',
    name: 'Casa de Plata',
    description: 'Reuniendo los mejores equipos 2026',
    image: tournament2,
    state: 'Jugando',
    sex: 'Femenino',
    sport: 'Básquetbol',
    teams: [{ image: team1 }, { image: team2 }, { image: team3 }, { image: team4 }],
    teamsQuantity: 9,
    type: 'Todos contra todos',
    banner: banner2,
    location: 'Nogales, Sonora. México',
  },
  {
    slug: 'tronos',
    name: 'Tronos',
    description: 'Práctica de equipos Nogalenses',
    image: tournament3,
    state: 'Finalizado',
    sex: 'Femenino',
    sport: 'Básquetbol',
    teams: [{ image: team1 }, { image: team2 }, { image: team3 }],
    teamsQuantity: 3,
    type: 'Eliminatoria directa',
    banner: banner3,
    location: 'Nogales, Sonora. México',
  },
]

export function OrganizerOrganizationContent({ id }: { id: string }) {
  const router = useRouter()

  const { setModal } = useModal()
  const organization = useOrganizationStore((s) => s.organization)
  const status = useOrganizationStore((s) => s.status)

  const [open, setOpen] = useState(false)

  if (status === 'empty') {
    return (
      <SectionContainer>
        <div className="flex flex-col gap-6 p-6">
          <div className="relative w-full h-54 rounded-xl bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient mb-22">
            <div className="absolute bottom-0 w-48 h-48 translate-y-1/2 border-8 rounded-full min-w-48 min-h-48 left-6 bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient border-background">
              <div className="absolute flex items-center justify-center rounded-full bottom-1 right-1 w-14 h-14 bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient text-primary-text border-6 border-background"></div>
            </div>

            <div className="w-fit text-sm py-1 absolute bottom-0 right-0 translate-y-[calc(100%+1.5rem)] h-fit rounded-lg flex gap-2 items-center bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient px-4">
              <SlidersHorizontal className="text-transparent size-4 min-w-4 min-h-4" />
              <span className="text-transparent">Acciones</span>
            </div>

            <div className="flex flex-col gap-1 absolute bottom-0 left-60 translate-y-[calc(100%+1.5rem)] w-fit h-fit">
              <div className="h-12 rounded-lg bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient w-60"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 p-6 bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient rounded-xl">
              <p className="text-lg font-semibold text-transparent">Descripción</p>
              <p className="text-transparent">Texto</p>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient rounded-xl">
              <p className="text-lg font-semibold text-transparent">Ciudad</p>
              <div className="flex items-center gap-2">
                <MapPin className="text-transparent size-4 min-w-4 min-h-4" />
                <p className="text-transparent">Lugar</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient rounded-xl">
              <p className="text-lg font-semibold text-transparent">Sitio web</p>
              <div className="flex items-center gap-2">
                <Globe className="text-transparent size-4 min-w-4 min-h-4" />
                <p className="text-transparent">Sitio</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient rounded-xl">
            <p className="text-lg font-semibold text-transparent">Torneos populares</p>

            <div className="grid h-64 grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  className={`w-full py-6 rounded-xl bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient`}
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    )
  }

  if (status === 'error') {
    return (
      <SectionContainer>
        <div className="flex flex-col items-center justify-center w-full min-h-full gap-4">
          <p>
            A ocurrido un error al cargar la organización, porfavor intente nuevamente más tarde
          </p>

          <DinamicButton
            action={() => router.push('/organizer/organizations')}
            twClassName="w-fit"
            type="filled"
            label="Volver a organizaciones"
          />
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer>
      <div className="flex flex-col p-6">
        <div className="flex flex-col gap-6">
          <div className="relative w-full h-54 rounded-xl bg-surface mb-22">
            <Image
              alt="Banner"
              src={banner}
              quality={70}
              fill
              loading="eager"
              className="object-cover object-center rounded-xl"
            />

            <div className="absolute bottom-0 w-48 h-48 translate-y-1/2 border-8 rounded-full min-w-48 min-h-48 max-w-48 max-h-48 left-6 bg-background border-background">
              {organization?.logo_url ? (
                <Image
                  alt="Foto de organización"
                  src={organization.logo_url}
                  quality={70}
                  fill
                  className="object-cover object-center rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full rounded-full bg-surface">
                  <Photo className="size-16 min-h-16 min-w-16" />
                </div>
              )}

              {organization !== null && organization.role === "owner" && (
                <div className="absolute flex items-center justify-center rounded-full bottom-1 right-1 w-14 h-14 bg-primary text-primary-text border-6 border-background">
                  <DinamicButton
                    action={() =>
                      setModal({
                        isActivated: true,
                        title: 'Cambiar foto',
                        body: <ModalBodyUpdateOrganizationPhotoForm id={id} />,
                      })
                    }
                    type="filled"
                    icon={<SquarePen className="size-5 min-w-5 min-h-5" />}
                    twClassName="w-full h-full p-0 rounded-full"
                  />
                </div>
              )}
            </div>

            {organization?.role === 'owner' && (
              <DropdownMenu.Root open={open} onOpenChange={setOpen}>
                <DropdownMenu.Trigger asChild>
                  <button className="w-fit h-fit flex items-center justify-center gap-2 text-sm py-1 absolute bottom-0 right-0 translate-y-[calc(100%+1.5rem)] bg-primary border-transparent border-2 text-primary-text font-semibold px-4 rounded-lg cursor-pointer hover:bg-primary-hover">
                    <SlidersHorizontal className="size-4 min-w-4 min-h-4" />
                    Acciones
                  </button>
                </DropdownMenu.Trigger>

                <AnimatePresence>
                  {open && (
                    <DropdownMenu.Portal forceMount>
                      <DropdownMenu.Content
                        sideOffset={24}
                        align="end"
                        avoidCollisions
                        side={'bottom'}
                        asChild
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: -12 }}
                          exit={{ opacity: 0, scale: 0.95, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="p-2 border shadow-md z-100 min-w-56 rounded-2xl border-line bg-background"
                        >
                          <DropdownMenu.Item
                            onClick={() =>
                              setModal({
                                isActivated: true,
                                title: 'Actualizar organización',
                                body: <ModalBodyUpdateOrganizationInfoForm id={id} />,
                              })
                            }
                            className="p-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl hover:bg-surface"
                          >
                            Actualizar organización
                          </DropdownMenu.Item>
                        </motion.div>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  )}
                </AnimatePresence>
              </DropdownMenu.Root>
            )}

            <div className="flex flex-col gap-1 absolute bottom-0 left-60 translate-y-[calc(100%+1.5rem)]">
              <h2 className="text-3xl font-bold text-ink">{organization?.name ?? '...'}</h2>
              <h3 className="text-sm font-semibold text-primary">
                {getRole(organization?.role ?? '...')}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 p-6 bg-surface rounded-xl">
              <p className="text-lg font-semibold">Descripción</p>
              <p className="text-muted">{organization?.description ?? '...'}</p>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-surface rounded-xl">
              <p className="text-lg font-semibold">Ciudad</p>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 min-w-4 min-h-4 text-ink" />
                <p className="text-muted">{organization?.city ?? '...'}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-surface rounded-xl">
              <p className="text-lg font-semibold">Sitio web</p>
              <div className="flex items-center gap-2">
                <Globe className="size-4 min-w-4 min-h-4 text-ink" />
                <p className="text-muted">
                  {organization?.website_url !== ''
                    ? (organization?.website_url ?? 'Sin sitio web')
                    : 'Sin sitio web'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 bg-surface rounded-xl">
            <p className="text-lg font-semibold">Torneos populares</p>

            <div className="grid grid-cols-3 gap-6">
              {tournaments.map((t) => (
                <TournamentCard
                  key={t.slug}
                  slug={t.slug}
                  name={t.name}
                  description={t.description}
                  image={t.image}
                  state={t.state}
                  sex={t.sex}
                  sport={t.sport}
                  teams={t.teams}
                  teamsQuantity={t.teamsQuantity}
                  type={t.type}
                  banner={t.banner}
                  location={t.location}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
