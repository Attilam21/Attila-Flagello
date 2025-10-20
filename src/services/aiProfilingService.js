// Servizio AI per profilazione avanzata dei giocatori eFootball
class AIProfilingService {
  constructor() {
    this.positionMap = {
      GK: { name: 'Portiere', category: 'goalkeeper', priority: 'defensive' },
      CB: {
        name: 'Difensore Centrale',
        category: 'defender',
        priority: 'defensive',
      },
      LB: { name: 'Terzino Sinistro', category: 'defender', priority: 'mixed' },
      RB: { name: 'Terzino Destro', category: 'defender', priority: 'mixed' },
      CDM: { name: 'Mediano', category: 'midfielder', priority: 'defensive' },
      CM: { name: 'Centrocampista', category: 'midfielder', priority: 'mixed' },
      CAM: {
        name: 'Trequartista',
        category: 'midfielder',
        priority: 'offensive',
      },
      LM: {
        name: 'Centrocampista Sinistro',
        category: 'midfielder',
        priority: 'mixed',
      },
      RM: {
        name: 'Centrocampista Destro',
        category: 'midfielder',
        priority: 'mixed',
      },
      LW: { name: 'Ala Sinistra', category: 'forward', priority: 'offensive' },
      RW: { name: 'Ala Destra', category: 'forward', priority: 'offensive' },
      ST: { name: 'Attaccante', category: 'forward', priority: 'offensive' },
      CF: { name: 'Punta', category: 'forward', priority: 'offensive' },
    };

    this.buildTypes = {
      Finalizzatore: {
        focus: 'shooting',
        style: 'offensive',
        compatibility: ['ST', 'CF', 'LW', 'RW'],
      },
      Regista: {
        focus: 'passing',
        style: 'creative',
        compatibility: ['CAM', 'CM', 'CDM'],
      },
      'Box-to-Box': {
        focus: 'physical',
        style: 'balanced',
        compatibility: ['CM', 'CDM', 'CAM'],
      },
      Marcatore: {
        focus: 'defending',
        style: 'defensive',
        compatibility: ['CB', 'CDM', 'LB', 'RB'],
      },
      Trequartista: {
        focus: 'dribbling',
        style: 'creative',
        compatibility: ['CAM', 'LW', 'RW'],
      },
      Ala: {
        focus: 'speed',
        style: 'offensive',
        compatibility: ['LW', 'RW', 'LM', 'RM'],
      },
      Difensore: {
        focus: 'defending',
        style: 'defensive',
        compatibility: ['CB', 'LB', 'RB'],
      },
      Portiere: {
        focus: 'goalkeeping',
        style: 'defensive',
        compatibility: ['GK'],
      },
    };

    this.boosterTypes = {
      Tiro: { stats: ['shooting'], positions: ['ST', 'CF', 'LW', 'RW', 'CAM'] },
      Passaggio: {
        stats: ['passing'],
        positions: ['CM', 'CAM', 'CDM', 'LB', 'RB'],
      },
      Dribbling: {
        stats: ['dribbling'],
        positions: ['LW', 'RW', 'CAM', 'ST', 'CF'],
      },
      Difesa: { stats: ['defending'], positions: ['CB', 'LB', 'RB', 'CDM'] },
      Fisico: { stats: ['physical'], positions: ['CDM', 'CM', 'CB'] },
      Velocità: { stats: ['speed'], positions: ['LW', 'RW', 'LB', 'RB'] },
    };
  }

  // Profila un singolo giocatore
  profilePlayer(player, assignedPosition, teamContext = {}) {
    console.log('🧠 AI Profiling player:', player.name);

    const analysis = {
      player: player,
      assignedPosition: assignedPosition,
      naturalPosition: player.position,
      roleCompatibility: this.analyzeRoleCompatibility(
        player,
        assignedPosition
      ),
      buildAnalysis: this.analyzeBuild(player, assignedPosition),
      boosterAnalysis: this.analyzeBoosters(player, assignedPosition),
      skillsAnalysis: this.analyzeSkills(player, assignedPosition),
      teamSynergy: this.analyzeTeamSynergy(player, teamContext),
      overallRating: 0,
      suggestions: [],
      warnings: [],
      strengths: [],
    };

    // Calcola rating complessivo
    analysis.overallRating = this.calculateOverallRating(analysis);

    // Genera suggerimenti
    analysis.suggestions = this.generateSuggestions(analysis);

    return analysis;
  }

  // Analizza compatibilità ruolo
  analyzeRoleCompatibility(player, assignedPosition) {
    const naturalPos = this.positionMap[player.position];
    const assignedPos = this.positionMap[assignedPosition];

    if (!naturalPos || !assignedPos) {
      return {
        compatibility: 0,
        penalty: 0,
        reason: 'Posizione non riconosciuta',
      };
    }

    // Stessa posizione = perfetta compatibilità
    if (player.position === assignedPosition) {
      return { compatibility: 100, penalty: 0, reason: 'Ruolo naturale' };
    }

    // Stessa categoria = buona compatibilità
    if (naturalPos.category === assignedPos.category) {
      return {
        compatibility: 80,
        penalty: 20,
        reason: 'Stessa categoria, ruolo diverso',
      };
    }

    // Categorie adiacenti = compatibilità media
    const adjacentCategories = {
      goalkeeper: ['defender'],
      defender: ['goalkeeper', 'midfielder'],
      midfielder: ['defender', 'forward'],
      forward: ['midfielder'],
    };

    if (
      adjacentCategories[naturalPos.category]?.includes(assignedPos.category)
    ) {
      return { compatibility: 60, penalty: 40, reason: 'Categoria adiacente' };
    }

    // Categorie opposte = bassa compatibilità
    return { compatibility: 30, penalty: 70, reason: 'Categoria opposta' };
  }

  // Analizza build del giocatore
  analyzeBuild(player, assignedPosition) {
    const build = player.build || 'Unknown';
    const buildInfo = this.buildTypes[build];

    if (!buildInfo) {
      return {
        compatibility: 50,
        penalty: 0,
        reason: 'Build non riconosciuta',
      };
    }

    const assignedPos = this.positionMap[assignedPosition];
    const isCompatible = buildInfo.compatibility.includes(assignedPosition);

    if (isCompatible) {
      return {
        compatibility: 90,
        penalty: 0,
        reason: `Build ${build} perfetta per ${assignedPos.name}`,
        bonus: 10,
      };
    }

    // Calcola penalità basata su incompatibilità
    const penalty = this.calculateBuildPenalty(build, assignedPosition);

    return {
      compatibility: 100 - penalty,
      penalty: penalty,
      reason: `Build ${build} non ottimale per ${assignedPos.name}`,
      suggestion: this.getBuildSuggestion(build, assignedPosition),
    };
  }

  // Analizza booster attivi
  analyzeBoosters(player, assignedPosition) {
    if (!player.boosters || player.boosters.length === 0) {
      return {
        efficiency: 50,
        waste: 0,
        suggestions: ['Nessun booster attivo'],
      };
    }

    let totalEfficiency = 0;
    let wasteCount = 0;
    const suggestions = [];

    player.boosters.forEach(booster => {
      const boosterInfo = this.boosterTypes[booster.type];
      if (!boosterInfo) return;

      const isRelevant = boosterInfo.positions.includes(assignedPosition);
      const isStatRelevant = this.isStatRelevantForPosition(
        boosterInfo.stats[0],
        assignedPosition
      );

      if (isRelevant && isStatRelevant) {
        totalEfficiency += 100;
        suggestions.push(
          `✅ Booster ${booster.type} ottimale per ${assignedPosition}`
        );
      } else if (isRelevant) {
        totalEfficiency += 70;
        suggestions.push(`⚠️ Booster ${booster.type} utile ma non prioritario`);
      } else {
        wasteCount++;
        suggestions.push(
          `❌ Booster ${booster.type} sprecato in ${assignedPosition}`
        );
      }
    });

    const efficiency = totalEfficiency / player.boosters.length;

    return {
      efficiency: Math.round(efficiency),
      waste: wasteCount,
      suggestions: suggestions,
    };
  }

  // Analizza abilità speciali
  analyzeSkills(player, assignedPosition) {
    if (!player.skills || player.skills.length === 0) {
      return {
        utilization: 50,
        unused: 0,
        suggestions: ['Nessuna abilità rilevata'],
      };
    }

    const positionSkills = this.getRelevantSkillsForPosition(assignedPosition);
    let utilizedSkills = 0;
    const suggestions = [];

    player.skills.forEach(skill => {
      const isRelevant = positionSkills.includes(skill);
      if (isRelevant) {
        utilizedSkills++;
        suggestions.push(`✅ ${skill} utile per ${assignedPosition}`);
      } else {
        suggestions.push(`⚠️ ${skill} poco utile per ${assignedPosition}`);
      }
    });

    // Assicura che utilization sia sempre > 0 se ci sono skills
    const utilization =
      player.skills.length > 0
        ? Math.max(
            10,
            Math.round((utilizedSkills / player.skills.length) * 100)
          )
        : 50;

    return {
      utilization: utilization,
      unused: player.skills.length - utilizedSkills,
      suggestions: suggestions,
    };
  }

  // Analizza sinergie di squadra
  analyzeTeamSynergy(player, teamContext) {
    if (!teamContext.players || teamContext.players.length === 0) {
      return {
        synergy: 50,
        connections: 0,
        suggestions: ['Contesto squadra non disponibile'],
      };
    }

    let synergyScore = 50;
    const connections = [];
    const suggestions = [];

    // Analizza connessioni con giocatori vicini
    const nearbyPlayers = this.getNearbyPlayers(player, teamContext.players);

    nearbyPlayers.forEach(nearbyPlayer => {
      const connection = this.analyzePlayerConnection(player, nearbyPlayer);
      if (connection.strength > 0) {
        synergyScore += connection.strength;
        connections.push(connection);
        suggestions.push(
          `🤝 Buona sinergia con ${nearbyPlayer.name} (${connection.reason})`
        );
      }
    });

    return {
      synergy: Math.min(100, synergyScore),
      connections: connections.length,
      suggestions: suggestions,
    };
  }

  // Calcola rating complessivo
  calculateOverallRating(analysis) {
    const weights = {
      roleCompatibility: 0.3,
      buildAnalysis: 0.25,
      boosterAnalysis: 0.2,
      skillsAnalysis: 0.15,
      teamSynergy: 0.1,
    };

    let rating = 0;
    rating +=
      analysis.roleCompatibility.compatibility * weights.roleCompatibility;
    rating += analysis.buildAnalysis.compatibility * weights.buildAnalysis;
    rating += analysis.boosterAnalysis.efficiency * weights.boosterAnalysis;
    rating += analysis.skillsAnalysis.utilization * weights.skillsAnalysis;
    rating += analysis.teamSynergy.synergy * weights.teamSynergy;

    return Math.round(rating);
  }

  // Genera suggerimenti personalizzati
  generateSuggestions(analysis) {
    const suggestions = [];

    // Suggerimenti basati su compatibilità ruolo
    if (analysis.roleCompatibility.penalty > 50) {
      suggestions.push({
        type: 'warning',
        priority: 'high',
        message: `⚠️ ${analysis.player.name} è fuori ruolo: ${analysis.roleCompatibility.reason}`,
        action: `Considera di spostare ${analysis.player.name} in ${analysis.player.position}`,
      });
    }

    // Suggerimenti basati su build
    if (analysis.buildAnalysis.penalty > 30) {
      suggestions.push({
        type: 'suggestion',
        priority: 'medium',
        message: `💡 Build incompatibile: ${analysis.buildAnalysis.reason}`,
        action: analysis.buildAnalysis.suggestion,
      });
    }

    // Suggerimenti basati su booster
    if (analysis.boosterAnalysis.waste > 0) {
      suggestions.push({
        type: 'optimization',
        priority: 'medium',
        message: `🔄 Ottimizza booster: ${analysis.boosterAnalysis.waste} booster sprecati`,
        action: "Ridistribuisci i booster per massimizzare l'efficacia",
      });
    }

    // Suggerimenti basati su abilità
    if (analysis.skillsAnalysis.unused > 0) {
      suggestions.push({
        type: 'info',
        priority: 'low',
        message: `📊 Abilità sottoutilizzate: ${analysis.skillsAnalysis.unused} skill non sfruttate`,
        action:
          'Considera di cambiare posizione per sfruttare tutte le abilità',
      });
    }

    return suggestions;
  }

  // Helper methods
  calculateBuildPenalty(build, position) {
    const buildInfo = this.buildTypes[build];
    if (!buildInfo) return 50;

    const isCompatible = buildInfo.compatibility.includes(position);
    return isCompatible ? 0 : 40;
  }

  getBuildSuggestion(build, position) {
    const suggestions = {
      Finalizzatore: 'Ottimale per attaccanti e ali',
      Regista: 'Perfetto per centrocampisti creativi',
      'Box-to-Box': 'Ideale per centrocampisti completi',
      Marcatore: 'Eccellente per difensori e mediani',
      Trequartista: 'Ottimo per trequartisti e ali',
      Ala: 'Perfetto per esterni offensivi',
      Difensore: 'Ideale per tutta la difesa',
    };

    return suggestions[build] || 'Build generica';
  }

  isStatRelevantForPosition(stat, position) {
    const positionStats = {
      GK: ['goalkeeping'],
      CB: ['defending', 'physical'],
      LB: ['defending', 'speed', 'passing'],
      RB: ['defending', 'speed', 'passing'],
      CDM: ['defending', 'physical', 'passing'],
      CM: ['passing', 'physical', 'dribbling'],
      CAM: ['passing', 'dribbling', 'shooting'],
      LW: ['speed', 'dribbling', 'shooting'],
      RW: ['speed', 'dribbling', 'shooting'],
      ST: ['shooting', 'physical'],
      CF: ['shooting', 'dribbling', 'passing'],
    };

    return positionStats[position]?.includes(stat) || false;
  }

  getRelevantSkillsForPosition(position) {
    const positionSkills = {
      GK: ['Parata', 'Riflessi', 'Comando area'],
      CB: ['Intercettazione', 'Marcatura', 'Colpo di testa'],
      LB: ['Cross', 'Sovrapposizione', 'Marcatura'],
      RB: ['Cross', 'Sovrapposizione', 'Marcatura'],
      CDM: ['Intercettazione', 'Passaggio', 'Fisico'],
      CM: ['Passaggio', 'Visione', 'Controllo'],
      CAM: ['Passaggio filtrante', 'Dribbling', 'Tiro'],
      LW: ['Dribbling', 'Cross', 'Velocità'],
      RW: ['Dribbling', 'Cross', 'Velocità'],
      ST: ['Tiro', 'Colpo di testa', 'Finalizzazione'],
      CF: ['Tiro', 'Dribbling', 'Passaggio'],
    };

    return positionSkills[position] || [];
  }

  getNearbyPlayers(player, allPlayers) {
    // Logica semplificata per trovare giocatori vicini
    return allPlayers.filter(p => p.id !== player.id).slice(0, 3);
  }

  analyzePlayerConnection(player1, player2) {
    // Logica semplificata per analizzare connessioni
    const connection = {
      strength: Math.random() * 30 + 10,
      reason: 'Compatibilità tattica',
    };

    return connection;
  }
}

// Esporta istanza singleton
export const aiProfilingService = new AIProfilingService();
export default aiProfilingService;
