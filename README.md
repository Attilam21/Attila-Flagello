# 🏆 eFootballLab - OCR Firebase Integration

Sistema integrato per l'analisi OCR dei tabellini eFootball utilizzando Firebase + Google Vision API.

## 🚀 Funzionalità

- **Autenticazione**: Login/Registrazione Email/Password
- **Upload immagini**: Carica screenshot dei tabellini eFootball
- **OCR automatico**: Google Vision API estrae testo dalle immagini
- **Storage Firebase**: Immagini salvate su Firebase Storage
- **Cloud Functions**: Trigger automatico OCR al caricamento
- **Firestore**: Risultati OCR salvati in tempo reale
- **UI React**: Interfaccia moderna con TailwindCSS
- **Protezione route**: Accesso solo per utenti autenticati

## 📋 Prerequisiti

1. **Node.js** v18+ e npm
2. **Firebase Project** con PROJECT_ID: `attila-475314`
3. **Google Vision API** attivata
4. **Firebase CLI** installato

## ⚙️ Setup

### 1. Configurazione Firebase

```bash
# Login Firebase
npx firebase-tools login

# Seleziona progetto
npx firebase-tools use attila-475314

# Attiva Vision API
# Vai su: https://console.cloud.google.com/apis/library/vision.googleapis.com
```

### 2. Variabili Ambiente

Crea `.env.local` con i tuoi valori Firebase:

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=attila-475314
VITE_FIREBASE_STORAGE_BUCKET=attila-475314.appspot.com
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
```

### 3. Installazione Dipendenze

```bash
# Dipendenze client
npm install

# Dipendenze Cloud Functions
cd functions
npm install
cd ..
```

### 4. Deploy Cloud Functions

```bash
# Deploy functions
npx firebase-tools deploy --only functions

# Oppure usa emulator per sviluppo
npx firebase-tools emulators:start
```

## 🎯 Utilizzo

### Avvio Sviluppo

```bash
npm run dev
```

Apri http://localhost:5173/

### Flusso OCR

1. **Vai su "⚽ Match OCR"**
2. **Inserisci Match ID** (es. data del match)
3. **Seleziona screenshot** del tabellino eFootball
4. **Clicca "Carica su Firebase"**
5. **Attendi elaborazione** (automatica)
6. **Visualizza testo OCR** in tempo reale

## 🏗️ Architettura

```
🔐 Email/Password Auth
    ↓
📸 Screenshot Upload (protezione auth)
    ↓
🗄️ Firebase Storage (matches/{userId}/{timestamp}.png)
    ↓
⚡ Cloud Function Trigger (onFinalize)
    ↓
🔍 Google Vision OCR API
    ↓
📊 Firestore (matches/{userId}/ocr/{autoId})
    ↓
🖥️ React UI (Real-time listener)
```

## 📁 Struttura Progetto

```
src/
├── pages/
│   ├── Login.jsx          # Pagina login/registrazione
│   └── Match.jsx          # Pagina upload e visualizzazione OCR
├── services/
│   └── firebaseClient.js  # Client Firebase + auth + helpers
└── App.jsx                # Router principale con protezione auth

functions/
├── index.js               # Cloud Functions + Vision OCR
└── package.json           # Dipendenze functions

firebase.json              # Configurazione Firebase
tailwind.config.js         # Configurazione TailwindCSS
```

## 🔧 Cloud Functions

### `onImageUpload`

- **Trigger**: Firebase Storage `onFinalize`
- **Input**: Immagine caricata su `matches/{userId}/`
- **Processo**: 
  1. Estrae userId dal path
  2. Chiama Google Vision OCR
  3. Salva risultato su Firestore
  4. Aggiorna stato match

### Schema Firestore

```javascript
// matches/{userId}
{
  userId: "user123",
  filePath: "matches/user123/1697654321000.png",
  status: "processed", // uploaded → processing → processed
  createdAt: timestamp,
  lastOCRAt: timestamp,
  ocrCount: 1
}

// matches/{userId}/ocr/{autoId}
{
  userId: "user123",
  filePath: "matches/user123/1697654321000.png",
  text: "Risultato 3-2\nGiocatore 1: 85'\n...",
  createdAt: timestamp,
  processingTimeMs: 1250,
  status: "completed"
}
```

## 🚨 Troubleshooting

### Errori Comuni

1. **"Failed to authenticate"**
   ```bash
   npx firebase-tools login
   ```

2. **"Vision API not enabled"**
   - Vai su: https://console.cloud.google.com/apis/library/vision.googleapis.com
   - Abilita per progetto `attila-475314`

3. **"Firebase config missing"**
   - Verifica `.env.local` con valori corretti
   - Riavvia dev server

4. **"Cloud Function timeout"**
   - Aumenta timeout in `firebase.json`
   - Verifica credenziali service account

### Log Debug

```bash
# Logs Cloud Functions
npx firebase-tools functions:log

# Emulator logs
npx firebase-tools emulators:start --debug
```

## 📊 Performance

- **Upload**: ~2-5s per immagine
- **OCR Processing**: ~1-3s (Google Vision)
- **Firestore Write**: ~200-500ms
- **UI Update**: Real-time (<100ms)

## 🔒 Sicurezza

- ✅ Nessun segreto nel repo
- ✅ Variabili ambiente protette
- ✅ Service account esclusi da git
- ✅ Firebase Security Rules configurate

## 📈 Monitoraggio

- **Firebase Console**: Storage, Functions, Firestore
- **Google Cloud Console**: Vision API usage
- **Browser DevTools**: Network, Console logs

---

**Sviluppato per eFootballLab** 🏆
