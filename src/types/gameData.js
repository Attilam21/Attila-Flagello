// Modelli dati per eFootballLab basati sui dati reali dei clienti

export const PlayerPosition = {
  PT: 'Portiere',
  DC: 'Difensore Centrale',
  TS: 'Terzino Sinistro',
  TD: 'Terzino Destro',
  CC: 'Centrocampista Centrale',
  MED: 'Mediano',
  TRQ: 'Trequartista',
  CLD: 'Centrocampista Laterale Destro',
  CLS: 'Centrocampista Laterale Sinistro',
  SP: 'Seconda Punta',
  P: 'Punta',
  RWF: 'Ala Destra',
  LWF: 'Ala Sinistra',
  AMF: 'Attaccante Centrale',
};

export const CardType = {
  EPICO: 'Epico',
  TRENDING: 'Trending',
  POTW: 'Player Of The Week',
  LEGENDARY: 'Leggendaria',
  FEATURED: 'In Evidenza',
};

export const PlayerForm = {
  A: 'Eccellente',
  B: 'Buona',
  C: 'Normale',
  D: 'Scarsa',
  E: 'Pessima',
};

export const PlayerAbilities = {
  // Abilità tecniche
  ELASTICO: 'Elastico',
  SOMBRERO: 'Sombrero',
  RABONA: 'Rabona',
  TIR_A_SALIRE: 'Tiro a salire',
  TIR_A_GIRO: 'Tiro a giro',
  FINALIZZAZIONE: 'Finalizzazione',

  // Abilità difensive
  MARCATORE: 'Marcatore',
  INTERCETTAZIONE: 'Intercettazione',
  SCIVOLATA: 'Scivolata',
  MURO: 'Muro',
  DISIMPEGNO_ACROBATICO: 'Disimpegno acrobatico',

  // Abilità di passaggio
  PASSAGGIO_CALIBRATO: 'Passaggio calibrato',
  CROSS_CALIBRATO: 'Cross calibrato',
  LANCIO_LUNGO: 'Lancio lungo',
  PASSAGGIO_A_SCAVALCARE: 'Passaggio a scavalcare',

  // Abilità mentali
  LEADER: 'Leader',
  SPIRITO_COMBATTIVO: 'Spirito combattivo',
  RESISTENZA: 'Resistenza',
};

export const GameStyle = {
  ESPERTO_PALLE_LUNGHE: 'Esperto palle lunghe',
  TIRATORE: 'Tiratore',
  TRENO_IN_CORSA: 'Treno in corsa',
  CROSSATORE: 'Crossatore',
  CONTROLLO_PALLA: 'Controllo palla',
  CONTRATTACCO: 'Contrattacco',
};

// Modello per un giocatore
export const createPlayerModel = () => ({
  id: '',
  name: '',
  rating: 0,
  position: '',
  cardType: '',
  team: '',
  season: '',
  nationality: '',

  // Statistiche fisiche
  height: 0,
  weight: 0,
  age: 0,
  preferredFoot: 'right', // 'right' | 'left'

  // Statistiche tecniche
  stats: {
    // Attacco
    offensiveAwareness: 0,
    ballControl: 0,
    dribbling: 0,
    tightPossession: 0,
    lowPass: 0,
    loftedPass: 0,
    finishing: 0,
    heading: 0,
    setPieceTaking: 0,
    curl: 0,

    // Difesa
    defensiveAwareness: 0,
    tackling: 0,
    aggression: 0,
    defensiveEngagement: 0,

    // Portiere
    goalkeeperAwareness: 0,
    goalkeeperCatching: 0,
    goalkeeperParrying: 0,
    goalkeeperReflexes: 0,
    goalkeeperReach: 0,

    // Forza
    speed: 0,
    acceleration: 0,
    kickingPower: 0,
    jump: 0,
    physicalContact: 0,
    bodyControl: 0,
    stamina: 0,
  },

  // Caratteristiche
  weakFootUsage: '', // 'Sporadicamente' | 'Frequentemente'
  weakFootAccuracy: '', // 'Alta' | 'Media' | 'Bassa'
  form: '', // 'Incrollabile' | 'Buona' | 'Normale'
  injuryResistance: '', // 'Alta' | 'Media' | 'Bassa'

  // Abilità e stili
  abilities: [],
  additionalAbilities: [],
  gameStyles: [],

  // Dati partita
  matchesPlayed: 0,
  goals: 0,
  assists: 0,

  // Booster
  boosters: [],
});

// Modello per una partita
export const createMatchModel = () => ({
  id: '',
  date: '',
  homeTeam: '',
  awayTeam: '',
  homeScore: 0,
  awayScore: 0,
  matchType: '', // 'Regular' | 'Friendly' | 'Competition'

  // Statistiche squadra
  teamStats: {
    possession: { home: 0, away: 0 },
    totalShots: { home: 0, away: 0 },
    shotsOnTarget: { home: 0, away: 0 },
    fouls: { home: 0, away: 0 },
    offsides: { home: 0, away: 0 },
    corners: { home: 0, away: 0 },
    freeKicks: { home: 0, away: 0 },
    passes: { home: 0, away: 0 },
    successfulPasses: { home: 0, away: 0 },
    crosses: { home: 0, away: 0 },
    interceptedPasses: { home: 0, away: 0 },
    tackles: { home: 0, away: 0 },
    saves: { home: 0, away: 0 },
  },

  // Valutazioni giocatori
  playerRatings: {
    home: [],
    away: [],
  },

  // Aree di attacco
  attackAreas: {
    home: { left: 0, center: 0, right: 0 },
    away: { left: 0, center: 0, right: 0 },
  },

  // Aree di recupero palla
  ballRecoveryAreas: {
    home: [],
    away: [],
  },
});

// Modello per una squadra
export const createTeamModel = () => ({
  id: '',
  name: '',
  coach: '',
  formation: '',
  playStyle: '',
  overallStrength: 0,

  // Giocatori
  players: {
    goalkeeper: null,
    defenders: [],
    midfielders: [],
    forwards: [],
  },

  // Sostituti e riserve
  substitutes: [],
  reserves: [],
});
