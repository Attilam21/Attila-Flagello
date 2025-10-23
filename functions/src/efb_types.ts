export type EfbUploadType =
  | 'ROSTER'
  | 'MATCH_STATS'
  | 'VOTES'
  | 'HEATMAP'
  | 'OPPONENT_FORMATION';

export type EfbFields =
  | RosterFields
  | MatchStatsFields
  | VotesFields
  | HeatmapFields
  | OpponentFields;

export type RosterFields = {
  formation?: string; // es. "4-2-1-3"
  coach?: string; // es. "Martínez"
  teamName?: string; // es. "Corinthians"
  forzaTotale?: number; // es. 3245
  players: Array<{
    name: string;
    role?: string; // PT, DC, CC, SP, TRQ, TD, TS, CLD, CLS...
    ovr?: number;
    club?: string;
    build?: string; // es. Finalizzatore, Regista, Marcatore…
    booster?: string[]; // "Difesa +2", "Tiro +2", …
    skills?: string[]; // Intercettazione, Tiro a giro, Muro…
    stiliIA?: string[]; // Funambolo, Treno in corsa, Crossatore…
  }>;
};

export type MatchStatsFields = {
  teamUser?: string;
  teamOppo?: string;
  result?: { us: number | null; oppo: number | null };
  poss?: { us: number | null; oppo: number | null };
  tiri?: { us: number | null; oppo: number | null };
  tiriporta?: { us: number | null; oppo: number | null };
  passaggi?: { us: number | null; oppo: number | null };
  passaggiRiusciti?: { us: number | null; oppo: number | null };
  corner?: { us: number | null; oppo: number | null };
  falli?: { us: number | null; oppo: number | null };
  contrasti?: { us: number | null; oppo: number | null };
  parate?: { us: number | null; oppo: number | null };
};

export type VotesFields = {
  votes: Array<{ name: string; vote: number; note?: string }>;
};

export type HeatmapFields = {
  attackAreas?: { left?: number; center?: number; right?: number };
  recoveries?: Array<[number, number]>; // coordinate normalizzate 0..1
};

export type OpponentFields = {
  image: string; // url storage
  markers?: Array<{ x: number; y: number; roleGuess?: string }>;
  notes?: string;
};

export type OcrDoc = {
  uid: string;
  type: EfbUploadType;
  source: {
    storagePath: string;
    downloadURL?: string;
    width?: number;
    height?: number;
  };
  vision: {
    engine: string;
    rawText: string;
    blocks?: any[];
    langHints?: string[];
  };
  fields: EfbFields | Record<string, unknown>;
  meta: {
    matchId?: string;
    detectedLanguage?: string;
    confidence?: number;
    sideUser?: 'LEFT' | 'RIGHT' | 'UNKNOWN';
    teamNameUser?: string;
    teamNameOppo?: string;
  };
  status: { parsed: boolean; needsReview: boolean; errors: string[] };
  createdAt?: any;
  updatedAt?: any;
};
