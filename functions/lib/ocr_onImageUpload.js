import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { VertexAI } from '@google-cloud/vertexai';
import { parseByType } from './efb_parse.js';
initializeApp();
const db = getFirestore();
const client = new ImageAnnotatorClient();
const PROJECT = process.env.GCLOUD_PROJECT;
const LOCATION = 'europe-west1'; // allinea a hosting+functions
const ENABLE_GEMINI = (process.env.VERTEX_GEMINI_ENABLED || 'false') === 'true';
const GEMINI_MODEL = process.env.VERTEX_GEMINI_MODEL || 'gemini-1.5-flash';
const DAILY_LIMIT = parseInt(process.env.VERTEX_GEMINI_DAILY_LIMIT || '200');
const MAX_CONSEC_ERRORS = parseInt(process.env.VERTEX_GEMINI_MAX_CONSEC_ERRORS || '5');
const CIRCUIT_COOLDOWN_MIN = parseInt(process.env.VERTEX_GEMINI_CIRCUIT_COOLDOWN_MIN || '15');
let gemini = null;
const getGemini = () => {
    if (!ENABLE_GEMINI)
        return null;
    if (!gemini) {
        const vertex = new VertexAI({ project: PROJECT, location: LOCATION });
        gemini = vertex.getGenerativeModel({ model: GEMINI_MODEL });
    }
    return gemini;
};
const getDateKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
async function checkAndIncreaseUsage(uid) {
    const dateKey = getDateKey();
    const usageRef = db.doc(`users/${uid}/usage/gemini_${dateKey}`);
    return await db.runTransaction(async (tx) => {
        const snap = await tx.get(usageRef);
        const now = new Date();
        let data = snap.exists ? snap.data() : {};
        const calls = Number(data.calls || 0);
        const circuitUntil = data.circuitUntil instanceof Date
            ? data.circuitUntil
            : data.circuitUntil?.toDate?.() || null;
        if (circuitUntil && circuitUntil > now) {
            return { allowed: false, reason: 'circuit_open' };
        }
        if (calls >= DAILY_LIMIT) {
            return { allowed: false, reason: 'daily_limit' };
        }
        tx.set(usageRef, {
            dateKey,
            calls: calls + 1,
            lastCallAt: now,
        }, { merge: true });
        return { allowed: true };
    });
}
async function recordGeminiError(uid) {
    try {
        const dateKey = getDateKey();
        const usageRef = db.doc(`users/${uid}/usage/gemini_${dateKey}`);
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(usageRef);
            const now = new Date();
            let data = snap.exists ? snap.data() : {};
            const errors = Number(data.errors || 0) + 1;
            const updates = { errors, lastErrorAt: now };
            if (errors >= MAX_CONSEC_ERRORS) {
                const until = new Date(now.getTime() + CIRCUIT_COOLDOWN_MIN * 60000);
                updates.circuitUntil = until;
                updates.errors = 0; // reset counter after opening circuit
            }
            tx.set(usageRef, updates, { merge: true });
        });
    }
    catch (e) {
        logger.warn('recordGeminiError failed', e);
    }
}
export const onImageUpload = onObjectFinalized({
    region: 'europe-west1',
}, async (object) => {
    const { name: storagePath, bucket, contentType, metadata = {} } = object;
    if (!storagePath || !contentType?.startsWith('image/'))
        return;
    // Evita immagini enormi per arricchimento costoso
    const sizeBytes = Number(object.size || 0);
    const uid = metadata.uid;
    const type = metadata.type;
    const matchId = metadata.matchId || 'current';
    if (!uid || !type)
        return;
    // Evita duplicati: se abbiamo già OCR per lo stesso storagePath, stop
    try {
        const dupSnap = await db
            .collection(`users/${uid}/ocr`)
            .where('source.storagePath', '==', storagePath)
            .limit(1)
            .get();
        if (!dupSnap.empty) {
            logger.info('Duplicate OCR event ignored for', storagePath);
            return;
        }
    }
    catch (e) {
        logger.warn('Duplicate check failed (continuing):', e);
    }
    // 1) OCR primario (Vision)
    const gcsUri = `gs://${bucket}/${storagePath}`;
    const [res] = await client.documentTextDetection(gcsUri);
    const rawText = res.fullTextAnnotation?.text || '';
    const blocks = res.textAnnotations || [];
    // 2) Parsing base (euristiche + dizionari eFootball)
    const parsed = parseByType(type, rawText);
    const baseFields = parsed.fields || {};
    const needsReviewBase = parsed.needsReview;
    // 3) Arricchimento Gemini (immagine + rawText + baseFields) - opzionale e solo per tipi selezionati
    const shouldEnrich = ENABLE_GEMINI &&
        (type === 'MATCH_STATS' || type === 'VOTES') &&
        sizeBytes <= 4 * 1024 * 1024; // max 4MB per prudenza costi
    const parts = [
        {
            text: `
Sei un analista eFootball. Correggi/completa l'OCR di schermate ufficiali:
- Usa terminologia ufficiale (ruoli, build, booster, skill, stili IA, intesa).
- Uniforma alle chiavi JSON del tipo ${type}.
- Se una voce non è certa, lasciala null e imposta needsReview.
Ritorna un JSON: {"fields":{...},"meta":{"detectedLanguage":"it","confidence":0.xx}}.
`,
        },
        // Passo l'immagine come URI list per non scaricarla in tmp
        {
            inlineData: {
                mimeType: 'text/uri-list',
                data: Buffer.from(`https://storage.googleapis.com/${bucket}/${encodeURIComponent(storagePath)}`).toString('base64'),
            },
        },
        { text: `RAW_TEXT:\n${rawText}` },
        { text: `BASE_FIELDS:\n${JSON.stringify(baseFields)}` },
    ];
    let geminiFields = baseFields;
    let meta = {
        detectedLanguage: 'it',
        confidence: needsReviewBase ? 0.6 : 0.8,
    };
    if (shouldEnrich) {
        try {
            const model = getGemini();
            if (model) {
                const rl = await checkAndIncreaseUsage(uid);
                if (!rl.allowed) {
                    logger.warn('Gemini enrichment skipped due to rate control', rl);
                }
                else {
                    const resp = await model.generateContent({
                        contents: [{ role: 'user', parts }],
                        generationConfig: { temperature: 0.2, maxOutputTokens: 1200 },
                    });
                    const txt = resp.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                    const j = JSON.parse(txt);
                    if (j?.fields)
                        geminiFields = { ...baseFields, ...j.fields };
                    if (j?.meta)
                        meta = { ...meta, ...j.meta };
                }
            }
        }
        catch (e) {
            logger.warn('Gemini enrichment failed', e);
            await recordGeminiError(uid);
        }
    }
    else {
        logger.info('Gemini enrichment skipped', {
            ENABLE_GEMINI,
            type,
            sizeBytes,
        });
    }
    // 4) Salva RAW OCR + parsed
    const ocrRef = db.collection(`users/${uid}/ocr`).doc();
    const ocrDoc = {
        uid,
        type,
        source: {
            storagePath,
            downloadURL: `https://storage.googleapis.com/${bucket}/${encodeURIComponent(storagePath)}`,
        },
        vision: {
            engine: 'cloud-vision.documentTextDetection',
            rawText,
            blocks,
            langHints: ['it'],
        },
        fields: geminiFields,
        meta: { ...meta, matchId },
        status: {
            parsed: true,
            needsReview: needsReviewBase || (meta.confidence ?? 0) < 0.75,
            errors: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await ocrRef.set(ocrDoc);
    // 5) Write-through sui documenti operativi (per la tua dashboard)
    const base = db.doc(`users/${uid}/matches/${matchId}`);
    if (type === 'ROSTER') {
        // Documento stabile per riepilogo roster
        await db
            .doc(`users/${uid}/roster/current`)
            .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    }
    else if (type === 'MATCH_STATS') {
        await base
            .collection('stats')
            .doc('main')
            .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    }
    else if (type === 'VOTES') {
        await base
            .collection('votes')
            .doc('main')
            .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    }
    else if (type === 'HEATMAP') {
        await base
            .collection('heatmap')
            .doc('main')
            .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    }
    else if (type === 'OPPONENT_FORMATION') {
        await db
            .doc(`users/${uid}/opponent/${matchId}`)
            .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    }
});
//# sourceMappingURL=ocr_onImageUpload.js.map