'use client'

import Image from 'next/image'
import { useFormContext } from 'react-hook-form'
import type { Match, BracketMode, SetupFormValues } from '../../types/types'
import { UsersRound } from 'lucide-react'
import { DinamicInputDate } from '@/content/shared/form/dinamicInputDate/DinamicInputDate'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface MatchCardProps {
  match: Match
  mode: BracketMode
  onOpenResultModal?: (match: Match) => void
  isEmpty?: boolean
  canHaveTopBorder: boolean
  canHaveLeftBorder: boolean
}

export function RoundRobinMatchCard({
  match,
  mode,
  onOpenResultModal,
  isEmpty = false,
  canHaveLeftBorder,
  canHaveTopBorder,
}: MatchCardProps) {
  // useFormContext solo disponible en modo setup (padre envuelve con FormProvider)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formMethods = mode === 'setup' ? useFormContext<SetupFormValues>() : null
  const register = formMethods?.register

  const isSetup = mode === 'setup'
  const isRegistration = mode === 'registration'
  const hasResult = !!match.result

  if (isEmpty) {
    return (
      <td
        className={`border border-r-line border-b-line bg-surface ${canHaveTopBorder ? 'border-t-line' : 'border-t-transparent'} ${canHaveLeftBorder ? 'border-l-line' : 'border-l-transparent'}`}
      ></td>
    )
  }

  return (
    <td
      className={`border border-r-line border-b-line ${canHaveTopBorder ? 'border-t-line' : 'border-t-transparent'} ${canHaveLeftBorder ? 'border-l-line' : 'border-l-transparent'}`}
    >
      {/* Equipos */}
      <div className="flex items-center w-full gap-4 p-6">
        <div className="flex flex-col items-center w-full min-w-0 gap-4">
          {match.local?.logoUrl ? (
            <div className="relative w-16 h-16 min-w-16 min-h-16">
              <Image
                alt="Equipo"
                src={match.local?.logoUrl}
                quality={70}
                fill
                className="object-cover object-center rounded-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-16 h-16 border rounded-full min-w-16 min-h-16 bg-surface border-line">
              <UsersRound className="size-6 min-h-6 min-w-6" />
            </div>
          )}

          <p className="w-full font-semibold text-center truncate text-md">
            {match.local?.name ?? 'Por definir'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {match.result === null ? (
            <p className="text-2xl italic text-primary font-bebas text-nowrap">vs</p>
          ) : (
            <p className="text-2xl text-primary font-bebas">
              {match.result.localScore + ' - ' + match.result.visitorScore}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center w-full min-w-0 gap-4">
          {match.visitor?.logoUrl ? (
            <div className="relative w-16 h-16 min-w-16 min-h-16">
              <Image
                alt="Equipo"
                src={match.visitor?.logoUrl}
                quality={70}
                fill
                className="object-cover object-center rounded-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-16 h-16 border rounded-full min-w-16 min-h-16 bg-surface border-line">
              <UsersRound className="size-6 min-h-6 min-w-6" />
            </div>
          )}

          <p className="w-full font-semibold text-center truncate text-md">
            {match.visitor?.name ?? 'Por definir'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 px-6 pt-2 pb-3">
        {isSetup && register ? (
          <div className="flex flex-col gap-1">
            <DinamicInputDate<SetupFormValues>
              name={`dates.${match.id}`}
              showTime
              placeholder="Seleccione una fecha"
              rules={{}}
              label="Seleccione fecha y hora"
            />
          </div>
        ) : isRegistration ? (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Fecha</span>
            <span className="text-xs text-slate-300">
              {match.scheduledAt
                ? new Intl.DateTimeFormat('es-MX', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(match.scheduledAt))
                : 'Sin asignar'}
            </span>
          </div>
        ) : null}

        {isRegistration && (
          <button
            type="button"
            onClick={() => onOpenResultModal?.(match)}
            className={[
              'w-full rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              hasResult
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-indigo-600 text-white hover:bg-indigo-500',
            ].join(' ')}
          >
            {hasResult ? 'Modificar resultado' : 'Ingresar resultado'}
          </button>
        )}
      </div>
    </td>
  )
}
