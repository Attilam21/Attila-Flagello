// Servizio OCR reale per eFootball - senza simulazioni
import { createWorker } from 'tesseract.js';

class RealOCRService {
  constructor() {
    this.isInitialized = false;
    this.worker = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔍 Initializing REAL OCR Service...');

      this.worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(
              '🔍 Real OCR Progress:',
              Math.round(m.progress * 100) + '%'
            );
          }
        },
        tessedit_pageseg_mode: '6',
        tessedit_char_whitelist:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:()-/ ',
        preserve_interword_spaces: '1',
      });

      this.isInitialized = true;
      console.log('✅ Real OCR Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Real OCR Service:', error);
      throw error;
    }
  }

  async processImage(imageFile) {
    await this.initialize();

    console.log('🔥 Processing REAL eFootball image...');

    try {
      if (!this.worker) {
        throw new Error('OCR worker not available');
      }

      // Converti file in URL
      const imageUrl = await this.fileToUrl(imageFile);

      // OCR con timeout
      const ocrPromise = this.worker.recognize(imageUrl);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('OCR timeout')), 30000)
      );

      const result = await Promise.race([ocrPromise, timeoutPromise]);
      const text = result.data.text;

      console.log(
        '📝 Real OCR text extracted:',
        text.substring(0, 200) + '...'
      );

      // Analizza il testo per determinare il tipo
      const imageType = this.analyzeTextForImageType(text);
      const structuredData = this.parseTextToStructuredData(text, imageType);

      console.log('✅ Real OCR completed:', {
        imageType,
        textLength: text.length,
      });
      return structuredData;
    } catch (error) {
      console.error('❌ Real OCR failed:', error);
      throw error;
    }
  }

  analyzeTextForImageType(text) {
    const lowerText = text.toLowerCase();

    // Cerca pattern specifici di eFootball
    if (
      lowerText.includes('formation') ||
      lowerText.includes('tactics') ||
      lowerText.includes('lineup')
    ) {
      return 'formation_2d';
    }
    if (
      lowerText.includes('shooting') ||
      lowerText.includes('passing') ||
      lowerText.includes('dribbling') ||
      lowerText.includes('comportamento offensivo') ||
      lowerText.includes('controllo palla') ||
      lowerText.includes('finalizzazione') ||
      lowerText.includes('velocità') ||
      lowerText.includes('accelerazione')
    ) {
      return 'player_profile';
    }
    if (
      lowerText.includes('possession') ||
      lowerText.includes('shots') ||
      lowerText.includes('match')
    ) {
      return 'match_stats';
    }
    if (lowerText.includes('heatmap') || lowerText.includes('heat map')) {
      return 'heatmap';
    }

    return 'player_profile'; // Default per profili giocatori
  }

  parseTextToStructuredData(text, imageType) {
    const lines = text.split('\n').filter(line => line.trim());

    switch (imageType) {
      case 'formation_2d':
        return this.parseFormation2D(lines);
      case 'player_profile':
        return this.parsePlayerProfile(lines);
      case 'player_stats':
        return this.parsePlayerStats(lines);
      case 'match_stats':
        return this.parseMatchStats(lines);
      default:
        return this.parseGenericData(lines, imageType);
    }
  }

  parseFormation2D(lines) {
    const players = [];
    let formation = 'Unknown';

    // Cerca formazione (es. "4-3-3")
    const formationMatch = lines.find(line => /\d+-\d+-\d+/.test(line));
    if (formationMatch) {
      formation = formationMatch.trim();
    }

    // Cerca giocatori
    lines.forEach(line => {
      // Pattern per nomi giocatori
      const playerMatch = line.match(/([A-Za-z\s]+)\s*\(([A-Z]+)\)/);
      if (playerMatch) {
        players.push({
          name: playerMatch[1].trim(),
          position: playerMatch[2].trim(),
          role: this.mapPositionToRole(playerMatch[2].trim()),
        });
      }
    });

    return {
      type: 'formation_2d',
      formation: formation,
      players: players,
      rawText: text,
      confidence: 0.85,
    };
  }

  parsePlayerProfile(lines) {
    const playerData = {
      playerName: null,
      rating: null,
      position: null,
      age: null,
      nationality: null,
      team: null,
      stats: {},
      abilities: [],
      aiPlayStyles: [],
      physical: {},
      boosters: [],
      form: null,
      preferredFoot: null,
      weakFootFrequency: null,
      weakFootAccuracy: null,
      injuryResistance: null,
    };

    lines.forEach(line => {
      const trimmedLine = line.trim();

      // Nome giocatore (linea principale)
      if (
        trimmedLine.match(/^[A-Za-z\s]+$/) &&
        !trimmedLine.includes(':') &&
        trimmedLine.length > 3
      ) {
        playerData.playerName = trimmedLine;
      }

      // Rating e posizione (es. "95 CLD", "98 DC")
      const ratingMatch = trimmedLine.match(/(\d+)\s+([A-Z]{2,3})/);
      if (ratingMatch) {
        playerData.rating = parseInt(ratingMatch[1]);
        playerData.position = ratingMatch[2];
      }

      // Età
      const ageMatch = trimmedLine.match(/età[:\s]*(\d+)/i);
      if (ageMatch) {
        playerData.age = parseInt(ageMatch[1]);
      }

      // Altezza
      const heightMatch = trimmedLine.match(/altezza[:\s]*(\d+)\s*cm/i);
      if (heightMatch) {
        playerData.physical.height = parseInt(heightMatch[1]);
      }

      // Peso
      const weightMatch = trimmedLine.match(/peso[:\s]*(\d+)\s*kg/i);
      if (weightMatch) {
        playerData.physical.weight = parseInt(weightMatch[1]);
      }

      // Statistiche numeriche
      const statMatch = trimmedLine.match(/([A-Za-z\s]+):\s*(\d+)/);
      if (statMatch) {
        const statName = statMatch[1].trim().toLowerCase();
        const value = parseInt(statMatch[2]);

        // Mappa le statistiche
        if (statName.includes('comportamento offensivo'))
          playerData.stats.offensiveAwareness = value;
        else if (statName.includes('controllo palla'))
          playerData.stats.ballControl = value;
        else if (statName.includes('dribbling'))
          playerData.stats.dribbling = value;
        else if (statName.includes('finalizzazione'))
          playerData.stats.finishing = value;
        else if (statName.includes('velocità')) playerData.stats.speed = value;
        else if (statName.includes('accelerazione'))
          playerData.stats.acceleration = value;
        else if (statName.includes('passaggio'))
          playerData.stats.passing = value;
        else if (statName.includes('contrasto'))
          playerData.stats.tackling = value;
        else if (statName.includes('resistenza'))
          playerData.stats.stamina = value;
        else if (statName.includes('salto')) playerData.stats.jumping = value;
        else if (statName.includes('forza')) playerData.stats.physical = value;
      }

      // Abilità speciali
      const abilityKeywords = [
        'elastico',
        'sombrero',
        'tiro a salire',
        'passaggio calibrato',
        'cross calibrato',
        'rabona',
        'marcatore',
        'scivolata',
        'disimpegno acrobatico',
        'spirito combattivo',
      ];
      abilityKeywords.forEach(ability => {
        if (trimmedLine.toLowerCase().includes(ability)) {
          playerData.abilities.push(ability);
        }
      });

      // Stili di gioco IA
      const playstyleKeywords = [
        'treno in corsa',
        'crossatore',
        'regista creativo',
        'terzino offensivo',
      ];
      playstyleKeywords.forEach(playstyle => {
        if (trimmedLine.toLowerCase().includes(playstyle)) {
          playerData.aiPlayStyles.push(playstyle);
        }
      });

      // Booster
      const boosterMatch = trimmedLine.match(
        /booster[:\s]*([^:]+)[:\s]*effetto[:\s]*([+-]?\d+)/i
      );
      if (boosterMatch) {
        playerData.boosters.push({
          name: boosterMatch[1].trim(),
          effect: boosterMatch[2].trim(),
        });
      }
    });

    return {
      type: 'player_profile',
      ...playerData,
      rawText: text,
      confidence: 0.85,
    };
  }

  parsePlayerStats(lines) {
    const stats = {};

    lines.forEach(line => {
      const statMatch = line.match(/([A-Za-z\s]+):\s*(\d+)/);
      if (statMatch) {
        const statName = statMatch[1].trim().toLowerCase();
        const value = parseInt(statMatch[2]);

        if (statName.includes('shooting')) stats.shooting = value;
        else if (statName.includes('passing')) stats.passing = value;
        else if (statName.includes('dribbling')) stats.dribbling = value;
        else if (statName.includes('defending')) stats.defending = value;
        else if (statName.includes('physical')) stats.physical = value;
        else if (statName.includes('speed')) stats.speed = value;
      }
    });

    return {
      type: 'player_stats',
      stats: stats,
      rawText: text,
      confidence: 0.8,
    };
  }

  parseMatchStats(lines) {
    const matchStats = { home: {}, away: {} };

    lines.forEach(line => {
      const statMatch = line.match(/([A-Za-z\s]+):\s*(\d+)\s*-\s*(\d+)/);
      if (statMatch) {
        const statName = statMatch[1].trim().toLowerCase();
        const homeValue = parseInt(statMatch[2]);
        const awayValue = parseInt(statMatch[3]);

        matchStats.home[statName] = homeValue;
        matchStats.away[statName] = awayValue;
      }
    });

    return {
      type: 'match_stats',
      stats: matchStats,
      rawText: text,
      confidence: 0.85,
    };
  }

  parseGenericData(lines, imageType) {
    return {
      type: imageType,
      lines: lines.slice(0, 10),
      wordCount: text.split(' ').length,
      rawText: text,
      confidence: 0.75,
    };
  }

  mapPositionToRole(position) {
    const positionMap = {
      GK: 'Portiere',
      CB: 'Difensore Centrale',
      LB: 'Terzino Sinistro',
      RB: 'Terzino Destro',
      CDM: 'Mediano',
      CM: 'Centrocampista',
      CAM: 'Trequartista',
      LM: 'Centrocampista Sinistro',
      RM: 'Centrocampista Destro',
      LW: 'Ala Sinistra',
      RW: 'Ala Destra',
      ST: 'Attaccante',
      CF: 'Punta',
    };

    return positionMap[position] || position;
  }

  async fileToUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Esporta istanza singleton
export const realOCRService = new RealOCRService();
export default realOCRService;
