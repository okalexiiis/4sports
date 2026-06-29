"use client";

import { useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import MatchCard from "../matchCard/MatchCard";
import {
  generateBracket,
  isPowerOfTwo,
  swapTeams,
  updateMatchDate,
} from "../../utils/bracketUtils";
import type {
  EliminationBracketProps,
  Match,
  Round,
  SetupFormValues,
} from "../../types/types";

// ─── Constantes de layout ─────────────────────────────────────────────────────
// Deben coincidir con el CSS que se aplica a las tarjetas y gaps.
const CARD_H = 220; // px — altura aproximada de una MatchCard
const GAP = 16; // px — gap-4 entre tarjetas dentro de una ronda
const CONNECTOR_W = 40; // px — ancho del SVG conector entre columnas

// ─── Helpers de geometría ─────────────────────────────────────────────────────

/**
 * Altura del "slot" que ocupa cada tarjeta en la ronda `r`.
 * r=0 → CARD_H, r=1 → CARD_H*2+GAP, r=2 → CARD_H*4+GAP*3, …
 */
function slotHeight(r: number): number {
  return CARD_H * Math.pow(2, r) + GAP * (Math.pow(2, r) - 1);
}

/**
 * Altura total de una columna de ronda `r` con `matchCount` partidos.
 * Es constante para todas las rondas del mismo bracket.
 */
function columnHeight(r: number, matchCount: number): number {
  const sh = slotHeight(r);
  return matchCount * sh + (matchCount - 1) * GAP;
}

/**
 * Y del centro de la tarjeta `i` en la ronda `r`.
 */
function cardCenterY(r: number, i: number): number {
  const sh = slotHeight(r);
  return i * (sh + GAP) + sh / 2;
}

// ─── Conector SVG entre dos rondas ───────────────────────────────────────────

interface ConnectorProps {
  /** Índice de la ronda de la izquierda (hijos) */
  leftRoundIndex: number;
  /** Número de partidos en la ronda izquierda */
  leftMatchCount: number;
  /** Número de partidos en la ronda derecha (padres) */
  rightMatchCount: number;
  /** Alto total de la columna (igual para todas las rondas) */
  totalHeight: number;
}

function BracketConnector({
  leftRoundIndex,
  leftMatchCount,
  rightMatchCount,
  totalHeight,
}: ConnectorProps) {
  const rRight = leftRoundIndex + 1;

  const lines: React.ReactNode[] = [];

  for (let parentIdx = 0; parentIdx < rightMatchCount; parentIdx++) {
    const child0Idx = parentIdx * 2;
    const child1Idx = parentIdx * 2 + 1;

    const y0 = cardCenterY(leftRoundIndex, child0Idx); // hijo superior
    const y1 = cardCenterY(leftRoundIndex, child1Idx); // hijo inferior
    const yP = cardCenterY(rRight, parentIdx); // padre

    const xLeft = 0; // borde izquierdo del SVG (donde salen los hijos)
    const xMid = CONNECTOR_W / 2; // punta de la "peineta"
    const xRight = CONNECTOR_W; // borde derecho del SVG (donde entra el padre)

    lines.push(
      <g key={parentIdx}>
        {/* Línea horizontal desde hijo superior → xMid */}
        <line x1={xLeft} y1={y0} x2={xMid} y2={y0} />
        {/* Línea horizontal desde hijo inferior → xMid */}
        <line x1={xLeft} y1={y1} x2={xMid} y2={y1} />
        {/* Línea vertical que une ambos hijos en xMid */}
        <line x1={xMid} y1={y0} x2={xMid} y2={y1} />
        {/* Línea horizontal desde xMid → padre */}
        <line x1={xMid} y1={yP} x2={xRight} y2={yP} />
      </g>,
    );
  }

  return (
    <svg
      width={CONNECTOR_W}
      height={totalHeight}
      className="flex-shrink-0 overflow-visible"
      style={{ minWidth: CONNECTOR_W }}
    >
      <g
        stroke="#475569" /* slate-600 */
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {lines}
      </g>
    </svg>
  );
}

// ─── Estado drag ──────────────────────────────────────────────────────────────

interface DragState {
  matchId: string;
  slot: "local" | "visitor";
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function EliminationBracket({
  teams,
  mode,
  onRegister,
  onFinish,
  onOpenResultModal,
}: EliminationBracketProps) {
  const isValidTeamCount = isPowerOfTwo(teams.length);

  const [rounds, setRounds] = useState<Round[]>(() =>
    isValidTeamCount ? generateBracket(teams) : [],
  );

  const [dragSource, setDragSource] = useState<DragState | null>(null);
  const [dragOverMatchId, setDragOverMatchId] = useState<string | null>(null);

  const methods = useForm<SetupFormValues>({ defaultValues: { dates: {} } });

  // ─── Drag & drop ─────────────────────────────────────────────────────────────

  const handleDragStart = useCallback(
    (matchId: string, slot: "local" | "visitor") =>
      setDragSource({ matchId, slot }),
    [],
  );

  const handleDragOver = useCallback(
    (targetMatchId: string) => setDragOverMatchId(targetMatchId),
    [],
  );

  const handleDrop = useCallback(
    (targetMatchId: string, targetSlot: "local" | "visitor") => {
      if (!dragSource) return;
      if (
        dragSource.matchId !== targetMatchId ||
        dragSource.slot !== targetSlot
      ) {
        setRounds((prev) =>
          swapTeams(
            prev,
            dragSource.matchId,
            dragSource.slot,
            targetMatchId,
            targetSlot,
          ),
        );
      }
      setDragSource(null);
      setDragOverMatchId(null);
    },
    [dragSource],
  );

  const handleDragEnd = useCallback(() => {
    setDragSource(null);
    setDragOverMatchId(null);
  }, []);

  // ─── Submit setup ─────────────────────────────────────────────────────────────

  const handleRegister = methods.handleSubmit((values) => {
    let updated = rounds;
    Object.entries(values.dates).forEach(([matchId, isoDate]) => {
      updated = updateMatchDate(
        updated,
        matchId,
        isoDate ? new Date(isoDate) : null,
      );
    });
    setRounds(updated);
    onRegister?.(updated);
  });

  // ─── Layout ───────────────────────────────────────────────────────────────────

  const isSetup = mode === "setup";
  const isRegistration = mode === "registration";

  // Alto total de la columna (igual para todas las rondas → usa ronda 0)
  const totalH =
    rounds.length > 0 ? columnHeight(0, rounds[0].matches.length) : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── Error ── */}
      {!isValidTeamCount && (
        <p className="text-sm text-rose-400 bg-rose-950/40 border border-rose-800 rounded-lg px-4 py-3">
          El número de equipos debe ser potencia de 2 (2, 4, 8, 16…).
          Actualmente hay <strong>{teams.length}</strong> equipos.
        </p>
      )}

      <FormProvider {...methods}>
        {/* ── Bracket ── */}
        <div
          className="flex flex-row items-start overflow-x-auto pb-4"
          onDragEnd={handleDragEnd}
        >
          {rounds.map((round, rIdx) => {
            const isFirstRound = rIdx === 0;
            const showEmpty = isSetup && !isFirstRound;
            const sh = slotHeight(rIdx);

            return (
              <div key={round.id} className="flex flex-row items-start">
                {/* ── Columna de la ronda ── */}
                <div className="flex flex-col" style={{ width: 236 }}>
                  {/* Tarjetas: cada una ocupa un slot de altura `sh` con la tarjeta centrada */}
                  <div
                    className="flex flex-col bg-surface p-6 rounded-xl"
                    style={{ height: totalH }}
                  >
                    {/* Etiqueta */}
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-3 px-1">
                      {round.label}
                    </p>

                    {round.matches.map((match, mIdx) => (
                      <div
                        key={match.id}
                        style={{
                          height: sh,
                          marginTop: mIdx === 0 ? 0 : GAP,
                          display: "flex",
                          alignItems: "center",
                        }}
                        onDragOver={
                          isSetup && isFirstRound
                            ? (e) => {
                                e.preventDefault();
                                handleDragOver(match.id);
                              }
                            : undefined
                        }
                        onDrop={
                          isSetup && isFirstRound
                            ? (e) => {
                                e.preventDefault();
                                handleDrop(match.id, "local");
                              }
                            : undefined
                        }
                      >
                        <div style={{ width: "100%" }}>
                          <MatchCard
                            match={match}
                            mode={mode}
                            isEmpty={showEmpty}
                            isDragOver={dragOverMatchId === match.id}
                            onDragStart={
                              isSetup && isFirstRound
                                ? handleDragStart
                                : undefined
                            }
                            onDragOver={
                              isSetup && isFirstRound
                                ? () => handleDragOver(match.id)
                                : undefined
                            }
                            onDrop={
                              isSetup && isFirstRound
                                ? (matchId, slot) => handleDrop(matchId, slot)
                                : undefined
                            }
                            onOpenResultModal={
                              isRegistration
                                ? (m: Match) => onOpenResultModal?.(m, round.id)
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Conector SVG hacia la siguiente ronda ── */}
                {rIdx < rounds.length - 1 && (
                  <div
                    style={{
                      // El SVG debe alinearse con la zona de tarjetas, no con la etiqueta.
                      // La etiqueta tiene mb-3 (12px) + text ~16px ≈ 28px de offset.
                      paddingTop: 28,
                      alignSelf: "flex-start",
                    }}
                  >
                    <BracketConnector
                      leftRoundIndex={rIdx}
                      leftMatchCount={round.matches.length}
                      rightMatchCount={rounds[rIdx + 1].matches.length}
                      totalHeight={totalH}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Acciones ── */}
        <div className="flex justify-end pt-2">
          {isSetup && (
            <button
              type="button"
              disabled={!isValidTeamCount}
              onClick={handleRegister}
              className={[
                "px-5 py-2 rounded-xl text-sm font-semibold transition-colors",
                isValidTeamCount
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed",
              ].join(" ")}
            >
              Registrar partidos
            </button>
          )}

          {isRegistration && (
            <button
              type="button"
              disabled={!isValidTeamCount}
              onClick={onFinish}
              className={[
                "px-5 py-2 rounded-xl text-sm font-semibold transition-colors",
                isValidTeamCount
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed",
              ].join(" ")}
            >
              Terminar torneo
            </button>
          )}
        </div>
      </FormProvider>
    </div>
  );
}
