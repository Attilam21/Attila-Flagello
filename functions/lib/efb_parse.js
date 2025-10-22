import { ROLE_ALIASES } from "./efb_dict.js";
// Utility
const num = (s) => {
    if (s == null)
        return null;
    const m = String(s).replace(",", ".").match(/-?\d+(\.\d+)?/);
    return m ? Number(m[0]) : null;
};
const percent = (s) => {
    const v = num(s);
    return v == null ? null : Math.round(v);
};
export function normalizeRole(raw) {
    if (!raw)
        return undefined;
    const key = raw.trim().toUpperCase();
    return ROLE_ALIASES[key] || raw;
}
export function parseRoster(rawText) {
    // euristica leggera per demo: cerca righe "Nome … OVR … RUOLO"
    // NB: Gemini arricchirà questo output
    const players = [];
    const lines = rawText.split(/\n+/);
    for (const ln of lines) {
        // prova a prendere "Nome" + OVR + ruolo
        const m = ln.match(/([A-Za-zÀ-ÿ'`. -]{3,})\s+(\d{2,3})\s+([A-Z]{2,3})/);
        if (m) {
            players.push({
                name: m[1].trim(),
                ovr: Number(m[2]),
                role: normalizeRole(m[3])
            });
        }
    }
    return { players };
}
export function parseMatchStats(rawText) {
    const out = {};
    // split in due colonne per euristica (sinistra/destra)
    // semplice: prendi tutte le righe chiave → prendi due numeri accanto
    const getPair = (label) => {
        const re = new RegExp(`${label}.*?(\\d+%?)\\D+(\\d+%?)`, "i");
        const m = rawText.match(re);
        if (!m)
            return { us: null, oppo: null };
        const isPerc = /%/.test(m[1] + m[2]);
        return isPerc
            ? { us: percent(m[1]), oppo: percent(m[2]) }
            : { us: num(m[1]), oppo: num(m[2]) };
    };
    out.poss = getPair("Possesso di palla|Possesso palla");
    out.tiri = getPair("Tiri totali|Tiri");
    out.tiriporta = getPair("Tiri in porta");
    out.passaggi = getPair("Passaggi(?! riusciti)");
    out.passaggiRiusciti = getPair("Passaggi riusciti");
    out.corner = getPair("Calci d'angolo|Corner");
    out.falli = getPair("Falli");
    out.contrasti = getPair("Contrasti");
    out.parate = getPair("Parate");
    // risultato 6–1 ecc.
    const r = rawText.match(/(\d+)\s*[–-]\s*(\d+)/);
    if (r)
        out.result = { us: num(r[1]), oppo: num(r[2]) };
    // nomi squadra (grezzo, Gemini li pulirà)
    const teamLine = rawText.split("\n")[0] || "";
    const tm = teamLine.match(/^(.+?)\s+[–-]\s+(.+?)\s+\d/);
    if (tm) {
        out.teamUser = tm[1].trim();
        out.teamOppo = tm[2].trim();
    }
    return out;
}
export function parseVotes(rawText) {
    const votes = [];
    const rx = /([A-Za-zÀ-ÿ'`. -]{3,})\s+(\d+(?:\.\d)?)/g;
    let m;
    while ((m = rx.exec(rawText))) {
        votes.push({ name: m[1].trim(), vote: Number(m[2]) });
    }
    return { votes };
}
export function parseHeatmap(rawText) {
    // cerca "46% 45% 9%" ecc.
    const rx = /(\d+)%\D+(\d+)%\D+(\d+)%/;
    const m = rawText.match(rx);
    const attackAreas = m
        ? { left: Number(m[1]), center: Number(m[2]), right: Number(m[3]) }
        : undefined;
    return { attackAreas };
}
export function parseOpponent(rawText) {
    // i marker li metti dal client; qui potremmo solo estrarre note base
    return { image: "", notes: "" };
}
export function parseByType(type, rawText) {
    try {
        if (type === "ROSTER") {
            const fields = parseRoster(rawText);
            return { fields, needsReview: fields.players.length === 0, errors: [] };
        }
        if (type === "MATCH_STATS") {
            const fields = parseMatchStats(rawText);
            const anyNull = Object.values(fields).some((v) => {
                if (v && typeof v === "object" && "us" in v && "oppo" in v) {
                    return v.us == null || v.oppo == null;
                }
                return false;
            });
            return { fields, needsReview: anyNull, errors: [] };
        }
        if (type === "VOTES") {
            const fields = parseVotes(rawText);
            return { fields, needsReview: fields.votes.length === 0, errors: [] };
        }
        if (type === "HEATMAP") {
            const fields = parseHeatmap(rawText);
            return { fields, needsReview: !fields.attackAreas, errors: [] };
        }
        if (type === "OPPONENT_FORMATION") {
            const fields = parseOpponent(rawText);
            return { fields, needsReview: false, errors: [] };
        }
        return { fields: {}, needsReview: true, errors: ["Unknown type"] };
    }
    catch (e) {
        return { fields: {}, needsReview: true, errors: [String(e?.message || e)] };
    }
}
//# sourceMappingURL=efb_parse.js.map