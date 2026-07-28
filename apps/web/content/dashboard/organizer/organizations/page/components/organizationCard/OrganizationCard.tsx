'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { ModalBodyUpdateOrganizationContext } from '../modalBodyUpdateOrganizationContext/ModalBodyUpdateOrganizationContext'

/* ICONS */
import { Pointer, SquarePen } from 'lucide-react'

/* LIBS */
import { motion } from 'framer-motion'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'

/* TYPES */
import { OrganizationCardType } from './types/OrganizationCardType'

/* UTILS */
import { getRole } from '../../utils/getRole'

export function OrganizationCard({ id, isSelected, name, role }: OrganizationCardType) {
  const router = useRouter()

  const { setModal } = useModal()

  return (
    <motion.div
      className="relative flex flex-col items-center justify-between w-full gap-6 border-2 rounded-xl"
      style={
        isSelected
          ? {
              backgroundColor: 'var(--primary-background)',
              borderColor: 'var(--primary)',
            }
          : {
              backgroundColor: 'var(--background)',
              borderColor: 'var(--line)',
            }
      }
      whileHover={
        isSelected
          ? { scale: 1.03 }
          : {
              scale: 1.03,
              borderColor: 'var(--primary)',
            }
      }
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        scale: { duration: 0.3 },
        backgroundColor: { duration: 0.3 },
        borderColor: { duration: 0.3 },
      }}
    >
      <div className="relative flex flex-col w-full min-w-0 px-6 pt-6">
        {isSelected && (
          <div
            className={`py-1 px-3 rounded-full absolute top-0 -translate-y-1/2 right-4 shadow-md bg-primary z-10`}
          >
            <p className="text-sm font-bold text-black">Seleccionada</p>
          </div>
        )}

        <p className="text-lg font-bold text-left text-ink line-clamp-1">{name}</p>
        <p className="text-sm font-bold text-primary">{getRole(role)}</p>
      </div>

      <div className="flex w-full gap-6 px-6 pb-6">
        {!isSelected && (
          <DinamicButton
            action={() =>
              setModal({
                isActivated: true,
                title: 'Seleccionar Organización',
                body: <ModalBodyUpdateOrganizationContext id={id} orgName={name} />,
              })
            }
            type="unfilled"
            twClassName="py-1 text-sm"
            icon={<Pointer className="size-4 min-h-4 min-w-4" />}
            label="Seleccionar"
          />
        )}

        {isSelected && (
          <DinamicButton
            action={() => router.push(`/organizer/organizations/${id}`)}
            type="unfilled"
            twClassName="py-1 text-sm"
            icon={<SquarePen className="size-4 min-h-4 min-w-4" />}
            label="Gestionar"
          />
        )}
      </div>
    </motion.div>
  )
}
