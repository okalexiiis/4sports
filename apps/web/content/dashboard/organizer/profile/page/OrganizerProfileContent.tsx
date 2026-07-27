'use client'

/* COMPONENTS */
import { SectionContainer } from '@/content/shared/ui/sectionContainer/SectionContainer'
import Image from 'next/image'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { ModalBodyUpdateProfilePhotoForm } from './components/modalBodyUpdateProfilePhoto/ModalBodyUpdateProfilePhotoForm'
import { ModalBodyUpdateNameForm } from './components/modalBodyUpdateName/ModalBodyUpdateNameForm'
import { ModalBodyUpdatePasswordForm } from './components/modalBodyUpdatePassword/ModalBodyUpdatePasswordForm'
import { ModalBodyUpdateCityForm } from './components/modalBodyUpdateCity/ModalBodyUpdateCityForm'

/* HOOKS */
import { useState } from 'react'

/* ICONS */
import { Box, Mail, MapPin, SlidersHorizontal, SquarePen, UserRound } from 'lucide-react'

/* IMAGES */
import banner from './images/banner.jpg'

/* LIBS */
import { AnimatePresence, motion } from 'framer-motion'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export function OrganizerProfileContent() {
  const data = useAuthStore((s) => s.data)
  const { setModal } = useModal()

  const [open, setOpen] = useState(false)

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

            <div className="absolute bottom-0 flex items-center justify-center w-48 h-48 translate-y-1/2 border-8 rounded-full min-w-48 min-h-48 left-6 bg-background border-background">
              {data && data.profile?.avatar_url ? (
                <Image
                  alt="Banner"
                  src={data.profile.avatar_url}
                  quality={70}
                  fill
                  className="object-cover object-center rounded-full"
                />
              ) : (
                <UserRound className="size-4" />
              )}

              <div className="absolute flex items-center justify-center rounded-full bottom-1 right-1 w-14 h-14 bg-primary text-primary-text border-6 border-background">
                <DinamicButton
                  action={() =>
                    setModal({
                      isActivated: true,
                      title: 'Cambiar foto',
                      body: <ModalBodyUpdateProfilePhotoForm />,
                    })
                  }
                  type="filled"
                  icon={<SquarePen className="size-5 min-w-5 min-h-5" />}
                  twClassName="w-full h-full p-0 rounded-full"
                />
              </div>
            </div>

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
                              title: 'Cambiar nombre',
                              body: <ModalBodyUpdateNameForm />,
                            })
                          }
                          className="p-2 mb-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl hover:bg-surface"
                        >
                          Cambiar nombre
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          onClick={() =>
                            setModal({
                              isActivated: true,
                              title: 'Cambiar ciudad',
                              body: <ModalBodyUpdateCityForm />,
                            })
                          }
                          className="p-2 mb-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl hover:bg-surface"
                        >
                          Cambiar ciudad
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          onClick={() =>
                            setModal({
                              isActivated: true,
                              title: 'Cambiar contraseña',
                              body: <ModalBodyUpdatePasswordForm />,
                            })
                          }
                          className="p-2 mb-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl hover:bg-surface"
                        >
                          Cambiar contraseña
                        </DropdownMenu.Item>
                      </motion.div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                )}
              </AnimatePresence>
            </DropdownMenu.Root>

            <div className="flex flex-col gap-1 absolute bottom-0 left-60 translate-y-[calc(100%+1.5rem)]">
              <h2 className="text-3xl font-bold text-ink">{data?.user?.name ?? '...'}</h2>
              <h3 className="text-sm font-semibold text-primary">Organizador</h3>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-6">
            <div className="flex flex-col gap-6 p-6 text-sm bg-surface rounded-xl">
              <p className="text-lg font-semibold">Información básica</p>

              <div className="grid grid-cols-2 text-muted">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <UserRound className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Nombre completo</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Box className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Tipo de usuario</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <p>{data?.user?.name ?? '...'}</p>
                  <p>Organizador</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 p-6 text-sm bg-surface rounded-xl">
              <p className="text-lg font-semibold">Información de contacto</p>

              <div className="grid grid-cols-2 text-muted">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Ciudad</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Correo</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <p>{data?.profile?.city ?? '...'}</p>
                  <p>{data?.user?.email ?? '...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
