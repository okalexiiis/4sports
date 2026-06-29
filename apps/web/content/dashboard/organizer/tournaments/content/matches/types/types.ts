// ─── Entidades base ────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  /** URL opcional para logo/avatar */
  logoUrl?: string;
}

export interface MatchResult {
  localScore: number;
  visitorScore: number;
}

export interface Match {
  id: string;
  /** Índice dentro de la ronda (0-based) */
  position: number;
  local: Team | null;
  visitor: Team | null;
  scheduledAt: Date | null;
  result: MatchResult | null;
  /** ID del partido de la siguiente ronda al que alimenta este resultado */
  nextMatchId: string | null;
}

export interface Round {
  id: string;
  label: string; // ej. "Cuartos de final", "Semifinal", "Final"
  matches: Match[];
}

// ─── Props del componente principal ───────────────────────────────────────────

export type BracketMode = "setup" | "registration";

export interface EliminationBracketProps {
  teams: Team[];
  mode: BracketMode;
  /** Callback al presionar "Registrar partidos" (modo setup) */
  onRegister?: (rounds: Round[]) => void;
  /** Callback al presionar "Terminar torneo" (modo registration) */
  onFinish?: () => void;
  /** Callback al presionar "Ingresar resultado" en una tarjeta (modo registration) */
  onOpenResultModal?: (match: Match, roundId: string) => void;
}

// ─── Payload del formulario (modo setup, react-hook-form) ─────────────────────

export interface SetupFormValues {
  /** matchId → ISO string de fecha */
  dates: Record<string, string>;
}
