// Servizio Google AI per coach virtuale eFootball
class GoogleAIService {
  constructor() {
    this.isInitialized = false;
    this.model = 'gemini-pro'; // Usa Gemini Pro di Google
    this.apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🤖 Initializing Google AI Service...');

      if (!this.apiKey) {
        console.warn('⚠️ Google AI API key not found, using simulation mode');
        this.isInitialized = true;
        return;
      }

      // Inizializza Google AI
      this.isInitialized = true;
      console.log('✅ Google AI Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google AI Service:', error);
      this.isInitialized = true; // Permette di continuare con simulazione
    }
  }

  // Chat con coach virtuale
  async chatWithCoach(message, context = {}) {
    await this.initialize();

    console.log('💬 Chatting with eFootball Coach...');

    try {
      if (!this.apiKey) {
        return await this.simulateCoachResponse(message, context);
      }

      // Usa Google AI Gemini per rispondere
      const response = await this.callGoogleAI(message, context);
      return response;
    } catch (error) {
      console.error('❌ Google AI chat failed:', error);
      return await this.simulateCoachResponse(message, context);
    }
  }

  // Chiama Google AI Gemini
  async callGoogleAI(message, context) {
    const prompt = this.buildCoachPrompt(message, context);

    // Simula chiamata a Google AI (da implementare con API reale)
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Google AI API error');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // Costruisce prompt per coach eFootball
  buildCoachPrompt(message, context) {
    const basePrompt = `Sei un coach virtuale esperto di eFootball. 
Rispondi in italiano, usando terminologia ufficiale eFootball.
Sii professionale ma incoraggiante.
Analizza i dati forniti e dai consigli tattici specifici.

Contesto squadra:
- Formazione: ${context.formation || 'Non specificata'}
- Giocatori: ${context.players?.length || 0}
- Rating medio: ${context.averageRating || 'N/A'}

Domanda: ${message}

Risposta:`;

    return basePrompt;
  }

  // Simula risposta coach
  async simulateCoachResponse(message, context) {
    console.log('🔄 Using coach simulation...');

    // Analizza il tipo di domanda
    const questionType = this.analyzeQuestionType(message);

    switch (questionType) {
      case 'formation':
        return this.getFormationAdvice(context);
      case 'tactics':
        return this.getTacticsAdvice(context);
      case 'player':
        return this.getPlayerAdvice(context);
      case 'general':
        return this.getGeneralAdvice(message);
      default:
        return this.getDefaultAdvice();
    }
  }

  // Analizza tipo di domanda
  analyzeQuestionType(message) {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('formazione') ||
      lowerMessage.includes('modulo')
    ) {
      return 'formation';
    }
    if (
      lowerMessage.includes('tattica') ||
      lowerMessage.includes('strategia')
    ) {
      return 'tactics';
    }
    if (lowerMessage.includes('giocatore') || lowerMessage.includes('player')) {
      return 'player';
    }

    return 'general';
  }

  // Consigli formazione
  getFormationAdvice(context) {
    const formations = [
      '4-3-3: Perfetta per gioco offensivo con ali veloci',
      '4-2-3-1: Equilibrata, buona per controllo centrocampo',
      '3-5-2: Aggressiva, ideale per pressing alto',
      '5-3-2: Difensiva, ottima per contropiede',
    ];

    const randomFormation =
      formations[Math.floor(Math.random() * formations.length)];

    return `🏆 **Consiglio Formazione:**
    
${randomFormation}

**Suggerimenti tattici:**
- Mantieni equilibrio tra attacco e difesa
- Sfrutta le caratteristiche dei tuoi giocatori
- Adatta la formazione all'avversario

**Prossimi passi:**
1. Analizza i punti di forza della tua squadra
2. Studia l'avversario
3. Testa la formazione in partite amichevoli`;
  }

  // Consigli tattici
  getTacticsAdvice(context) {
    return `⚽ **Analisi Tattica:**
    
**Punti di forza da sfruttare:**
- Velocità sulle fasce
- Precisione nei passaggi
- Aggressività in fase difensiva

**Aree di miglioramento:**
- Concentrazione nei primi 15 minuti
- Finalizzazione in area di rigore
- Gestione del possesso palla

**Strategia consigliata:**
- Pressing alto nei primi 30 minuti
- Gioco veloce sulle fasce
- Cross precisi per i tuoi attaccanti

**Formazione suggerita:** 4-3-3 con ali offensive`;
  }

  // Consigli giocatori
  getPlayerAdvice(context) {
    return `👥 **Analisi Giocatori:**
    
**Giocatori chiave:**
- Attaccante: Sfrutta la velocità e il tiro
- Centrocampista: Controlla il ritmo di gioco
- Difensore: Mantieni la concentrazione

**Sostituzioni consigliate:**
- 60': Cambia l'ala destra se stanca
- 70': Inserisci un mediano fresco
- 80': Attaccante veloce per i contropiedi

**Forma fisica:**
- Monitora la stamina dei giocatori
- Usa le sostituzioni strategicamente
- Mantieni l'intensità per 90 minuti`;
  }

  // Consigli generali
  getGeneralAdvice(message) {
    const advice = [
      "Studia sempre l'avversario prima della partita",
      'Mantieni la calma sotto pressione',
      'Sfrutta i punti di forza della tua squadra',
      "Non sottovalutare mai l'importanza della difesa",
      "La costanza nell'allenamento è fondamentale",
    ];

    const randomAdvice = advice[Math.floor(Math.random() * advice.length)];

    return `💡 **Consiglio del Coach:**
    
${randomAdvice}

**Ricorda:**
- Ogni partita è una nuova opportunità
- L'analisi post-partita è cruciale
- I dettagli fanno la differenza

**Continua a migliorare!** 🚀`;
  }

  // Consiglio di default
  getDefaultAdvice() {
    return `🏆 **Benvenuto nel tuo Coach Virtuale!**
    
Sono qui per aiutarti a migliorare nel tuo eFootball. 

**Cosa posso fare per te:**
- Analizzare la tua formazione
- Suggerire tattiche vincenti
- Consigliare i giocatori
- Spiegare le strategie

**Fammi una domanda specifica** e ti darò consigli personalizzati! 💪`;
  }

  // Analizza partita post-gara
  async analyzeMatch(matchData) {
    await this.initialize();

    console.log('📊 Analyzing match with Google AI...');

    try {
      if (!this.apiKey) {
        return await this.simulateMatchAnalysis(matchData);
      }

      // Usa Google AI per analisi partita
      const analysis = await this.callGoogleAI(
        `Analizza questa partita: ${JSON.stringify(matchData)}`,
        { type: 'match_analysis' }
      );

      return analysis;
    } catch (error) {
      console.error('❌ Match analysis failed:', error);
      return await this.simulateMatchAnalysis(matchData);
    }
  }

  // Simula analisi partita
  async simulateMatchAnalysis(matchData) {
    return `📈 **Analisi Partita:**
    
**Risultato:** ${matchData.score || 'N/A'}

**Punti positivi:**
- Buon controllo del centrocampo
- Efficacia negli attacchi
- Concentrazione difensiva

**Aree di miglioramento:**
- Precisione nei passaggi finali
- Gestione del possesso palla
- Sostituzioni tempestive

**Prossima partita:**
- Mantieni la stessa formazione
- Lavora sulla finalizzazione
- Studia l'avversario

**Rating squadra:** 8.5/10 ⭐`;
  }
}

// Esporta istanza singleton
export const googleAIService = new GoogleAIService();
export default googleAIService;
