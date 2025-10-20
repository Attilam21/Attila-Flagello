// Database completo giocatori eFootball - Versione ottimizzata
import React, { useState, useEffect } from 'react';

// Mock data per test - sostituire con caricamento dinamico
const mockPlayers = [
  {
    id: 1,
    name: "Kylian Mbappé",
    position: "CF",
    overall: 95,
    club: "Paris Saint-Germain",
    nationality: "Francia",
    age: 24,
    height: 178,
    weight: 73,
    weakFoot: 4,
    form: "A",
    injuryResistance: 2,
    playstyle: "Goal Poacher",
    stats: {
      offensiveAwareness: 95,
      ballControl: 92,
      dribbling: 94,
      tightPossession: 88,
      lowPass: 85,
      loftedPass: 82,
      finishing: 95,
      heading: 75,
      placeKicking: 88,
      curl: 90,
      defensiveAwareness: 45,
      tackling: 40,
      interception: 42,
      aggression: 65,
      goalkeeping: 40,
      gkCatching: 40,
      gkParrying: 40,
      gkReflexes: 40,
      gkReach: 40,
      speed: 97,
      acceleration: 96,
      kickingPower: 88,
      jump: 78,
      physicalContact: 82,
      balance: 90,
      stamina: 88
    },
    skills: ["First-time Shot", "Chip Shot Control", "Acrobatic Finishing"],
    communicationSkills: ["Captaincy"],
    boosters: [],
    image: null
  },
  {
    id: 2,
    name: "Lionel Messi",
    position: "RW",
    overall: 93,
    club: "Inter Miami",
    nationality: "Argentina",
    age: 36,
    height: 170,
    weight: 72,
    weakFoot: 4,
    form: "A",
    injuryResistance: 1,
    playstyle: "Creative Playmaker",
    stats: {
      offensiveAwareness: 95,
      ballControl: 98,
      dribbling: 97,
      tightPossession: 95,
      lowPass: 94,
      loftedPass: 92,
      finishing: 90,
      heading: 70,
      placeKicking: 95,
      curl: 98,
      defensiveAwareness: 35,
      tackling: 30,
      interception: 35,
      aggression: 40,
      goalkeeping: 40,
      gkCatching: 40,
      gkParrying: 40,
      gkReflexes: 40,
      gkReach: 40,
      speed: 85,
      acceleration: 90,
      kickingPower: 85,
      jump: 65,
      physicalContact: 70,
      balance: 95,
      stamina: 75
    },
    skills: ["Marseille Turn", "Cut Behind & Turn", "No Look Pass"],
    communicationSkills: ["Captaincy", "Long Ball Expert"],
    boosters: [],
    image: null
  },
  {
    id: 3,
    name: "Erling Haaland",
    position: "CF",
    overall: 94,
    club: "Manchester City",
    nationality: "Norvegia",
    age: 23,
    height: 194,
    weight: 88,
    weakFoot: 3,
    form: "A",
    injuryResistance: 2,
    playstyle: "Goal Poacher",
    stats: {
      offensiveAwareness: 92,
      ballControl: 85,
      dribbling: 80,
      tightPossession: 78,
      lowPass: 82,
      loftedPass: 85,
      finishing: 98,
      heading: 95,
      placeKicking: 90,
      curl: 85,
      defensiveAwareness: 40,
      tackling: 35,
      interception: 38,
      aggression: 70,
      goalkeeping: 40,
      gkCatching: 40,
      gkParrying: 40,
      gkReflexes: 40,
      gkReach: 40,
      speed: 89,
      acceleration: 85,
      kickingPower: 95,
      jump: 92,
      physicalContact: 95,
      balance: 80,
      stamina: 85
    },
    skills: ["First-time Shot", "Acrobatic Finishing", "Heading"],
    communicationSkills: ["Captaincy"],
    boosters: [],
    image: null
  }
];

// Funzione per caricare il database completo
export const loadCompleteDatabase = () => {
  try {
    console.log('📊 Caricamento database mock...', mockPlayers.length, 'giocatori');
    return mockPlayers;
  } catch (error) {
    console.error('❌ Errore caricamento database:', error);
    return [];
  }
};

// Funzione di ricerca avanzata
export const searchPlayers = (query, filters = {}) => {
  const database = loadCompleteDatabase();
  
  let results = database;
  
  // Filtro per nome
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(player => 
      player.name?.toLowerCase().includes(searchTerm) ||
      player.club?.toLowerCase().includes(searchTerm) ||
      player.nationality?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filtri avanzati
  if (filters.position && filters.position !== 'all') {
    results = results.filter(player => 
      player.position === filters.position ||
      player.positions?.includes(filters.position)
    );
  }
  
  if (filters.minRating) {
    results = results.filter(player => 
      player.overall >= parseInt(filters.minRating)
    );
  }
  
  if (filters.maxRating) {
    results = results.filter(player => 
      player.overall <= parseInt(filters.maxRating)
    );
  }
  
  if (filters.club && filters.club !== 'all') {
    results = results.filter(player => 
      player.club === filters.club
    );
  }
  
  if (filters.nationality && filters.nationality !== 'all') {
    results = results.filter(player => 
      player.nationality === filters.nationality
    );
  }
  
  // Ordinamento
  const sortBy = filters.sortBy || 'overall';
  const sortOrder = filters.sortOrder || 'desc';
  
  results.sort((a, b) => {
    const aVal = a[sortBy] || 0;
    const bVal = b[sortBy] || 0;
    
    if (sortOrder === 'desc') {
      return bVal - aVal;
    } else {
      return aVal - bVal;
    }
  });
  
  return results;
};

// Funzione per ottenere opzioni uniche per i filtri
export const getFilterOptions = () => {
  const database = loadCompleteDatabase();
  
  const positions = [...new Set(database.map(p => p.position).filter(Boolean))];
  const clubs = [...new Set(database.map(p => p.club).filter(Boolean))];
  const nationalities = [...new Set(database.map(p => p.nationality).filter(Boolean))];
  
  return {
    positions: positions.sort(),
    clubs: clubs.sort(),
    nationalities: nationalities.sort(),
    minRating: Math.min(...database.map(p => p.overall)),
    maxRating: Math.max(...database.map(p => p.overall))
  };
};

// Funzione per convertire giocatore database in formato interno
export const convertDatabasePlayer = (dbPlayer) => {
  return {
    id: dbPlayer.id || Date.now().toString(),
    name: dbPlayer.name || 'Giocatore Sconosciuto',
    position: dbPlayer.position || 'CF',
    overall: dbPlayer.overall || 40,
    club: dbPlayer.club || 'Club Sconosciuto',
    nationality: dbPlayer.nationality || 'N/A',
    age: dbPlayer.age || 25,
    height: dbPlayer.height || 180,
    weight: dbPlayer.weight || 70,
    weakFoot: dbPlayer.weakFoot || 2,
    form: dbPlayer.form || 'B',
    injuryResistance: dbPlayer.injuryResistance || 1,
    
    // Statistiche complete
    stats: {
      // Attacco
      offensiveAwareness: dbPlayer.stats?.offensiveAwareness || 80,
      ballControl: dbPlayer.stats?.ballControl || 80,
      dribbling: dbPlayer.stats?.dribbling || 80,
      tightPossession: dbPlayer.stats?.tightPossession || 80,
      lowPass: dbPlayer.stats?.lowPass || 80,
      loftedPass: dbPlayer.stats?.loftedPass || 80,
      finishing: dbPlayer.stats?.finishing || 80,
      heading: dbPlayer.stats?.heading || 80,
      placeKicking: dbPlayer.stats?.placeKicking || 80,
      curl: dbPlayer.stats?.curl || 80,
      
      // Difesa
      defensiveAwareness: dbPlayer.stats?.defensiveAwareness || 50,
      tackling: dbPlayer.stats?.tackling || 50,
      interception: dbPlayer.stats?.interception || 50,
      aggression: dbPlayer.stats?.aggression || 50,
      goalkeeping: dbPlayer.stats?.goalkeeping || 40,
      gkCatching: dbPlayer.stats?.gkCatching || 40,
      gkParrying: dbPlayer.stats?.gkParrying || 40,
      gkReflexes: dbPlayer.stats?.gkReflexes || 40,
      gkReach: dbPlayer.stats?.gkReach || 40,
      
      // Fisico
      speed: dbPlayer.stats?.speed || 80,
      acceleration: dbPlayer.stats?.acceleration || 80,
      kickingPower: dbPlayer.stats?.kickingPower || 80,
      jump: dbPlayer.stats?.jump || 80,
      physicalContact: dbPlayer.stats?.physicalContact || 80,
      balance: dbPlayer.stats?.balance || 80,
      stamina: dbPlayer.stats?.stamina || 80
    },
    
    // Abilità e boosters
    skills: dbPlayer.skills || [],
    communicationSkills: dbPlayer.communicationSkills || [],
    boosters: dbPlayer.boosters || [],
    playstyle: dbPlayer.playstyle || 'Goal Poacher',
    
    // Dati aggiuntivi
    image: dbPlayer.image || null,
    isCustom: false,
    createdAt: new Date().toISOString()
  };
};

export default {
  loadCompleteDatabase,
  searchPlayers,
  getFilterOptions,
  convertDatabasePlayer
};