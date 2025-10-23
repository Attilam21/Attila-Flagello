import { ROLE_ALIASES, STAT_LABELS_IT } from './efb_dict.js';
import type {
  EfbUploadType,
  MatchStatsFields,
  RosterFields,
  VotesFields,
  HeatmapFields,
  OpponentFields,
} from './efb_types.js';

// Utility
const num = (s?: string | null) => {
  if (s == null) return null;
  const m = String(s)
    .replace(',', '.')
    .match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};
const percent = (s?: string | null) => {
  const v = num(s);
  return v == null ? null : Math.round(v);
};

export function normalizeRole(raw?: string) {
  if (!raw) return undefined;
  const key = raw.trim().toUpperCase();
  return ROLE_ALIASES[key] || raw;
}

export function parseRoster(rawText: string): RosterFields {
  // euristica leggera per demo: cerca righe "Nome … OVR … RUOLO"
  // NB: Gemini arricchirà questo output
  const players: RosterFields['players'] = [];
  const lines = rawText.split(/\n+/);
  for (const ln of lines) {
    // prova a prendere "Nome" + OVR + ruolo
    const m = ln.match(/([A-Za-zÀ-ÿ'`. -]{3,})\s+(\d{2,3})\s+([A-Z]{2,3})/);
    if (m) {
      players.push({
        name: m[1].trim(),
        ovr: Number(m[2]),
        role: normalizeRole(m[3]),
      });
    }
  }
  return { players };
}

export function parseMatchStats(rawText: string): MatchStatsFields {
  const out: MatchStatsFields = {};
  // split in due colonne per euristica (sinistra/destra)
  // semplice: prendi tutte le righe chiave → prendi due numeri accanto
  const getPair = (
    label: string
  ): { us: number | null; oppo: number | null } => {
    const re = new RegExp(`${label}.*?(\\d+%?)\\D+(\\d+%?)`, 'i');
    const m = rawText.match(re);
    if (!m) return { us: null, oppo: null };
    const isPerc = /%/.test(m[1] + m[2]);
    return isPerc
      ? { us: percent(m[1]), oppo: percent(m[2]) }
      : { us: num(m[1]), oppo: num(m[2]) };
  };

  // Usa STAT_LABELS_IT per mappare le etichette
  for (const [italian, key] of Object.entries(STAT_LABELS_IT)) {
    const pair = getPair(italian);
    if (pair.us !== null || pair.oppo !== null) {
      (out as any)[key] = pair;
    }
  }

  // risultato 6–1 ecc.
  const r = rawText.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (r) out.result = { us: num(r[1]), oppo: num(r[2]) };

  // nomi squadra (grezzo, Gemini li pulirà)
  const teamLine = rawText.split('\n')[0] || '';
  const tm = teamLine.match(/^(.+?)\s+[–-]\s+(.+?)\s+\d/);
  if (tm) {
    out.teamUser = tm[1].trim();
    out.teamOppo = tm[2].trim();
  }
  return out;
}

export function parseVotes(rawText: string): VotesFields {
  const votes: VotesFields['votes'] = [];
  const rx = /([A-Za-zÀ-ÿ'`. -]{3,})\s+(\d+(?:\.\d)?)/g;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(rawText))) {
    votes.push({ name: m[1].trim(), vote: Number(m[2]) });
  }
  return { votes };
}

export function parseHeatmap(rawText: string): HeatmapFields {
  // cerca "46% 45% 9%" ecc.
  const rx = /(\d+)%\D+(\d+)%\D+(\d+)%/;
  const m = rawText.match(rx);
  const attackAreas = m
    ? { left: Number(m[1]), center: Number(m[2]), right: Number(m[3]) }
    : undefined;
  return { attackAreas };
}

export function parseOpponent(rawText: string): OpponentFields {
  // i marker li metti dal client; qui potremmo solo estrarre note base
  return { image: '', notes: '' };
}

export function parseByType(
  type: EfbUploadType,
  rawText: string
): { fields: any; needsReview: boolean; errors: string[] } {
  try {
    if (type === 'ROSTER') {
      const fields = parseRoster(rawText);
      return { fields, needsReview: fields.players.length === 0, errors: [] };
    }
    if (type === 'MATCH_STATS') {
      const fields = parseMatchStats(rawText);
      const anyNull = Object.values(fields).some((v: any) => {
        if (v && typeof v === 'object' && 'us' in v && 'oppo' in v) {
          return v.us == null || v.oppo == null;
        }
        return false;
      });
      return { fields, needsReview: anyNull, errors: [] };
    }
    if (type === 'VOTES') {
      const fields = parseVotes(rawText);
      return { fields, needsReview: fields.votes.length === 0, errors: [] };
    }
    if (type === 'HEATMAP') {
      const fields = parseHeatmap(rawText);
      return { fields, needsReview: !fields.attackAreas, errors: [] };
    }
    if (type === 'OPPONENT_FORMATION') {
      const fields = parseOpponent(rawText);
      return { fields, needsReview: false, errors: [] };
    }
    return { fields: {}, needsReview: true, errors: ['Unknown type'] };
  } catch (e: any) {
    return { fields: {}, needsReview: true, errors: [String(e?.message || e)] };
  }
}
