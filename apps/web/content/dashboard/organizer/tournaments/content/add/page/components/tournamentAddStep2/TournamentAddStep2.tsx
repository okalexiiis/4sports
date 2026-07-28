'use client'

/* COMPONENTS */
import { ChoiceCard } from '@/content/auth/onboarding/components/choiceCard/ChoiceCard'

/* HOOKS */
import { useFormContext } from 'react-hook-form'

/* TYPES */
import { TournamentAddFormType } from '../../types/tournamentAddFormType'

export function TournamentAddStep2() {
  const { watch, setValue } = useFormContext<TournamentAddFormType>()

  const type = watch('format_id')

  return (
    <div className="grid w-full grid-cols-2 gap-6 p-10 h-fit">
      <ChoiceCard
        active={type === 'round_robin'}
        title="Todos contra todos"
        dots={['Cada equipo juega contra todos los demás']}
        action={() => {
          setValue('format_id', 'round_robin')
        }}
        wantCheck={false}
      />

      <ChoiceCard
        active={type === 'single_elimination'}
        title="Eliminación directa"
        dots={['El que pierde queda fuera']}
        action={() => {
          setValue('format_id', 'single_elimination')
        }}
        wantCheck={false}
      />
    </div>
  )
}
