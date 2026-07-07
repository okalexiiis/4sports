'use client'

/* COMPONENTS */
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* TYPES */
import { BracketProps, Match, Round, SetupFormValues, Team } from '../../types/types'
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'
import { generateRoundRobinBracket } from '../../utils/bracketUtils'
import { RoundRobinMatchCard } from '../roundRobinMatchCard/RoundRobinMatchCard'

export function RoundRobinBracket({
  mode,
  onFinish,
  onRegister,
  teams,
  onOpenResultModal,
}: BracketProps) {
  const isSetup = mode === 'setup'
  const isRegistration = mode === 'registration'
  const isValidTeamCount = teams.length > 1

  const [rounds, setRounds] = useState<Round[]>(() =>
    isValidTeamCount ? generateRoundRobinBracket(teams) : [],
  )

  // ── Submit setup ──
  const methods = useForm<SetupFormValues>({ defaultValues: { dates: {} } })
  const handleRegister = methods.handleSubmit((values) => {
    console.log(values)
  })

  return (
    <div className="flex flex-col flex-1 w-full min-h-0">
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-center justify-between w-full p-6 border-b border-line h-fit">
          <p className="text-xl text-ink font-extralight">Partidos</p>

          {isSetup && (
            <DinamicButton
              action={handleRegister}
              type={'filled'}
              label="Registrar partidos"
              twClassName="w-fit text-sm py-1"
            />
          )}
          {isRegistration && (
            <DinamicButton
              action={onFinish}
              type={'filled'}
              label="Terminar torneo"
              twClassName="w-fit text-sm py-1"
            />
          )}
        </div>

        <div className={`flex-1 min-h-0 overflow-auto`}>
          {!isValidTeamCount ? (
            <p className="px-4 py-3 text-sm border rounded-lg text-rose-400 bg-rose-950/40 border-rose-800">
              El número de equipos debe ser potencia de 2 (2, 4, 8, 16…). Actualmente hay{' '}
              <strong>{teams.length}</strong> equipos.
            </p>
          ) : (
            <FormProvider {...methods}>
              <table>
                <tbody>
                  {rounds.map((r, i) => {
                    const canHaveTopBorder = i !== 0

                    return (
                      <tr key={i}>
                        {r.matches.map((m, j) => {
                          const canHaveLeftBorder = j !== 0

                          return (
                            <RoundRobinMatchCard
                              key={j}
                              match={m}
                              onOpenResultModal={
                                isRegistration
                                  ? (m: Match) => onOpenResultModal?.(m, r.id ?? '')
                                  : undefined
                              }
                              mode={mode}
                              isEmpty={m.local?.id === m.visitor?.id}
                              canHaveLeftBorder={canHaveLeftBorder}
                              canHaveTopBorder={canHaveTopBorder}
                            />
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </FormProvider>
          )}
        </div>
      </div>
    </div>
  )
}
