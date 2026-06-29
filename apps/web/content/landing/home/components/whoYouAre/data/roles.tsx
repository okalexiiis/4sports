/* ICONS */
import { ClipboardList, SportShoe } from 'lucide-react'

/* TYPES */
import { CardItem } from '../../shared/types/cardItem'

export const roles: CardItem[] = [
  {
    title: 'Jugador',
    description:
      'Encuentra partidos, únete a equipos y compite con apoyo de estadísticas y comunidad.',
    component: (
      <SportShoe className="size-8 min-w-8 min-h-8 text-[#ff4b1f] transition-colors duration-300 group-hover:text-[#d4f233]" />
    ),
  },
  {
    title: 'Organizador',
    description:
      'Planea torneos, gestiona equipos y ofrece a tu comunidad una experiencia profesional y amigable.',
    component: (
      <ClipboardList className="size-8 min-w-8 min-h-8 text-[#ff4b1f] transition-colors duration-300 group-hover:text-[#d4f233]" />
    ),
  },
]
