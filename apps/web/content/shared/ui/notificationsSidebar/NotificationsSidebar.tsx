'use client'

/* COMPONENTS */
import Image from 'next/image'
import { DinamicButton } from '../../form/dinamicButton/DinamicButton'
import { ModalBodyAcceptRejectInvitation } from './components/modalBodyAcceptRejectInvitation/ModalBodyAcceptRejectInvitation'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* ICONS */
import { ChevronsRight, RotateCw, Image as Photo } from 'lucide-react'

/* HOOKS */
import { useState, useEffect } from 'react'

/* STORES */
import { useNotificationsSidebarStore } from './stores/notificationsSidebarStore'
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'

/* UTILS */
import { getRole } from '@/content/dashboard/organizer/organizations/page/utils/getRole'

type OrganizationInvitation = {
  id: string
  organization: {
    id: string
    name: string
    slug: string
    logo_url: string
  }
  role: string
  invited_at: Date
  expires_at: Date
  invited_by_name: string
}

export function NotificationsSidebar() {
  const {
    toggleNotificationsSidebar,
    expanded,
    setTrigger,
    trigger = { total: 0 },
  } = useNotificationsSidebarStore()
  const { setModal } = useModal()

  const [loading, setLoading] = useState(true)
  const [invitations, setInvitations] = useState<{
    data: OrganizationInvitation[] | null
    count: number
  } | null>(null)

  useEffect(() => {
    if (!trigger) return

    try {
      const fetchInvitations = async () => {
        setLoading(true)

        const request = await fetch(PORT + '/v1/me/invitations', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })

        if (request.status === 200) {
          const response = await request.json()
          setInvitations({ data: response.data, count: response.data.lenght })
          setLoading(false)
        } else {
          setLoading(false)
        }
      }

      fetchInvitations()
    } catch {
      const err = () => setLoading(false)
      err()
    }
  }, [trigger])

  return (
    <>
      <div
        className={`flex flex-col z-80 transition-all bg-background duration-300 justify-between h-dvh border-l border-l-line absolute w-80 ${expanded ? 'right-0' : '-right-80'}`}
      >
        <div className="relative flex flex-col w-full h-full overflow-y-auto">
          <div className="sticky top-0 flex flex-col gap-4 p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bebas text-ink">Notificaciones</p>
              <button
                onClick={toggleNotificationsSidebar}
                className={`p-1 hover:bg-surface hover:border-line border-transparent border rounded transition-all duration-300 cursor-pointer`}
              >
                <ChevronsRight className="size-4 min-h-4 min-w-4" />
              </button>
            </div>

            <DinamicButton
              action={() => setTrigger({ total: 0 })}
              type="unfilled"
              disabledSpinner={false}
              spinFromText
              label="Ver recientes"
              icon={<RotateCw className="size-4 min-h-4 min-w-4" />}
              disabled={loading}
              twClassName="w-fit py-1 text-sm m-auto"
            />
          </div>

          <div className="p-4">
            {loading ? (
              <div className="grid w-full grid-rows-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    className={`w-full py-16 rounded-xl bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient`}
                    key={i}
                  />
                ))}
              </div>
            ) : invitations === null ? (
              <p className="text-sm">No se encontraron notificaciones</p>
            ) : invitations.data?.length === 0 ? (
              <p className="text-sm">No se encontraron notificaciones</p>
            ) : (
              <div className="flex flex-col gap-6">
                {invitations.data?.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex flex-col gap-4 p-4 transition-all duration-300 bg-surface rounded-xl hover:bg-surface-hover"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center w-12 h-12 border min-w-12 min-h-12 border-line rounded-xl">
                        {invitation.organization.logo_url === null ||
                        invitation.organization.logo_url === '' ? (
                          <Photo className="size-6 min-h-6 min-w-6" />
                        ) : (
                          <Image
                            alt="Foto de organización"
                            src={invitation.organization.logo_url}
                            quality={70}
                            fill
                            className="object-cover object-center rounded-xl"
                          />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-ink">{invitation.organization.name}</p>
                        <p className="text-sm font-bold text-primary">Invitación</p>
                      </div>
                    </div>

                    <p>
                      <span className="font-semibold text-ink">{invitation.invited_by_name}</span>{' '}
                      te a invitado a unirte a su organización como{' '}
                      <span className="font-semibold text-ink">{getRole(invitation.role)}</span>
                    </p>

                    <div className="flex items-center gap-4 w-fit">
                      <DinamicButton
                        action={() =>
                          setModal({
                            isActivated: true,
                            title: 'Rechazar invitación',
                            body: (
                              <ModalBodyAcceptRejectInvitation
                                accept={false}
                                id={invitation.id}
                                orgName={invitation.organization.name}
                              />
                            ),
                          })
                        }
                        type="destructive"
                        disabledSpinner={false}
                        spinFromText
                        label="Rechazar"
                        disabled={false}
                        twClassName="w-fit py-1 text-sm m-auto"
                      />
                      <DinamicButton
                        action={() =>
                          setModal({
                            isActivated: true,
                            title: 'Aceptar invitación',
                            body: (
                              <ModalBodyAcceptRejectInvitation
                                accept
                                id={invitation.id}
                                orgName={invitation.organization.name}
                              />
                            ),
                          })
                        }
                        type="filled"
                        disabledSpinner={false}
                        spinFromText
                        label="Aceptar"
                        disabled={false}
                        twClassName="w-fit py-1 text-sm m-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        onClick={toggleNotificationsSidebar}
        className={`absolute w-full top-0 left-0 h-screen transition-all duration-300 z-70 ${
          expanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      ></div>
    </>
  )
}
