# 🏆 eFootballLab - eFootball Semplificato (Firebase + Vision)

Sistema integrato per l'analisi OCR dei tabellini eFootball utilizzando Firebase (Hosting/Auth/Firestore/Storage) + Google Vision API. Opzionale: arricchimento con Gemini/Vertex AI.

## 🚀 Funzionalità

- Autenticazione (Email/Password)
- Upload immagini match e giocatori
- OCR automatico via Cloud Functions (trigger Storage)
- Parsing strutturato (stats, voti, heatmap, roster)
- Salvataggio su Firestore e UI realtime

## 📋 Prerequisiti

1. Node.js v18+ e npm
2. Firebase Project (es. `attila-475314`)
3. Vision API abilitata
4. Firebase CLI installata

## ⚙️ Setup

### 1) Configurazione Firebase

```bash
npx firebase-tools login
npx firebase-tools use attila-475314
# Abilita Vision API da console GCP
```

### 2) Variabili Ambiente (.env.local)

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=attila-475314
VITE_FIREBASE_STORAGE_BUCKET=attila-475314.appspot.com
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
# Opzionale Gemini
VITE_GEMINI_API_KEY=xxx
```

### 3) Installazione

```bash
# Client
npm install
# Cloud Functions
cd functions && npm install && cd ..
```

### 4) Sviluppo e Deploy

```bash
npm run dev                  # avvio UI
cd functions && npm run build  # build funzioni
npm run deploy:functions     # deploy funzioni
npm run deploy:hosting       # deploy hosting
```

## 🏗️ Architettura (semplificata)

```
Auth → Upload (Storage users/{uid}/images/type_timestamp.jpg)
            ↓ (trigger)
Cloud Function onFinalize (Vision OCR + parse + optional Gemini)
            ↓
Firestore users/{uid}/matches/{matchId}/{stats|votes|heatmap}/main
           users/{uid}/roster
           users/{uid}/ocr/{docId}
            ↓
React UI (listener realtime)
```

## 📁 Struttura rilevante

```
src/
  pages/ (Home, Login, Rosa, CaricaUltimaPartita, StatisticheAvanzate)
  services/ (firebaseClient, storageWrapper, uploadHelper, firestoreWrapper)
  components/ (ui/*, rosa/*)
functions/
  src/ (ocr_onImageUpload.ts, efb_parse.ts, efb_dict.ts)
```

## 🔧 Cloud Function: onImageUpload

- Trigger: Storage onFinalize (region: europe-west1)
- Input: metadata { uid, type, matchId }
- Steps: Vision OCR → parseByType → optional Gemini → write-through su Firestore

## 🔒 Sicurezza

- Niente segreti nel repo; usare .env.local
- Regole Firestore/Storage per isolare per uid

## 🧪 Test (parser)

- Vitest per unit test su `functions/src/efb_parse.ts` (da aggiungere)

## 🚨 Troubleshooting

- Autenticazione/Permessi: `npx firebase-tools login`
- Vision API non abilitata: abilitarla su GCP
- Emulator: `npx firebase-tools emulators:start`

—
Sviluppato per eFootballLab
