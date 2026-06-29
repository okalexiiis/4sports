/* TYPES */

/* ICONS */
import { Activity, Medal, Trophy, UserPlus } from 'lucide-react'
import { CardItem } from '../../shared/types/cardItem'

export const tournaments: CardItem[] = [
  {
    title: 'Campeonatos rápidos',
    description: 'Organiza brackets y grupos con flujo simple y visual.',
    component: (
      <Trophy className="transition-all duration-300 size-5 text-ink group-hover:text-primary group-hover:scale-110" />
    ),
  },
  {
    title: 'Inscripciones fáciles',
    description: 'Acepta equipos y jugadores con un proceso cómodo y seguro.',
    component: (
      <UserPlus className="transition-all duration-300 size-5 text-ink group-hover:text-primary group-hover:scale-110" />
    ),
  },
  {
    title: 'Resultados en vivo',
    description: 'Presenta puntajes, clasificaciones y resúmenes al momento.',
    component: (
      <Activity className="transition-all duration-300 size-5 text-ink group-hover:text-primary group-hover:scale-110" />
    ),
  },
  {
    title: 'Premios y rankings',
    description: 'Mantén motivada a tu comunidad con logros claros y justos.',
    component: (
      <Medal className="transition-all duration-300 size-5 text-ink group-hover:text-primary group-hover:scale-110" />
    ),
  },
]
