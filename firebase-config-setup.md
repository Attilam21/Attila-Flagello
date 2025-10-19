# 🔥 CONFIGURAZIONE FIREBASE - ISTRUZIONI

## 📋 **PASSI DA SEGUIRE:**

### 1. **Crea il file `.env.local`**
Crea manualmente un file chiamato `.env.local` nella root del progetto con questo contenuto:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBxD9-4kFNrY2136M5M-Ht7kXJ37LhzeJI
VITE_FIREBASE_AUTH_DOMAIN=attila-475314.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=attila-475314
VITE_FIREBASE_STORAGE_BUCKET=attila-475314.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=814206807853
VITE_FIREBASE_APP_ID=1:814206807853:web:256884e64c9d867509eda4
VITE_FIREBASE_MEASUREMENT_ID=G-Y061BQJMRT
```

### 2. **Verifica la configurazione**
Dopo aver creato il file, testa la configurazione:

```bash
npm run dev
```

### 3. **Controlla la console**
- Apri il browser su `http://localhost:5173`
- Controlla la console per eventuali errori Firebase
- Verifica che l'autenticazione funzioni

## 🔧 **CONFIGURAZIONE FIREBASE PROJECT**

### **Project ID**: `attila-475314`
### **Storage Bucket**: `attila-475314.firebasestorage.app`
### **Auth Domain**: `attila-475314.firebaseapp.com`

## 📱 **SERVIZI ATTIVI:**
- ✅ Authentication
- ✅ Firestore Database  
- ✅ Storage
- ✅ Cloud Functions

## 🚀 **TEST RAPIDO:**
1. Avvia il server: `npm run dev`
2. Vai su `http://localhost:5173`
3. Prova a registrarti/loggarti
4. Controlla che i dati vengano salvati su Firestore

## ⚠️ **NOTA SICUREZZA:**
Il file `.env.local` è già nel `.gitignore`, quindi le tue credenziali non verranno committate su Git.

