import type { Match, Round, Team } from '../types/types'

// ─── Validación ────────────────────────────────────────────────────────────────

/**
 * Devuelve true si n es potencia de 2 (n >= 2).
 */
export function isPowerOfTwo(n: number): boolean {
  return n >= 2 && (n & (n - 1)) === 0
}

// ─── Labels de ronda ──────────────────────────────────────────────────────────

const ROUND_LABELS: Record<number, string> = {
  2: 'Final',
  4: 'Semifinal',
  8: 'Cuartos de final',
  16: 'Octavos de final',
  32: 'Dieciseisavos de final',
}

function getRoundLabel(matchCount: number): string {
  return ROUND_LABELS[matchCount + 1] ?? `Ronda de ${matchCount * 2}`
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
    throw new Error('El número de equipos debe ser potencia de 2.')
  }

  const rounds: Round[] = []
  let currentMatchCount = teams.length / 2

  let roundIndex = 0

  // ── Primera ronda: asignar equipos en pares ──
  const firstRoundMatches: Match[] = []
  for (let i = 0; i < currentMatchCount; i++) {
    firstRoundMatches.push({
      id: `round-${roundIndex}_match-${i}`,
      position: i,
      local: teams[i * 2],
      visitor: teams[i * 2 + 1],
      scheduledAt: null,
      result: null,
      nextMatchId: null, // se enlaza después
    })
  }

  rounds.push({
    label: getRoundLabel(currentMatchCount),
    matches: firstRoundMatches,
  })

  // ── Rondas siguientes ──
  currentMatchCount = currentMatchCount / 2
  while (currentMatchCount >= 1) {
    const matches: Match[] = []
    for (let i = 0; i < currentMatchCount; i++) {
      matches.push({
        id: `round-${roundIndex}_match-${i}`,
        position: i,
        local: null,
        visitor: null,
        scheduledAt: null,
        result: null,
        nextMatchId: null,
      })
    }
    rounds.push({
      label: getRoundLabel(currentMatchCount),
      matches,
    })
    roundIndex++
    currentMatchCount = currentMatchCount / 2
  }

  // ── Enlazar nextMatchId entre rondas ──
  for (let r = 0; r < rounds.length - 1; r++) {
    const currentRound = rounds[r]
    const nextRound = rounds[r + 1]
    currentRound.matches.forEach((match, idx) => {
      match.nextMatchId = nextRound.matches[Math.floor(idx / 2)].id
    })
  }

  return rounds
}

export function generateRoundRobinBracket(teams: Team[]): Round[] {
  const newTeams: Round[] = []

  for (let i = 0; i < teams.length; i++) {
    const matches: Match[] = []

    for (let j = 0; j < teams.length; j++) {
      matches.push({
        id: `round-${i}_match-${j}`,
        position: 0,
        local: teams[i],
        visitor: teams[j],
        nextMatchId: null,
        result: null,
        scheduledAt: null,
      })
    }

    newTeams.push({ id: `round-${i}`, label: '', matches: matches })
  }

  return newTeams
}

// ─── Helpers de lectura ───────────────────────────────────────────────────────

/**
 * Actualiza la fecha de un partido en cualquier ronda.
 * Devuelve un nuevo arreglo de rondas (inmutable).
 */
export function updateMatchDate(rounds: Round[], matchId: string, date: Date | null): Round[] {
  return rounds.map((round) => ({
    ...round,
    matches: round.matches.map((m) => (m.id === matchId ? { ...m, scheduledAt: date } : m)),
  }))
}
