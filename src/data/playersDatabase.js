// Database pre-popolato con giocatori eFootball
// Basato su dati reali da eFootball Hub e altre fonti

export const playersDatabase = [
  // Attaccanti
  {
    id: "messi_2024",
    name: "Lionel Messi",
    position: "RW",
    overall: 91,
    age: 36,
    nationality: "Argentina",
    club: "Inter Miami",
    preferredFoot: "Left",
    weakFoot: 4,
    injuryResistance: 3,
    form: "A",
    playstyle: "Creative Playmaker",
    aiPlaystyle: "Hole Player",
    stats: {
      attacking: 90,
      ballControl: 95,
      dribbling: 94,
      finishing: 88,
      passing: 91,
      speed: 75,
      acceleration: 80,
      stamina: 70,
      defending: 35,
      physical: 65
    },
    skills: [
      "First Time Shot",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 170,
      weight: 72,
      bodyType: "Normal"
    }
  },
  {
    id: "mbappe_2024",
    name: "Kylian Mbappé",
    position: "CF",
    overall: 95,
    age: 25,
    nationality: "France",
    club: "Real Madrid",
    preferredFoot: "Right",
    weakFoot: 4,
    injuryResistance: 4,
    form: "A",
    playstyle: "Goal Poacher",
    aiPlaystyle: "Goal Poacher",
    stats: {
      attacking: 95,
      ballControl: 88,
      dribbling: 92,
      finishing: 94,
      passing: 82,
      speed: 99,
      acceleration: 99,
      stamina: 85,
      defending: 35,
      physical: 80
    },
    skills: [
      "First Time Shot",
      "Chip Shot Control",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 178,
      weight: 73,
      bodyType: "Normal"
    }
  },
  {
    id: "haaland_2024",
    name: "Erling Haaland",
    position: "CF",
    overall: 94,
    age: 24,
    nationality: "Norway",
    club: "Manchester City",
    preferredFoot: "Left",
    weakFoot: 3,
    injuryResistance: 4,
    form: "A",
    playstyle: "Goal Poacher",
    aiPlaystyle: "Goal Poacher",
    stats: {
      attacking: 95,
      ballControl: 82,
      dribbling: 80,
      finishing: 96,
      passing: 75,
      speed: 89,
      acceleration: 85,
      stamina: 88,
      defending: 25,
      physical: 95
    },
    skills: [
      "First Time Shot",
      "Chip Shot Control",
      "Acrobatic Finishing",
      "Heading",
      "Long Range Shooting",
      "Knuckle Shot",
      "Rising Shots",
      "Super Sub",
      "Captaincy",
      "Fighting Spirit"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 194,
      weight: 88,
      bodyType: "Tall"
    }
  },
  {
    id: "neymar_2024",
    name: "Neymar Jr",
    position: "LWF",
    overall: 89,
    age: 32,
    nationality: "Brazil",
    club: "Al-Hilal",
    preferredFoot: "Right",
    weakFoot: 5,
    injuryResistance: 2,
    form: "B",
    playstyle: "Creative Playmaker",
    aiPlaystyle: "Creative Playmaker",
    stats: {
      attacking: 90,
      ballControl: 94,
      dribbling: 96,
      finishing: 85,
      passing: 88,
      speed: 85,
      acceleration: 88,
      stamina: 75,
      defending: 30,
      physical: 65
    },
    skills: [
      "First Time Shot",
      "Chip Shot Control",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 175,
      weight: 68,
      bodyType: "Normal"
    }
  },
  // Centrocampisti
  {
    id: "modric_2024",
    name: "Luka Modrić",
    position: "CMF",
    overall: 88,
    age: 38,
    nationality: "Croatia",
    club: "Real Madrid",
    preferredFoot: "Right",
    weakFoot: 4,
    injuryResistance: 4,
    form: "A",
    playstyle: "Box-to-Box",
    aiPlaystyle: "Box-to-Box",
    stats: {
      attacking: 75,
      ballControl: 92,
      dribbling: 88,
      finishing: 70,
      passing: 94,
      speed: 70,
      acceleration: 75,
      stamina: 85,
      defending: 75,
      physical: 70
    },
    skills: [
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass",
      "Long Range Shooting"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 172,
      weight: 66,
      bodyType: "Normal"
    }
  },
  {
    id: "debruyne_2024",
    name: "Kevin De Bruyne",
    position: "AMF",
    overall: 91,
    age: 33,
    nationality: "Belgium",
    club: "Manchester City",
    preferredFoot: "Right",
    weakFoot: 4,
    injuryResistance: 3,
    form: "A",
    playstyle: "Creative Playmaker",
    aiPlaystyle: "Creative Playmaker",
    stats: {
      attacking: 88,
      ballControl: 92,
      dribbling: 85,
      finishing: 82,
      passing: 96,
      speed: 80,
      acceleration: 82,
      stamina: 88,
      defending: 60,
      physical: 80
    },
    skills: [
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Long Range Shooting",
      "Knuckle Shot",
      "Rising Shots",
      "Super Sub",
      "Captaincy",
      "Fighting Spirit",
      "No Look Pass"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 181,
      weight: 70,
      bodyType: "Normal"
    }
  },
  // Difensori
  {
    id: "vandijk_2024",
    name: "Virgil van Dijk",
    position: "CB",
    overall: 90,
    age: 33,
    nationality: "Netherlands",
    club: "Liverpool",
    preferredFoot: "Right",
    weakFoot: 3,
    injuryResistance: 4,
    form: "A",
    playstyle: "Build Up",
    aiPlaystyle: "Build Up",
    stats: {
      attacking: 40,
      ballControl: 85,
      dribbling: 75,
      finishing: 50,
      passing: 88,
      speed: 80,
      acceleration: 75,
      stamina: 85,
      defending: 95,
      physical: 90
    },
    skills: [
      "Heading",
      "Long Range Shooting",
      "Knuckle Shot",
      "Rising Shots",
      "Super Sub",
      "Captaincy",
      "Fighting Spirit",
      "No Look Pass",
      "Long Range Shooting",
      "Knuckle Shot"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 193,
      weight: 92,
      bodyType: "Tall"
    }
  },
  {
    id: "cafu_2024",
    name: "Cafu",
    position: "RB",
    overall: 89,
    age: 54,
    nationality: "Brazil",
    club: "Legends",
    preferredFoot: "Right",
    weakFoot: 4,
    injuryResistance: 4,
    form: "A",
    playstyle: "Offensive Full-back",
    aiPlaystyle: "Offensive Full-back",
    stats: {
      attacking: 75,
      ballControl: 88,
      dribbling: 85,
      finishing: 70,
      passing: 85,
      speed: 90,
      acceleration: 88,
      stamina: 90,
      defending: 85,
      physical: 80
    },
    skills: [
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass",
      "Long Range Shooting"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 176,
      weight: 74,
      bodyType: "Normal"
    }
  },
  // Portieri
  {
    id: "courtois_2024",
    name: "Thibaut Courtois",
    position: "GK",
    overall: 89,
    age: 32,
    nationality: "Belgium",
    club: "Real Madrid",
    preferredFoot: "Right",
    weakFoot: 3,
    injuryResistance: 4,
    form: "A",
    playstyle: "Offensive Goalkeeper",
    aiPlaystyle: "Offensive Goalkeeper",
    stats: {
      attacking: 20,
      ballControl: 85,
      dribbling: 60,
      finishing: 15,
      passing: 88,
      speed: 60,
      acceleration: 65,
      stamina: 85,
      defending: 95,
      physical: 90
    },
    skills: [
      "Long Range Shooting",
      "Knuckle Shot",
      "Rising Shots",
      "Super Sub",
      "Captaincy",
      "Fighting Spirit",
      "No Look Pass",
      "Long Range Shooting",
      "Knuckle Shot",
      "Rising Shots"
    ],
    playerSkills: [
      "Pinpoint Crossing",
      "Through Passing",
      "Weighted Pass",
      "Outside Curler",
      "Cut Behind & Turn",
      "Flip Flap",
      "Step On Skill Control",
      "Marseille Turn",
      "Sole Control",
      "No Look Pass"
    ],
    boosters: {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      speed: 0,
      physical: 0
    },
    physicalAttributes: {
      height: 199,
      weight: 96,
      bodyType: "Tall"
    }
  }
];

// Funzioni di utilità per il database
export const searchPlayers = (query, filters = {}) => {
  let results = playersDatabase;
  
  // Filtro per nome
  if (query) {
    results = results.filter(player => 
      player.name.toLowerCase().includes(query.toLowerCase()) ||
      player.club.toLowerCase().includes(query.toLowerCase()) ||
      player.nationality.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Filtri aggiuntivi
  if (filters.position) {
    results = results.filter(player => player.position === filters.position);
  }
  
  if (filters.overallMin) {
    results = results.filter(player => player.overall >= filters.overallMin);
  }
  
  if (filters.overallMax) {
    results = results.filter(player => player.overall <= filters.overallMax);
  }
  
  if (filters.club) {
    results = results.filter(player => 
      player.club.toLowerCase().includes(filters.club.toLowerCase())
    );
  }
  
  return results.sort((a, b) => b.overall - a.overall);
};

export const getPlayerById = (id) => {
  return playersDatabase.find(player => player.id === id);
};

export const getPlayersByPosition = (position) => {
  return playersDatabase.filter(player => player.position === position);
};

export const getTopPlayers = (limit = 10) => {
  return playersDatabase
    .sort((a, b) => b.overall - a.overall)
    .slice(0, limit);
};
