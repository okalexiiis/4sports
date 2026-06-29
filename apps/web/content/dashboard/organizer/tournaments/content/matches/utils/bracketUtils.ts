import { v4 as uuidv4 } from "uuid";
import type { Match, Round, Team } from "../types/types";

// ─── Validación ────────────────────────────────────────────────────────────────

/**
 * Devuelve true si n es potencia de 2 (n >= 2).
 */
export function isPowerOfTwo(n: number): boolean {
  return n >= 2 && (n & (n - 1)) === 0;
}

// ─── Labels de ronda ──────────────────────────────────────────────────────────

const ROUND_LABELS: Record<number, string> = {
  2:  "Final",
  4:  "Semifinal",
  8:  "Cuartos de final",
  16: "Octavos de final",
  32: "Dieciseisavos de final",
};

function getRoundLabel(matchCount: number): string {
  return ROUND_LABELS[matchCount+1] ?? `Ronda de ${matchCount * 2}`;
}

// ─── Generación del bracket ───────────────────────────────────────────────────

/**
 * Dado un arreglo de equipos (longitud potencia de 2),
 * genera todas las rondas del bracket con sus partidos vacíos
 * y los `nextMatchId` correctamente enlazados.
 *
 * La primera ronda contiene los equipos en el orden recibido.
 * Las rondas siguientes tienen sus equipos en `null` (se llenan al avanzar).
 */
export function generateBracket(teams: Team[]): Round[] {
  if (!isPowerOfTwo(teams.length)) {
    throw new Error("El número de equipos debe ser potencia de 2.");
  }

  const rounds: Round[] = [];
  let currentMatchCount = teams.length / 2;

  // ── Primera ronda: asignar equipos en pares ──
  const firstRoundMatches: Match[] = [];
  for (let i = 0; i < currentMatchCount; i++) {
    firstRoundMatches.push({
      id: uuidv4(),
      position: i,
      local:    teams[i * 2],
      visitor:  teams[i * 2 + 1],
      scheduledAt: null,
      result: null,
      nextMatchId: null, // se enlaza después
    });
  }

  rounds.push({
    id: uuidv4(),
    label: getRoundLabel(currentMatchCount),
    matches: firstRoundMatches,
  });

  // ── Rondas siguientes ──
  currentMatchCount = currentMatchCount / 2;
  while (currentMatchCount >= 1) {
    const matches: Match[] = [];
    for (let i = 0; i < currentMatchCount; i++) {
      matches.push({
        id: uuidv4(),
        position: i,
        local: null,
        visitor: null,
        scheduledAt: null,
        result: null,
        nextMatchId: null,
      });
    }
    rounds.push({
      id: uuidv4(),
      label: getRoundLabel(currentMatchCount),
      matches,
    });
    currentMatchCount = currentMatchCount / 2;
  }

  // ── Enlazar nextMatchId entre rondas ──
  for (let r = 0; r < rounds.length - 1; r++) {
    const currentRound = rounds[r];
    const nextRound    = rounds[r + 1];
    currentRound.matches.forEach((match, idx) => {
      match.nextMatchId = nextRound.matches[Math.floor(idx / 2)].id;
    });
  }

  return rounds;
}

// ─── Drag & drop: intercambio de equipos en primera ronda ────────────────────

/**
 * Intercambia los equipos de dos tarjetas de la primera ronda.
 * `slotA` / `slotB`: "local" o "visitor" de cada match.
 * Devuelve un nuevo arreglo de rondas (inmutable).
 */
export function swapTeams(
  rounds: Round[],
  matchAId: string,
  slotA: "local" | "visitor",
  matchBId: string,
  slotB: "local" | "visitor"
): Round[] {
  const firstRound = rounds[0];

  const newMatches = firstRound.matches.map((m) => {
    if (m.id === matchAId && m.id === matchBId) {
      // mismo partido: intercambiar local y visitor
      return { ...m, local: m.visitor, visitor: m.local };
    }
    if (m.id === matchAId) {
      const teamA = m[slotA];
      // el valor que vendrá de B se resuelve afuera; aquí devolvemos placeholder
      return { ...m, [slotA]: null, _swapTemp: teamA } as Match & { _swapTemp: Team | null };
    }
    if (m.id === matchBId) {
      const teamB = m[slotB];
      return { ...m, [slotB]: null, _swapTemp: teamB } as Match & { _swapTemp: Team | null };
    }
    return m;
  });

  // Resolución en dos pasadas para evitar dependencia de orden
  const teamA = (newMatches.find((m) => m.id === matchAId) as any)?._swapTemp as Team | null;
  const teamB = (newMatches.find((m) => m.id === matchBId) as any)?._swapTemp as Team | null;

  const resolved = newMatches.map((m) => {
    const copy = { ...m } as any;
    delete copy._swapTemp;
    if (m.id === matchAId) copy[slotA] = teamB;
    if (m.id === matchBId) copy[slotB] = teamA;
    return copy as Match;
  });

  return [
    { ...firstRound, matches: resolved },
    ...rounds.slice(1),
  ];
}

// ─── Helpers de lectura ───────────────────────────────────────────────────────

/**
 * Actualiza la fecha de un partido en cualquier ronda.
 * Devuelve un nuevo arreglo de rondas (inmutable).
 */
export function updateMatchDate(
  rounds: Round[],
  matchId: string,
  date: Date | null
): Round[] {
  return rounds.map((round) => ({
    ...round,
    matches: round.matches.map((m) =>
      m.id === matchId ? { ...m, scheduledAt: date } : m
    ),
  }));
}

/**
 * Actualiza el resultado de un partido y propaga el ganador
 * al slot correspondiente de la siguiente ronda.
 */
export function setMatchResult(
  rounds: Round[],
  matchId: string,
  result: { localScore: number; visitorScore: number }
): Round[] {
  let winner: Team | null = null;
  let nextMatchId: string | null = null;
  let isLocal: boolean = false; // ¿el ganador iba como local en el siguiente?

  // 1. Actualizar el resultado y obtener el ganador
  const updated = rounds.map((round, rIdx) => ({
    ...round,
    matches: round.matches.map((m, mIdx) => {
      if (m.id !== matchId) return m;

      winner =
        result.localScore > result.visitorScore
          ? m.local
          : result.visitorScore > result.localScore
          ? m.visitor
          : null; // empate: no se propaga automáticamente

      nextMatchId = m.nextMatchId;
      // El ganador ocupa local si su posición es par, visitor si es impar
      isLocal = mIdx % 2 === 0;

      return { ...m, result };
    }),
  }));

  if (!winner || !nextMatchId) return updated;

  // 2. Propagar ganador al partido siguiente
  return updated.map((round) => ({
    ...round,
    matches: round.matches.map((m) => {
      if (m.id !== nextMatchId) return m;
      return isLocal ? { ...m, local: winner } : { ...m, visitor: winner };
    }),
  }));
}