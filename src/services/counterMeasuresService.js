// Servizio AI per contro-misure tattiche avanzate
class CounterMeasuresService {
  constructor() {
    this.tacticalPatterns = {
      '4-3-3': {
        strengths: ['Attacco', 'Velocità', 'Cross'],
        weaknesses: ['Difesa', 'Arie', 'Fisico'],
        counters: ['4-4-2', '3-5-2', '5-3-2'],
        strategies: ['Pressing alto', 'Gioco aereo', 'Contropiedi']
      },
      '4-4-2': {
        strengths: ['Bilanciamento', 'Fisico', 'Arie'],
        weaknesses: ['Creatività', 'Possesso', 'Velocità'],
        counters: ['4-3-3', '4-2-3-1', '3-4-3'],
        strategies: ['Possesso palla', 'Gioco stretto', 'Velocità laterale']
      },
      '3-5-2': {
        strengths: ['Centrocampo', 'Possesso', 'Creatività'],
        weaknesses: ['Laterali', 'Velocità', 'Arie'],
        counters: ['4-3-3', '4-4-2', '3-4-3'],
        strategies: ['Gioco laterale', 'Cross', 'Velocità']
      }
    };

    this.playerRoles = {
      'ST': { priority: 'high', counter: 'DC', strategy: 'Marcatura stretta' },
      'LW': { priority: 'high', counter: 'RB', strategy: 'Doppio marcamento' },
      'RW': { priority: 'high', counter: 'LB', strategy: 'Doppio marcamento' },
      'CM': { priority: 'medium', counter: 'CDM', strategy: 'Pressing' },
      'CAM': { priority: 'high', counter: 'CDM', strategy: 'Marcatura zonal' },
      'CDM': { priority: 'medium', counter: 'CM', strategy: 'Pressing' },
      'CB': { priority: 'low', counter: 'ST', strategy: 'Gioco aereo' },
      'LB': { priority: 'medium', counter: 'RW', strategy: 'Overlap' },
      'RB': { priority: 'medium', counter: 'LW', strategy: 'Overlap' }
    };
  }

  // Analizza l'avversario e genera contro-misure
  analyzeOpponent(opponentData) {
    console.log('🧠 Analyzing opponent:', opponentData.name);
    
    const analysis = {
      threatLevel: this.calculateThreatLevel(opponentData),
      recommendedFormation: this.recommendFormation(opponentData),
      counterMeasures: this.generateCounterMeasures(opponentData),
      tacticalAdvice: this.generateTacticalAdvice(opponentData),
      keyMatchups: this.identifyKeyMatchups(opponentData),
      predictedOutcome: this.predictOutcome(opponentData)
    };

    return analysis;
  }

  // Calcola il livello di minaccia
  calculateThreatLevel(opponent) {
    const keyPlayers = opponent.keyPlayers || [];
    const highThreatPlayers = keyPlayers.filter(p => p.threat === 'high').length;
    const avgRating = keyPlayers.reduce((sum, p) => sum + p.rating, 0) / keyPlayers.length;
    
    if (highThreatPlayers >= 3 && avgRating >= 90) return 'high';
    if (highThreatPlayers >= 2 && avgRating >= 85) return 'medium';
    return 'low';
  }

  // Raccomanda formazione ottimale
  recommendFormation(opponent) {
    const opponentFormation = opponent.formation;
    const pattern = this.tacticalPatterns[opponentFormation];
    
    if (pattern) {
      return pattern.counters[0]; // Prima contro-misura
    }
    
    // Fallback basato su stile di gioco
    if (opponent.playStyle === 'Possesso') return '4-4-2';
    if (opponent.playStyle === 'Tiki-Taka') return '4-3-3';
    if (opponent.playStyle === 'Contropiedi') return '3-5-2';
    
    return '4-3-3'; // Default
  }

  // Genera contro-misure specifiche
  generateCounterMeasures(opponent) {
    const measures = [];
    const pattern = this.tacticalPatterns[opponent.formation];
    
    if (pattern) {
      measures.push(...pattern.strategies);
    }
    
    // Contro-misure basate su punti deboli
    opponent.weaknesses?.forEach(weakness => {
      switch (weakness) {
        case 'Difesa':
          measures.push('Aumenta pressione offensiva');
          measures.push('Sfrutta corse laterali');
          break;
        case 'Arie':
          measures.push('Gioca su cross e corner');
          measures.push('Sfrutta giocatori alti');
          break;
        case 'Fisico':
          measures.push('Gioca a ritmo alto');
          measures.push('Sfrutta velocità');
          break;
        case 'Velocità':
          measures.push('Gioca su possesso palla');
          measures.push('Rallenta il ritmo');
          break;
      }
    });
    
    return measures;
  }

  // Genera consigli tattici
  generateTacticalAdvice(opponent) {
    const advice = [];
    
    // Basato su possesso palla
    if (opponent.analysis?.possession > 60) {
      advice.push('Gioca sui contropiedi');
      advice.push('Mantieni il possesso quando possibile');
    } else {
      advice.push('Aumenta il possesso palla');
      advice.push('Gioca con pazienza');
    }
    
    // Basato su tiri
    if (opponent.analysis?.shots > 15) {
      advice.push('Riduci gli spazi');
      advice.push('Marca stretto in area');
    } else {
      advice.push('Sfrutta gli spazi');
      advice.push('Aumenta i tiri');
    }
    
    // Basato su passaggi
    if (opponent.analysis?.passAccuracy > 85) {
      advice.push('Aumenta la pressione');
      advice.push('Interrompi la costruzione');
    } else {
      advice.push('Lascia costruire');
      advice.push('Aspetta l\'errore');
    }
    
    return advice;
  }

  // Identifica scontri chiave
  identifyKeyMatchups(opponent) {
    const matchups = [];
    const keyPlayers = opponent.keyPlayers || [];
    
    keyPlayers.forEach(player => {
      if (player.threat === 'high') {
        const role = this.playerRoles[player.position];
        if (role) {
          matchups.push({
            player: player.name,
            position: player.position,
            counter: role.counter,
            strategy: role.strategy,
            priority: role.priority
          });
        }
      }
    });
    
    return matchups;
  }

  // Predice l'esito della partita
  predictOutcome(opponent) {
    const threatLevel = this.calculateThreatLevel(opponent);
    const possession = opponent.analysis?.possession || 50;
    const shots = opponent.analysis?.shots || 10;
    
    let difficulty = 'Favorevole';
    
    if (threatLevel === 'high' && possession > 60) {
      difficulty = 'Molto Difficile';
    } else if (threatLevel === 'medium' && shots > 15) {
      difficulty = 'Difficile';
    } else if (threatLevel === 'low' && possession < 40) {
      difficulty = 'Favorevole';
    }
    
    return difficulty;
  }

  // Analizza la tua squadra per ottimizzazione
  analyzeMyTeam(myTeam, opponent) {
    const analysis = {
      optimalFormation: this.recommendFormation(opponent),
      playerAssignments: this.assignPlayers(myTeam, opponent),
      tacticalInstructions: this.generateTacticalInstructions(myTeam, opponent),
      substitutions: this.suggestSubstitutions(myTeam, opponent)
    };
    
    return analysis;
  }

  // Assegna giocatori alle posizioni ottimali
  assignPlayers(myTeam, opponent) {
    const assignments = [];
    const keyMatchups = this.identifyKeyMatchups(opponent);
    
    myTeam.forEach(player => {
      const matchup = keyMatchups.find(m => m.counter === player.position);
      if (matchup) {
        assignments.push({
          player: player.name,
          position: player.position,
          role: `Contrasta ${matchup.player}`,
          instructions: matchup.strategy
        });
      }
    });
    
    return assignments;
  }

  // Genera istruzioni tattiche
  generateTacticalInstructions(myTeam, opponent) {
    const instructions = [];
    
    // Istruzioni generali
    instructions.push({
      type: 'general',
      instruction: `Formazione: ${this.recommendFormation(opponent)}`,
      priority: 'high'
    });
    
    // Istruzioni specifiche per posizione
    const keyMatchups = this.identifyKeyMatchups(opponent);
    keyMatchups.forEach(matchup => {
      instructions.push({
        type: 'specific',
        position: matchup.counter,
        instruction: `${matchup.strategy} contro ${matchup.player}`,
        priority: matchup.priority
      });
    });
    
    return instructions;
  }

  // Suggerisce sostituzioni
  suggestSubstitutions(myTeam, opponent) {
    const substitutions = [];
    
    // Analizza punti deboli dell'avversario
    opponent.weaknesses?.forEach(weakness => {
      const suitablePlayers = myTeam.filter(player => {
        switch (weakness) {
          case 'Arie':
            return player.physical?.height > 185;
          case 'Velocità':
            return player.stats?.pace > 85;
          case 'Fisico':
            return player.stats?.physical > 80;
          default:
            return false;
        }
      });
      
      if (suitablePlayers.length > 0) {
        substitutions.push({
          reason: `Sfrutta ${weakness}`,
          players: suitablePlayers.slice(0, 2).map(p => p.name),
          priority: 'medium'
        });
      }
    });
    
    return substitutions;
  }
}

export const counterMeasuresService = new CounterMeasuresService();
export default counterMeasuresService;
