'use client'

/* COMPONENTS */
import { DinamicRow } from '@/content/shared/ui/dinamicTable/components/dinamicRow/DinamicRow'
import { DinamicTd } from '@/content/shared/ui/dinamicTable/components/dinamicTd/DinamicTd'
import { ModalBodyUpdateStatus } from '../../../modalBodyUpdateStatus/ModalBodyUpdateStatus'
import { ModalBodyRemoveMember } from '../../../modalBodyRemoveMember/ModalBodyRemoveMember'
import { ModalBodyUpdateMemberForm } from '../../../modalBodyUpdateMember/ModalBodyUpdateMemberForm'

/* ICONS */
import { Crown, Mail, Power, PowerOff, SquarePen, Trash2, X } from 'lucide-react'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { OrgMember } from '../../../../../../../../../../../api/src/modules/organizations/organization.entity'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* UTILS */
import { getRole } from '@/content/dashboard/organizer/organizations/page/utils/getRole'

export function MemberRow({ member, twBgColor }: { member: OrgMember; twBgColor: string }) {
  const { setModal } = useModal()
  const data = useAuthStore((s) => s.data)

  const getStatus = (status: 'invited' | 'left' | 'active' | 'suspended' | string) => {
    switch (status) {
      case 'active':
        return 'Activo'

      case 'invited':
        return 'Invitación enviada'

      case 'left':
        return 'Eliminado'

      case 'suspended':
        return 'Inactivo'

      default:
        return 'Ocurrió un error'
    }
  }

  return (
    <DinamicRow twBgColor={twBgColor}>
      <DinamicTd twClassName="text-nowrap">
        {member.user.email === data?.user.email ? (
          <div className="p-1 border-2 rounded-full bg-surface border-line w-fit h-fit">
            <Crown className="size-4 min-w-4 min-h-4" />
          </div>
        ) : member.status === 'active' || member.status === 'suspended' ? (
          <DinamicButton
            action={() =>
              setModal({
                isActivated: true,
                title: 'Cambiar estatus',
                body: (
                  <ModalBodyUpdateStatus
                    actualStatus={member.status}
                    complete_name={member.user.name ?? '...'}
                    id={member.id}
                  />
                ),
              })
            }
            type={member.status === 'active' ? 'filled' : 'destructive'}
            icon={
              member.status === 'active' ? (
                <Power className="size-4 min-w-4 min-h-4" />
              ) : (
                <PowerOff className="size-4 min-w-4 min-h-4" />
              )
            }
            twClassName="w-fit rounded-full p-1"
          />
        ) : member.status === 'invited' ? (
          <div className="p-1 border-2 rounded-full bg-surface border-line w-fit h-fit">
            <Mail className="size-4 min-w-4 min-h-4" />
          </div>
        ) : (
          <div className="p-1 border-2 rounded-full bg-surface border-line w-fit h-fit">
            <X className="size-4 min-w-4 min-h-4" />
          </div>
        )}
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{getStatus(member?.status ?? 'Error')}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{member?.user?.name ?? 'Nombre no encontrado'}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{getRole(member?.role ?? 'Error')}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{member?.user?.email ?? 'Error'}</p>
      </DinamicTd>

      {/* <DinamicTd twClassName="text-nowrap">
        <DinamicButton
          action={() =>
            setModal({
              isActivated: true,
              title: 'Actualizar miembro',
              body: <ModalBodyUpdateMemberForm slug="" />,
            })
          }
          type={'filled'}
          icon={<SquarePen className="size-4 min-w-4 min-h-4" />}
          twClassName="w-fit rounded-full p-1"
        />
      </DinamicTd> */}

      <DinamicTd twClassName="text-nowrap">
        <DinamicButton
          action={() =>
            setModal({
              isActivated: true,
              title: 'Remover miembro',
              body: (
                <ModalBodyRemoveMember
                  complete_name={member?.user?.name ?? 'Error'}
                  id={member.id}
                />
              ),
            })
          }
          type={'destructive'}
          icon={<Trash2 className="size-4 min-w-4 min-h-4" />}
          twClassName="w-fit rounded-full p-1"
        />
      </DinamicTd>
    </DinamicRow>
  )
}
