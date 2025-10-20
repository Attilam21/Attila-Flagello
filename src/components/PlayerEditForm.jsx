import React, { useState, useEffect } from 'react';

const PlayerEditForm = ({ player, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: 'GK',
    rating: 50,
    age: 18,
    nationality: '',
    team: '',
    
    // Statistiche Attacco
    attackingStats: {
      offensiveAwareness: 50,
      ballControl: 50,
      dribbling: 50,
      tightPossession: 50,
      lowPass: 50,
      loftedPass: 50,
      finishing: 50,
      heading: 50,
      placeKicking: 50,
      curl: 50
    },
    
    // Statistiche Difesa
    defendingStats: {
      defensiveAwareness: 50,
      defensiveEngagement: 50,
      tackling: 50,
      aggression: 50,
      goalkeeping: 40,
      gkCatching: 40,
      gkParrying: 40,
      gkReflexes: 40,
      gkReach: 40
    },
    
    // Statistiche Atletismo
    athleticStats: {
      speed: 50,
      acceleration: 50,
      kickingPower: 50,
      jumping: 50,
      physicalContact: 50,
      balance: 50,
      stamina: 50
    },
    
    // Caratteristiche Fisiche
    physical: {
      height: 180,
      weight: 70,
      preferredFoot: 'Right'
    },
    
    // Caratteristiche Avanzate
    advanced: {
      weakFootFrequency: 2,
      weakFootAccuracy: 2,
      form: 2,
      injuryResistance: 1
    },
    
    // Abilità Speciali
    abilities: [],
    aiPlayStyles: [],
    boosters: [],
    
    // Contratto
    contract: {
      salary: 1000000,
      expiry: '2025-06-30',
      releaseClause: 10000000
    }
  });

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        position: player.position || 'GK',
        rating: player.rating || 50,
        age: player.age || 18,
        nationality: player.nationality || '',
        team: player.team || '',
        
        attackingStats: { ...formData.attackingStats, ...player.attackingStats },
        defendingStats: { ...formData.defendingStats, ...player.defendingStats },
        athleticStats: { ...formData.athleticStats, ...player.athleticStats },
        physical: { ...formData.physical, ...player.physical },
        advanced: { ...formData.advanced, ...player.advanced },
        abilities: player.abilities || [],
        aiPlayStyles: player.aiPlayStyles || [],
        boosters: player.boosters || [],
        contract: { ...formData.contract, ...player.contract }
      });
    }
  }, [player]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, value, action) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      let newArray;
      
      if (action === 'add') {
        newArray = [...currentArray, value];
      } else if (action === 'remove') {
        newArray = currentArray.filter(item => item !== value);
      }
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  // Opzioni per i dropdown
  const positions = [
    'GK', 'CB', 'LB', 'RB', 'CDM', 'CMF', 'AMF', 'LMF', 'RMF', 
    'LW', 'RW', 'SS', 'CF'
  ];

  const abilities = [
    'Elastico', 'Sombrero', 'Finta di forbici', 'Roulette', 'Step Over',
    'Cross Calibrato', 'Passaggio Filtrante', 'Tiro a Giro', 'Colpo di Testa',
    'Marcatore', 'Scivolata', 'Intercettazione', 'Parata', 'Uscite',
    'Distribuzione', 'Riflessi', 'Leader', 'Spirito Combattivo'
  ];

  const aiPlayStyles = [
    'Goal Poacher', 'Dummy Runner', 'Fox in the Box', 'Target Man',
    'Creative Playmaker', 'Advanced Playmaker', 'Box-to-Box', 'Anchor Man',
    'Destroyer', 'Orchestrator', 'Roaming Flank', 'Cross Specialist',
    'Defensive Full-back', 'Offensive Full-back', 'Extra Frontman',
    'Defensive Goalkeeper', 'Offensive Goalkeeper'
  ];

  const boosterTypes = [
    'Attacco', 'Difesa', 'Fisico', 'Velocità', 'Passaggio', 'Tiro',
    'Controllo', 'Resistenza', 'Salto', 'Equilibrio'
  ];

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: '#1F2937',
      borderRadius: '0.75rem',
      padding: '2rem',
      maxWidth: '1000px',
      width: '95%',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid #374151'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #374151'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB'
    },
    closeButton: {
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    form: {
      display: 'grid',
      gap: '1.5rem'
    },
    section: {
      backgroundColor: '#374151',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      border: '1px solid #4B5563'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#E5E7EB'
    },
    input: {
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #4B5563',
      backgroundColor: '#2D3748',
      color: '#E5E7EB',
      fontSize: '0.875rem'
    },
    select: {
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #4B5563',
      backgroundColor: '#2D3748',
      color: '#E5E7EB',
      fontSize: '0.875rem'
    },
    range: {
      width: '100%',
      height: '6px',
      borderRadius: '3px',
      background: '#4B5563',
      outline: 'none',
      appearance: 'none'
    },
    rangeValue: {
      fontSize: '0.875rem',
      color: '#10B981',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: '0.25rem'
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: '#10B981',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      fontSize: '0.75rem',
      margin: '0.25rem'
    },
    chipRemove: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '0.875rem',
      padding: '0'
    },
    addButton: {
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      marginTop: '0.5rem'
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      marginTop: '2rem',
      paddingTop: '1rem',
      borderTop: '1px solid #374151'
    },
    saveButton: {
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600'
    },
    cancelButton: {
      backgroundColor: '#6B7280',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600'
    }
  };

  const renderStatField = (label, field, value, min = 0, max = 100) => (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
        style={styles.range}
      />
      <div style={styles.rangeValue}>{value}</div>
    </div>
  );

  const renderArrayField = (label, field, options, selectedItems) => (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <div style={{ marginBottom: '0.5rem' }}>
        {selectedItems.map((item, index) => (
          <span key={index} style={styles.chip}>
            {item}
            <button
              onClick={() => handleArrayChange(field, item, 'remove')}
              style={styles.chipRemove}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <select
        onChange={(e) => {
          if (e.target.value && !selectedItems.includes(e.target.value)) {
            handleArrayChange(field, e.target.value, 'add');
          }
          e.target.value = '';
        }}
        style={styles.select}
      >
        <option value="">Seleziona {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {player ? 'Modifica Giocatore' : 'Aggiungi Nuovo Giocatore'}
          </h2>
          <button onClick={onCancel} style={styles.closeButton}>
            ✕ Chiudi
          </button>
        </div>

        <div style={styles.form}>
          {/* Informazioni Base */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📋 Informazioni Base</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={styles.input}
                  placeholder="Nome del giocatore"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Posizione</label>
                <select
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  style={styles.select}
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Rating</label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Età</label>
                <input
                  type="number"
                  min="16"
                  max="45"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Nazionalità</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  style={styles.input}
                  placeholder="Es. Italia"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Squadra</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => handleInputChange('team', e.target.value)}
                  style={styles.input}
                  placeholder="Es. Juventus"
                />
              </div>
            </div>
          </div>

          {/* Caratteristiche Fisiche */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🏃 Caratteristiche Fisiche</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Altezza (cm)</label>
                <input
                  type="number"
                  min="150"
                  max="220"
                  value={formData.physical.height}
                  onChange={(e) => handleInputChange('physical.height', parseInt(e.target.value))}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Peso (kg)</label>
                <input
                  type="number"
                  min="50"
                  max="120"
                  value={formData.physical.weight}
                  onChange={(e) => handleInputChange('physical.weight', parseInt(e.target.value))}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Piede Preferito</label>
                <select
                  value={formData.physical.preferredFoot}
                  onChange={(e) => handleInputChange('physical.preferredFoot', e.target.value)}
                  style={styles.select}
                >
                  <option value="Right">Destro</option>
                  <option value="Left">Sinistro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistiche Attacco */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⚽ Statistiche Attacco</h3>
            <div style={styles.grid}>
              {renderStatField('Consapevolezza Offensiva', 'attackingStats.offensiveAwareness', formData.attackingStats.offensiveAwareness)}
              {renderStatField('Controllo Palla', 'attackingStats.ballControl', formData.attackingStats.ballControl)}
              {renderStatField('Dribbling', 'attackingStats.dribbling', formData.attackingStats.dribbling)}
              {renderStatField('Possesso Stretto', 'attackingStats.tightPossession', formData.attackingStats.tightPossession)}
              {renderStatField('Passaggio Basso', 'attackingStats.lowPass', formData.attackingStats.lowPass)}
              {renderStatField('Passaggio Alto', 'attackingStats.loftedPass', formData.attackingStats.loftedPass)}
              {renderStatField('Finalizzazione', 'attackingStats.finishing', formData.attackingStats.finishing)}
              {renderStatField('Colpo di Testa', 'attackingStats.heading', formData.attackingStats.heading)}
              {renderStatField('Calci Piazzati', 'attackingStats.placeKicking', formData.attackingStats.placeKicking)}
              {renderStatField('Curva', 'attackingStats.curl', formData.attackingStats.curl)}
            </div>
          </div>

          {/* Statistiche Difesa */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🛡️ Statistiche Difesa</h3>
            <div style={styles.grid}>
              {renderStatField('Consapevolezza Difensiva', 'defendingStats.defensiveAwareness', formData.defendingStats.defensiveAwareness)}
              {renderStatField('Impegno Difensivo', 'defendingStats.defensiveEngagement', formData.defendingStats.defensiveEngagement)}
              {renderStatField('Contrasto', 'defendingStats.tackling', formData.defendingStats.tackling)}
              {renderStatField('Aggressione', 'defendingStats.aggression', formData.defendingStats.aggression)}
              {renderStatField('Portiere', 'defendingStats.goalkeeping', formData.defendingStats.goalkeeping)}
              {renderStatField('Cattura GK', 'defendingStats.gkCatching', formData.defendingStats.gkCatching)}
              {renderStatField('Parata GK', 'defendingStats.gkParrying', formData.defendingStats.gkParrying)}
              {renderStatField('Riflessi GK', 'defendingStats.gkReflexes', formData.defendingStats.gkReflexes)}
              {renderStatField('Raggiungimento GK', 'defendingStats.gkReach', formData.defendingStats.gkReach)}
            </div>
          </div>

          {/* Statistiche Atletismo */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💪 Statistiche Atletismo</h3>
            <div style={styles.grid}>
              {renderStatField('Velocità', 'athleticStats.speed', formData.athleticStats.speed)}
              {renderStatField('Accelerazione', 'athleticStats.acceleration', formData.athleticStats.acceleration)}
              {renderStatField('Potenza di Calcio', 'athleticStats.kickingPower', formData.athleticStats.kickingPower)}
              {renderStatField('Salto', 'athleticStats.jumping', formData.athleticStats.jumping)}
              {renderStatField('Contatto Fisico', 'athleticStats.physicalContact', formData.athleticStats.physicalContact)}
              {renderStatField('Equilibrio', 'athleticStats.balance', formData.athleticStats.balance)}
              {renderStatField('Resistenza', 'athleticStats.stamina', formData.athleticStats.stamina)}
            </div>
          </div>

          {/* Caratteristiche Avanzate */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🎯 Caratteristiche Avanzate</h3>
            <div style={styles.grid}>
              {renderStatField('Uso Piede Debole', 'advanced.weakFootFrequency', formData.advanced.weakFootFrequency, 1, 4)}
              {renderStatField('Precisione Piede Debole', 'advanced.weakFootAccuracy', formData.advanced.weakFootAccuracy, 1, 4)}
              {renderStatField('Forma', 'advanced.form', formData.advanced.form, 1, 4)}
              {renderStatField('Resistenza Infortuni', 'advanced.injuryResistance', formData.advanced.injuryResistance, 1, 4)}
            </div>
          </div>

          {/* Abilità e Stili */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⭐ Abilità e Stili di Gioco</h3>
            <div style={styles.grid}>
              {renderArrayField('Abilità Speciali', 'abilities', abilities, formData.abilities)}
              {renderArrayField('Stili di Gioco IA', 'aiPlayStyles', aiPlayStyles, formData.aiPlayStyles)}
            </div>
          </div>

          {/* Azioni */}
          <div style={styles.actions}>
            <button onClick={onCancel} style={styles.cancelButton}>
              Annulla
            </button>
            <button onClick={handleSave} style={styles.saveButton}>
              💾 Salva Giocatore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerEditForm;