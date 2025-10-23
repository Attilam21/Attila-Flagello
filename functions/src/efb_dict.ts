export const ROLE_ALIASES: Record<string, string> = {
  // equivalenze ufficiali eFootball (IT → standard)
  PT: 'PT',
  GK: 'PT',
  DC: 'DC',
  CB: 'DC',
  MED: 'MED',
  DMF: 'MED',
  CC: 'CC',
  CMF: 'CC',
  TRQ: 'TRQ',
  AMF: 'TRQ',
  SP: 'SP',
  CF: 'SP',
  CLD: 'CLD',
  RWF: 'CLD',
  CLS: 'CLS',
  LWF: 'CLS',
  TD: 'TD',
  RB: 'TD',
  TS: 'TS',
  LB: 'TS',
};

export const STAT_LABELS_IT: Record<string, string> = {
  'Possesso di palla': 'poss',
  'Possesso palla': 'poss',
  'Tiri totali': 'tiri',
  'Tiri in porta': 'tiriporta',
  Passaggi: 'passaggi',
  'Passaggi riusciti': 'passaggiRiusciti',
  "Calci d'angolo": 'corner',
  Corner: 'corner',
  Falli: 'falli',
  Contrasti: 'contrasti',
  Parate: 'parate',
};

export const BUILD_TERMS = [
  'Finalizzatore',
  'Regista',
  'Box-to-Box',
  'Marcatore',
  'Trequartista',
  'Regista creativo',
  'Ala prolifica',
  'Collante',
  'Incontrista',
];

export const BOOSTER_TERMS = [
  'Difesa +2',
  'Tiro +2',
  'Velocità +2',
  'Passaggio +2',
  'Fisico +2',
];

export const SKILL_TERMS = [
  'Intercettazione',
  'Lancio lungo',
  'Passaggio filtrante',
  'Tiro a giro',
  'Muro',
  'Colpo di testa',
  'Rovesciata',
  'Scatto',
  'Dribbling',
];

export const IA_STYLE_TERMS = [
  'Funambolo',
  'Serpentina',
  'Treno in corsa',
  'Inserimento',
  'Esperto palle lunghe',
  'Crossatore',
  'Tiratore',
];
