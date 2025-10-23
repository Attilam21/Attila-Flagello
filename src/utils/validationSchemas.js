// Schema di validazione per dati Firebase
export const validationSchemas = {
  // Schema per giocatori
  player: {
    required: ['nome', 'ruoloPrimario', 'carta'],
    properties: {
      nome: { type: 'string', minLength: 2, maxLength: 50 },
      ruoloPrimario: {
        type: 'string',
        enum: ['PT', 'TD', 'DC', 'TS', 'CC', 'AS', 'AD', 'ATT'],
      },
      carta: {
        type: 'object',
        required: ['complessivamente'],
        properties: {
          complessivamente: { type: 'number', minimum: 0, maximum: 100 },
        },
      },
      isTitolare: { type: 'boolean' },
      createdAt: { type: 'timestamp' },
    },
  },

  // Schema per partite
  match: {
    required: ['userId', 'stats', 'createdAt'],
    properties: {
      userId: { type: 'string' },
      stats: {
        type: 'object',
        properties: {
          possesso: { type: 'number', minimum: 0, maximum: 100 },
          tiri: { type: 'number', minimum: 0 },
          tiriInPorta: { type: 'number', minimum: 0 },
          passaggi: { type: 'number', minimum: 0 },
          passaggiRiusciti: { type: 'number', minimum: 0 },
          corner: { type: 'number', minimum: 0 },
          falli: { type: 'number', minimum: 0 },
          golSegnati: { type: 'number', minimum: 0 },
          golSubiti: { type: 'number', minimum: 0 },
        },
      },
      ratings: {
        type: 'array',
        items: {
          type: 'object',
          required: ['player', 'rating'],
          properties: {
            player: { type: 'string' },
            rating: { type: 'number', minimum: 0, maximum: 10 },
            role: { type: 'string' },
            isProfiled: { type: 'boolean' },
          },
        },
      },
      createdAt: { type: 'timestamp' },
      source: { type: 'string' },
    },
  },

  // Schema per dashboard stats
  dashboardStats: {
    required: ['lastMatch', 'lastUpdated'],
    properties: {
      lastMatch: {
        type: 'object',
        properties: {
          possesso: { type: 'number', minimum: 0, maximum: 100 },
          tiriInPorta: { type: 'number', minimum: 0 },
          tiri: { type: 'number', minimum: 0 },
          passaggi: { type: 'number', minimum: 0 },
          passaggiRiusciti: { type: 'number', minimum: 0 },
          corner: { type: 'number', minimum: 0 },
          falli: { type: 'number', minimum: 0 },
          fuorigioco: { type: 'number', minimum: 0 },
          parate: { type: 'number', minimum: 0 },
          golSegnati: { type: 'number', minimum: 0 },
          golSubiti: { type: 'number', minimum: 0 },
        },
      },
      lastUpdated: { type: 'timestamp' },
      source: { type: 'string' },
    },
  },

  // Schema per task
  task: {
    required: ['userId', 'title', 'priority', 'status'],
    properties: {
      userId: { type: 'string' },
      title: { type: 'string', minLength: 5, maxLength: 100 },
      description: { type: 'string', maxLength: 500 },
      priority: { type: 'string', enum: ['Alta', 'Media', 'Bassa'] },
      impact: { type: 'string', enum: ['Alto', 'Medio', 'Basso'] },
      category: { type: 'string' },
      status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
      createdAt: { type: 'timestamp' },
      source: { type: 'string' },
    },
  },
};

// Funzione di validazione
export const validateData = (schema, data) => {
  const errors = [];

  // Validazione campi richiesti
  if (schema.required) {
    schema.required.forEach(field => {
      if (!data[field]) {
        errors.push(`Campo richiesto mancante: ${field}`);
      }
    });
  }

  // Validazione proprietà
  if (schema.properties && data) {
    Object.entries(schema.properties).forEach(([key, rules]) => {
      const value = data[key];

      if (value !== undefined) {
        // Validazione tipo
        if (rules.type === 'string' && typeof value !== 'string') {
          errors.push(`${key} deve essere una stringa`);
        }
        if (rules.type === 'number' && typeof value !== 'number') {
          errors.push(`${key} deve essere un numero`);
        }
        if (rules.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`${key} deve essere un booleano`);
        }
        if (rules.type === 'object' && typeof value !== 'object') {
          errors.push(`${key} deve essere un oggetto`);
        }
        if (rules.type === 'array' && !Array.isArray(value)) {
          errors.push(`${key} deve essere un array`);
        }

        // Validazione lunghezza stringa
        if (
          rules.type === 'string' &&
          rules.minLength &&
          value.length < rules.minLength
        ) {
          errors.push(`${key} deve essere almeno ${rules.minLength} caratteri`);
        }
        if (
          rules.type === 'string' &&
          rules.maxLength &&
          value.length > rules.maxLength
        ) {
          errors.push(
            `${key} deve essere massimo ${rules.maxLength} caratteri`
          );
        }

        // Validazione range numerico
        if (
          rules.type === 'number' &&
          rules.minimum !== undefined &&
          value < rules.minimum
        ) {
          errors.push(`${key} deve essere almeno ${rules.minimum}`);
        }
        if (
          rules.type === 'number' &&
          rules.maximum !== undefined &&
          value > rules.maximum
        ) {
          errors.push(`${key} deve essere massimo ${rules.maximum}`);
        }

        // Validazione enum
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(
            `${key} deve essere uno dei valori: ${rules.enum.join(', ')}`
          );
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Funzione di sanitizzazione dati
export const sanitizeData = (schema, data) => {
  const sanitized = { ...data };

  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, rules]) => {
      const value = sanitized[key];

      if (value !== undefined) {
        // Sanitizzazione stringhe
        if (rules.type === 'string' && typeof value === 'string') {
          sanitized[key] = value.trim();
        }

        // Sanitizzazione numeri
        if (rules.type === 'number' && typeof value === 'number') {
          if (rules.minimum !== undefined && value < rules.minimum) {
            sanitized[key] = rules.minimum;
          }
          if (rules.maximum !== undefined && value > rules.maximum) {
            sanitized[key] = rules.maximum;
          }
        }

        // Sanitizzazione timestamp
        if (rules.type === 'timestamp' && !(value instanceof Date)) {
          sanitized[key] = new Date();
        }
      }
    });
  }

  return sanitized;
};
