'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

import MatchCard from '../matchCard/MatchCard'
import { generateBracket, isPowerOfTwo, updateMatchDate } from '../../utils/bracketUtils'
import type { BracketProps, Match, Round, SetupFormValues } from '../../types/types'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

// ─── Constantes fijas ─────────────────────────────────────────────────────────

/** Gap entre tarjetas dentro de una columna (debe coincidir con el CSS). */
const GAP = 24 // gap-4

/** Ancho del SVG conector entre columnas. */
const CONNECTOR_W = 48

/** Altura de fallback mientras no se ha medido ninguna tarjeta. */
const CARD_H_FALLBACK = 140

// ─── Helpers de geometría (reciben cardH como parámetro) ─────────────────────

function slotHeight(r: number, cardH: number): number {
  return cardH * Math.pow(2, r) + GAP * (Math.pow(2, r) - 1)
}

function columnHeight(r: number, matchCount: number, cardH: number): number {
  const sh = slotHeight(r, cardH)
  return matchCount * sh + (matchCount - 1) * GAP
}

function cardCenterY(r: number, i: number, cardH: number): number {
  const sh = slotHeight(r, cardH)
  return i * (sh + GAP) + sh / 2
}

// ─── Conector SVG ─────────────────────────────────────────────────────────────

interface ConnectorProps {
  leftRoundIndex: number
  rightMatchCount: number
  totalHeight: number
  cardH: number
}

function BracketConnector({ leftRoundIndex, rightMatchCount, totalHeight, cardH }: ConnectorProps) {
  const rRight = leftRoundIndex + 1
  const lines: React.ReactNode[] = []

  for (let parentIdx = 0; parentIdx < rightMatchCount; parentIdx++) {
    const y0 = cardCenterY(leftRoundIndex, parentIdx * 2, cardH)
    const y1 = cardCenterY(leftRoundIndex, parentIdx * 2 + 1, cardH)
    const yP = cardCenterY(rRight, parentIdx, cardH)
    const xMid = CONNECTOR_W / 2

    lines.push(
      <g key={parentIdx}>
        <line x1={0} y1={y0} x2={xMid} y2={y0} />
        <line x1={0} y1={y1} x2={xMid} y2={y1} />
        <line x1={xMid} y1={y0} x2={xMid} y2={y1} />
        <line x1={xMid} y1={yP} x2={CONNECTOR_W} y2={yP} />
      </g>,
    )
  }

  return (
    <svg
      width={CONNECTOR_W}
      height={totalHeight}
      className="overflow-visible shrink-0"
      style={{ minWidth: CONNECTOR_W }}
    >
      <g
        className="stroke-line-2"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {lines}
      </g>
    </svg>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function EliminationBracket({
  teams,
  mode,
  onRegister,
  onFinish,
  onOpenResultModal,
}: BracketProps) {
  const isValidTeamCount = isPowerOfTwo(teams.length)

  const [rounds, setRounds] = useState<Round[]>(() =>
    isValidTeamCount ? generateBracket(teams) : [],
  )

  // ── Altura real medida de una tarjeta ──
  // Se mide solo la primera tarjeta de la primera ronda; las demás son idénticas.
  const [cardH, setCardH] = useState<number>(CARD_H_FALLBACK)

  // Ref al primer MatchCard de la primera ronda
  const firstCardRef = useRef<HTMLDivElement>(null)

  // ResizeObserver: actualiza cardH cada vez que la tarjeta cambia de tamaño
  useLayoutEffect(() => {
    const el = firstCardRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const h = entry.contentRect.height
        if (h > 0) setCardH(h)
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [rounds]) // re-conectar si cambian las rondas (ej: modo cambia y re-renderiza)

  // ── Submit setup ──
  const methods = useForm<SetupFormValues>({ defaultValues: { dates: {} } })
  const handleRegister = methods.handleSubmit((values) => {
    let updated = rounds
    Object.entries(values.dates).forEach(([matchId, isoDate]) => {
      updated = updateMatchDate(updated, matchId, isoDate ? new Date(isoDate) : null)
    })
    setRounds(updated)
    onRegister?.(updated)
  })

  const isSetup = mode === 'setup'
  const isRegistration = mode === 'registration'

  // Alto total de la columna calculado con la altura real medida
  const firstRoundMatchCount = rounds[0]?.matches.length ?? 0
  const totalH = firstRoundMatchCount > 0 ? columnHeight(0, firstRoundMatchCount, cardH) : 0

  return (
    <div className="flex flex-col flex-1 w-full min-h-0">
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-center justify-between w-full p-6 border-b border-line h-fit">
          <p className="text-xl text-ink font-extralight">Partidos</p>

          {isSetup && (
            <DinamicButton
              action={handleRegister}
              type={!isValidTeamCount ? 'disabled' : 'filled'}
              label="Registrar partidos"
              disabled={!isValidTeamCount}
              twClassName="w-fit text-sm py-1"
            />
          )}
          {isRegistration && (
            <DinamicButton
              action={onFinish}
              type={!isValidTeamCount ? 'disabled' : 'filled'}
              label="Terminar torneo"
              disabled={!isValidTeamCount}
              twClassName="w-fit text-sm py-1"
            />
          )}
        </div>

        <div className="flex-1 min-h-0 p-6 overflow-auto">
          {/* Error */}
          {!isValidTeamCount ? (
            <p className="px-4 py-3 text-sm border rounded-lg text-rose-400 bg-rose-950/40 border-rose-800">
              El número de equipos debe ser potencia de 2 (2, 4, 8, 16…). Actualmente hay{' '}
              <strong>{teams.length}</strong> equipos.
            </p>
          ) : (
            <FormProvider {...methods}>
              <div className="flex flex-row items-start">
                {rounds.map((round, rIdx) => {
                  const isFirstRound = rIdx === 0
                  const isLastRound = rIdx + 1 === rounds.length
                  const showEmpty = isSetup && !isFirstRound
                  const sh = slotHeight(rIdx, cardH)

                  return (
                    <div key={rIdx} className="relative flex flex-row items-start min-w-112">
                      {/* ── Columna de ronda ── */}
                      <div className="flex flex-col w-full">
                        {/* Tarjetas */}
                        <div className="flex flex-col w-full" style={{ height: totalH }}>
                          {round.matches.map((match, mIdx) => {
                            // Solo la primera tarjeta de la primera ronda recibe el ref de medición
                            const measureRef = rIdx === 0 && mIdx === 0 ? firstCardRef : undefined

                            return (
                              <div
                                key={match.id}
                                style={{
                                  height: sh,
                                  marginTop: mIdx === 0 ? 0 : GAP,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <div style={{ width: '100%' }}>
                                  <MatchCard
                                    ref={measureRef}
                                    match={match}
                                    mode={mode}
                                    isEmpty={showEmpty}
                                    isLastRound={isLastRound}
                                    onOpenResultModal={
                                      isRegistration
                                        ? (m: Match) => onOpenResultModal?.(m, round.id ?? '')
                                        : undefined
                                    }
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* ── Conector SVG ── */}
                      {rIdx < rounds.length - 1 && (
                        <div style={{ alignSelf: 'flex-start' }}>
                          <BracketConnector
                            leftRoundIndex={rIdx}
                            rightMatchCount={rounds[rIdx + 1].matches.length}
                            totalHeight={totalH}
                            cardH={cardH}
                          />
                        </div>
                      )}

                      {/* Separador */}
                      {rIdx < rounds.length - 1 && (
                        <div className="absolute w-0 h-full border-l border-dotted right-6 border-line -z-10" />
                      )}
                    </div>
                  )
                })}
              </div>
            </FormProvider>
          )}
        </div>
      </div>
    </div>
  )
}
