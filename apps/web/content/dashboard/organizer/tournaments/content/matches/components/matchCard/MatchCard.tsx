"use client";

import Image from "next/image";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { Match, BracketMode, SetupFormValues } from "../../types/types";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface MatchCardProps {
  match: Match;
  mode: BracketMode;
  /** Solo relevante en modo setup: indica que esta tarjeta está siendo arrastrada sobre ella */
  isDragOver?: boolean;
  /** Handlers drag & drop (solo modo setup) */
  onDragStart?: (matchId: string, slot: "local" | "visitor") => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (matchId: string, slot: "local" | "visitor") => void;
  /** Modo registration: abre el modal de resultado */
  onOpenResultModal?: (match: Match) => void;
  /** Tarjeta vacía (rondas futuras en modo setup) */
  isEmpty?: boolean;
}

// ─── Sub-componente: fila de equipo ───────────────────────────────────────────

interface TeamRowProps {
  team: { name: string; logoUrl?: string } | null;
  score?: number | null;
  side: "local" | "visitor";
  draggable: boolean;
  matchId: string;
  onDragStart?: (matchId: string, slot: "local" | "visitor") => void;
}

function TeamRow({
  team,
  score,
  side,
  draggable,
  matchId,
  onDragStart,
}: TeamRowProps) {
  const isWinner = score !== undefined && score !== null;

  return (
    <div
      draggable={draggable && !!team}
      onDragStart={
        draggable && team
          ? (e) => {
              e.dataTransfer.effectAllowed = "move";
              onDragStart?.(matchId, side);
            }
          : undefined
      }
      className={[
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
        draggable && team
          ? "cursor-grab active:cursor-grabbing hover:bg-slate-700/60"
          : "cursor-default",
        isWinner ? "bg-slate-700/40" : "",
      ].join(" ")}
    >
      {/* Logo o placeholder */}
      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-600 flex-shrink-0 flex items-center justify-center">
        {team?.logoUrl ? (
          <Image
            src={team.logoUrl}
            alt={team.name}
            width={24}
            height={24}
            className="object-cover"
          />
        ) : (
          <span className="text-[10px] text-slate-400 font-mono select-none">
            {team ? team.name.slice(0, 2).toUpperCase() : "—"}
          </span>
        )}
      </div>

      {/* Nombre */}
      <span
        className={[
          "flex-1 text-sm truncate",
          team ? "text-slate-100 font-medium" : "text-slate-500 italic",
        ].join(" ")}
      >
        {team?.name ?? "Por definir"}
      </span>

      {/* Resultado (solo modo registration con resultado cargado) */}
      {score !== undefined && score !== null && (
        <span className="text-sm font-bold tabular-nums text-indigo-300 ml-1">
          {score}
        </span>
      )}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function MatchCard({
  match,
  mode,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onOpenResultModal,
  isEmpty = false,
}: MatchCardProps) {
  // react-hook-form: disponible solo en modo setup (provisto por el padre con <FormProvider>)
  const formMethods =
    mode === "setup" ? useFormContext<SetupFormValues>() : null; // eslint-disable-line react-hooks/rules-of-hooks
  const register = formMethods?.register;

  const cardRef = useRef<HTMLDivElement>(null);

  const isSetup = mode === "setup";
  const isRegistration = mode === "registration";
  const hasResult = !!match.result;

  // ── Tarjeta vacía (rondas futuras en modo setup) ──
  if (isEmpty) {
    return (
      <div className="rounded-xl border border-dashed border-slate-600/50 bg-slate-800/20 p-3 min-w-[200px] opacity-50 select-none">
        <div className="h-[72px] flex items-center justify-center">
          <span className="text-xs text-slate-500">Disponible</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onDragOver={
        isSetup
          ? (e) => {
              e.preventDefault();
              onDragOver?.(e);
            }
          : undefined
      }
      onDrop={
        isSetup
          ? (e) => {
              e.preventDefault();
              // Intenta soltar sobre local primero; el padre decide la lógica real
              onDrop?.(match.id, "local");
            }
          : undefined
      }
      className={[
        // Base
        "rounded-xl border bg-slate-800 shadow-md transition-all duration-150 min-w-[220px]",
        // Borde normal vs drag-over
        isDragOver
          ? "border-indigo-400 ring-2 ring-indigo-400/40 scale-[1.02]"
          : "border-slate-700",
        // Resaltado si tiene resultado
        hasResult ? "border-slate-600" : "",
      ].join(" ")}
    >
      {/* ── Equipos ── */}
      <div className="flex flex-col divide-y divide-slate-700/60 pt-2 pb-1">
        {/* Local */}
        <TeamRow
          team={match.local}
          score={match.result?.localScore ?? undefined}
          side="local"
          draggable={isSetup}
          matchId={match.id}
          onDragStart={onDragStart}
        />

        {/* Separador "vs" */}
        <div className="flex items-center justify-center py-[2px]">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest select-none">
            vs
          </span>
        </div>

        {/* Visitante */}
        <TeamRow
          team={match.visitor}
          score={match.result?.visitorScore ?? undefined}
          side="visitor"
          draggable={isSetup}
          matchId={match.id}
          onDragStart={onDragStart}
        />
      </div>

      {/* ── Footer: fecha + acción ── */}
      <div className="px-3 pb-3 pt-2 flex flex-col gap-2 border-t border-slate-700/40 mt-1">
        {/* Campo de fecha — visible en ambos modos */}
        {isSetup && register ? (
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`dates.${match.id}`}
              className="text-[10px] text-slate-400 uppercase tracking-wider"
            >
              Fecha
            </label>
            <input
              id={`dates.${match.id}`}
              type="datetime-local"
              {...register(`dates.${match.id}`)}
              className="w-full rounded-md bg-slate-700 border border-slate-600 text-slate-100 text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder-slate-500"
            />
          </div>
        ) : isRegistration ? (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Fecha
            </span>
            <span className="text-xs text-slate-300">
              {match.scheduledAt
                ? new Intl.DateTimeFormat("es-MX", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(match.scheduledAt))
                : "Sin asignar"}
            </span>
          </div>
        ) : null}

        {/* Botón de resultado (solo modo registration) */}
        {isRegistration && (
          <button
            type="button"
            onClick={() => onOpenResultModal?.(match)}
            className={[
              "w-full rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              hasResult
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-indigo-600 text-white hover:bg-indigo-500",
            ].join(" ")}
          >
            {hasResult ? "Modificar resultado" : "Ingresar resultado"}
          </button>
        )}
      </div>
    </div>
  );
}
