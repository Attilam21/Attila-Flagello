import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { VertexAI } from '@google-cloud/vertexai';
import { parseByType } from './efb_parse.js';
import type { EfbUploadType, OcrDoc } from './efb_types.js';

initializeApp();
const db = getFirestore();
const client = new ImageAnnotatorClient();

const PROJECT = process.env.GCLOUD_PROJECT!;
const LOCATION = 'europe-west1'; // allinea a hosting+functions
const vertex = new VertexAI({ project: PROJECT, location: LOCATION });
const gemini = vertex.getGenerativeModel({ model: 'gemini-1.5-pro' });

export const onImageUpload = onObjectFinalized(
  {
    region: 'europe-west1',
  },
  async (object: any) => {
    const { name: storagePath, bucket, contentType, metadata = {} } = object;
    if (!storagePath || !contentType?.startsWith('image/')) return;

    const uid = metadata.uid as string | undefined;
    const type = metadata.type as EfbUploadType | undefined;
    const matchId = (metadata.matchId as string | undefined) || 'current';
    if (!uid || !type) return;

    // 1) OCR primario (Vision)
    const gcsUri = `gs://${bucket}/${storagePath}`;
    const [res] = await client.documentTextDetection(gcsUri);
    const rawText = res.fullTextAnnotation?.text || '';
    const blocks = res.textAnnotations || [];

    // 2) Parsing base (euristiche + dizionari eFootball)
    const parsed = parseByType(type, rawText);
    const baseFields = parsed.fields || {};
    const needsReviewBase = parsed.needsReview;

    // 3) Arricchimento Gemini (immagine + rawText + baseFields)
    const parts: any[] = [
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
          data: Buffer.from(
            `https://storage.googleapis.com/${bucket}/${encodeURIComponent(storagePath)}`
          ).toString('base64'),
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
    try {
      const resp = await gemini.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1200 },
      });
      const txt =
        resp.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const j = JSON.parse(txt);
      if (j?.fields) geminiFields = { ...baseFields, ...j.fields };
      if (j?.meta) meta = { ...meta, ...j.meta };
    } catch (e) {
      logger.warn('Gemini enrichment failed', e);
    }

    // 4) Salva RAW OCR + parsed
    const ocrRef = db.collection(`users/${uid}/ocr`).doc();
    const ocrDoc: OcrDoc = {
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
    } else if (type === 'MATCH_STATS') {
      await base
        .collection('stats')
        .doc('main')
        .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    } else if (type === 'VOTES') {
      await base
        .collection('votes')
        .doc('main')
        .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    } else if (type === 'HEATMAP') {
      await base
        .collection('heatmap')
        .doc('main')
        .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    } else if (type === 'OPPONENT_FORMATION') {
      await db
        .doc(`users/${uid}/opponent/${matchId}`)
        .set({ ...geminiFields, _updatedAt: new Date() }, { merge: true });
    }
  }
);
