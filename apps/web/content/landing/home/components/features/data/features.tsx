/* TYPES */

/* ICONS */
import { BarChart3, Calendar, UsersRound } from 'lucide-react'
import { CardItem } from '../../shared/types/cardItem'

export const features: CardItem[] = [
  {
    title: 'Organización rápida',
    description: 'Crea eventos y gestiona equipos con solo unos clics',
    component: (
      <Calendar className="transition-colors duration-300 size-6 text-secondary group-hover:text-primary" />
    ),
  },
  {
    title: 'Estadísticas inteligentes',
    description: 'Sigue resultados, desempeño y progreso en tiempo real',
    component: (
      <BarChart3 className="transition-colors duration-300 size-6 text-secondary group-hover:text-primary" />
    ),
  },
  {
    title: 'Comunidad activa',
    description: 'Conecta jugadores y organizadores en una plataforma única',
    component: (
      <UsersRound className="transition-colors duration-300 size-6 text-secondary group-hover:text-primary" />
    ),
  },
]
