# 🤖 Setup Gemini AI per eFootballLab

## ⚠️ ERRORE ATTUALMENTE PRESENTE
**Generative Language API non è abilitata** nel progetto Google Cloud.

## 🔧 RISOLUZIONE IMMEDIATA

### 1. **Abilita Generative Language API**
Vai su questo link e clicca **"ENABLE"**:
```
https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=814206807853
```

### 2. **Passaggi dettagliati:**
1. Apri il link sopra nel browser
2. Assicurati di essere loggato con l'account Google corretto
3. Clicca il pulsante **"ENABLE"** (blu)
4. Attendi 2-3 minuti per la propagazione
5. Torna all'applicazione e riprova

### 3. **Verifica abilitazione:**
- Vai su [Google Cloud Console](https://console.cloud.google.com/)
- Seleziona il progetto `attila-475314` (ID: 814206807853)
- Vai su **"APIs & Services" > "Library"**
- Cerca **"Generative Language API"**
- Dovrebbe risultare **"ENABLED"**

## 🚀 ALTERNATIVA: Usa API Key Diretta

Se hai problemi con l'abilitazione dell'API, puoi:

1. **Crea un nuovo progetto Google Cloud:**
   - Vai su [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuovo progetto
   - Abilita Generative Language API

2. **Genera una nuova API Key:**
   - Vai su **"APIs & Services" > "Credentials"**
   - Clicca **"Create Credentials" > "API Key"**
   - Copia la nuova API key

3. **Aggiorna il file `.env.local`:**
   ```
   VITE_GEMINI_API_KEY=la_tua_nuova_api_key_qui
   ```

## 🔍 DEBUGGING

### Errori comuni:
- **403 Forbidden**: API non abilitata
- **SERVICE_DISABLED**: Servizio disabilitato nel progetto
- **Invalid API Key**: Chiave API non valida o scaduta

### Log di debug:
Apri la console del browser (F12) per vedere i log dettagliati:
- `🤖 Gemini: Analizzando immagine...`
- `❌ Gemini Error: ...`
- `✅ Elaborazione Gemini completata...`

## 📞 SUPPORTO

Se continui ad avere problemi:
1. Verifica che l'account Google abbia i permessi sul progetto
2. Controlla che il progetto `814206807853` sia attivo
3. Assicurati che la fatturazione sia abilitata (necessaria per Gemini AI)

## ✅ TEST

Dopo aver abilitato l'API:
1. Vai su https://attila-475314.web.app
2. Naviga su "Carica Ultima Partita"
3. Carica 4 immagini di una partita
4. Clicca "Elabora con Gemini AI"
5. Dovresti vedere l'analisi in tempo reale

---

**Nota**: Gemini AI è un servizio a pagamento. Assicurati di avere un account Google Cloud con fatturazione abilitata.
