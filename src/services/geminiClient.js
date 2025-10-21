import { GoogleGenerativeAI } from '@google/generative-ai';

// Configurazione Gemini con fallback per API non abilitata
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBxD9-4kFNrY2136M5M-Ht7kXJ37LhzeJI';

if (!API_KEY) {
  console.warn('⚠️ VITE_GEMINI_API_KEY is not set. Gemini AI will not be available.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Analizza un'immagine con Gemini per estrarre statistiche sportive
 * @param {File} imageFile - File immagine da analizzare
 * @param {string} imageType - Tipo di immagine (stats, ratings, heatmap)
 * @returns {Promise<Object>} - Dati strutturati estratti
 */
export const analyzeImageWithGemini = async (imageFile, imageType) => {
  // Verifica se l'API key è configurata
  if (!API_KEY) {
    throw new Error('Gemini API Key is not configured. Please set VITE_GEMINI_API_KEY in your .env.local file.');
  }

  try {
    console.log('🤖 Gemini: Analizzando immagine', imageType, imageFile.name);

    // Converti file in base64
    const base64 = await fileToBase64(imageFile);
    
    // Prompt specifico per tipo di immagine
    const prompt = getPromptForImageType(imageType);
    
    // Configurazione per l'analisi
    const generationConfig = {
      temperature: 0.1, // Bassa temperatura per risultati consistenti
      topK: 1,
      topP: 0.8,
      maxOutputTokens: 2048,
    };

    // Analizza l'immagine
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: imageFile.type,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    console.log('🤖 Gemini: Risposta raw:', text);
    
    // Parsa la risposta JSON
    const parsedData = parseGeminiResponse(text, imageType);
    
    console.log('🤖 Gemini: Dati parsati:', parsedData);
    
    return parsedData;
    
  } catch (error) {
    console.error('❌ Gemini Error:', error);
    
    // Gestione specifica per API non abilitata
    if (error.message.includes('403') || error.message.includes('SERVICE_DISABLED')) {
      throw new Error(`Generative Language API non abilitata. Vai su https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=814206807853 per abilitarla.`);
    }
    
    throw new Error(`Errore nell'analisi con Gemini: ${error.message}`);
  }
};

/**
 * Converte un file in base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Ottiene il prompt specifico per il tipo di immagine
 */
const getPromptForImageType = (imageType) => {
  const basePrompt = `Analizza questa immagine di una partita di calcio e estrai le informazioni richieste. 
  Rispondi SOLO con un JSON valido, senza testo aggiuntivo.`;

  switch (imageType) {
    case 'stats':
      return `${basePrompt}
      
      Estrai le seguenti statistiche della partita:
      - possesso (percentuale)
      - tiri (numero totale)
      - tiriInPorta (numero)
      - passaggi (numero totale)
      - passaggiRiusciti (numero)
      - corner (numero)
      - falli (numero)
      - contrasti (numero)
      - parate (numero)
      
      Formato JSON richiesto:
      {
        "stats": {
          "possesso": 65,
          "tiri": 15,
          "tiriInPorta": 8,
          "passaggi": 450,
          "passaggiRiusciti": 380,
          "corner": 6,
          "falli": 12,
          "contrasti": 25,
          "parate": 5
        }
      }`;

    case 'ratings':
      return `${basePrompt}
      
      Estrai i voti dei giocatori. Per ogni giocatore, estrai:
      - nome (stringa)
      - voto (numero da 0 a 10)
      
      Formato JSON richiesto:
      {
        "ratings": [
          {
            "player": "Nome Giocatore",
            "rating": 7.5,
            "notes": "Estratto da Gemini",
            "isProfiled": false
          }
        ]
      }`;

    case 'heatmapOffensive':
      return `${basePrompt}
      
      Analizza la mappa di calore offensiva e identifica:
      - zone di maggiore attività
      - intensità dell'attacco
      - direzione preferita
      
      Formato JSON richiesto:
      {
        "type": "heatmap",
        "zones": ["center", "left", "right"],
        "intensities": [0.7, 0.5, 0.6],
        "direction": "right"
      }`;

    case 'heatmapDefensive':
      return `${basePrompt}
      
      Analizza la mappa di calore difensiva e identifica:
      - zone di pressione
      - intensità della difesa
      - copertura del campo
      
      Formato JSON richiesto:
      {
        "type": "heatmap",
        "zones": ["center", "left", "right"],
        "intensities": [0.6, 0.4, 0.5],
        "coverage": "high"
      }`;

    default:
      return `${basePrompt}
      
      Estrai tutte le informazioni visibili nell'immagine.
      Formato JSON richiesto:
      {
        "rawText": "testo estratto",
        "type": "unknown"
      }`;
  }
};

/**
 * Parsa la risposta di Gemini
 */
const parseGeminiResponse = (text, imageType) => {
  try {
    // Cerca JSON nella risposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Nessun JSON trovato nella risposta');
    }

    const jsonString = jsonMatch[0];
    const parsed = JSON.parse(jsonString);
    
    // Validazione del risultato
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('JSON non valido');
    }

    return parsed;
    
  } catch (error) {
    console.error('❌ Errore parsing Gemini response:', error);
    console.error('📄 Testo ricevuto:', text);
    
    // Fallback: restituisci struttura base
    return {
      error: error.message,
      rawText: text,
      type: imageType
    };
  }
};

/**
 * Analizza multiple immagini in batch
 */
export const analyzeBatchWithGemini = async (images) => {
  console.log('🤖 Gemini: Analisi batch di', images.length, 'immagini');
  
  const results = {};
  
  for (const [type, file] of Object.entries(images)) {
    if (file) {
      try {
        console.log(`🤖 Gemini: Analizzando ${type}...`);
        results[type] = await analyzeImageWithGemini(file, type);
      } catch (error) {
        console.error(`❌ Errore analisi ${type}:`, error);
        results[type] = { error: error.message };
      }
    }
  }
  
  return results;
};

export default {
  analyzeImageWithGemini,
  analyzeBatchWithGemini,
};
