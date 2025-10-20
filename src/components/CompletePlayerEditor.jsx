import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  Star,
  Target,
  Zap,
  Shield,
  Activity,
  Users,
  Trophy,
  Settings,
} from 'lucide-react';

const CompletePlayerEditor = ({ player, onSave, onClose, isOpen }) => {
  const [editedPlayer, setEditedPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');

  // Inizializza il giocatore
  useEffect(() => {
    if (player) {
      setEditedPlayer({
        ...player,
        // Assicurati che tutti i campi esistano
        stats: {
          // Attacco
          offensiveAwareness: player.stats?.offensiveAwareness || 80,
          ballControl: player.stats?.ballControl || 80,
          dribbling: player.stats?.dribbling || 80,
          tightPossession: player.stats?.tightPossession || 80,
          lowPass: player.stats?.lowPass || 80,
          loftedPass: player.stats?.loftedPass || 80,
          finishing: player.stats?.finishing || 80,
          heading: player.stats?.heading || 80,
          placeKicking: player.stats?.placeKicking || 80,
          curl: player.stats?.curl || 80,

          // Difesa
          defensiveAwareness: player.stats?.defensiveAwareness || 50,
          tackling: player.stats?.tackling || 50,
          interception: player.stats?.interception || 50,
          aggression: player.stats?.aggression || 50,
          goalkeeping: player.stats?.goalkeeping || 40,
          gkCatching: player.stats?.gkCatching || 40,
          gkParrying: player.stats?.gkParrying || 40,
          gkReflexes: player.stats?.gkReflexes || 40,
          gkReach: player.stats?.gkReach || 40,

          // Fisico
          speed: player.stats?.speed || 80,
          acceleration: player.stats?.acceleration || 80,
          kickingPower: player.stats?.kickingPower || 80,
          jump: player.stats?.jump || 80,
          physicalContact: player.stats?.physicalContact || 80,
          balance: player.stats?.balance || 80,
          stamina: player.stats?.stamina || 80,
        },
        skills: player.skills || [],
        communicationSkills: player.communicationSkills || [],
        boosters: player.boosters || [],
        form: player.form || 'B',
        injuryResistance: player.injuryResistance || 1,
        weakFoot: player.weakFoot || 2,
        weakFootAccuracy: player.weakFootAccuracy || 2,
      });
    } else {
      // Nuovo giocatore - inizializza con valori di default
      setEditedPlayer({
        name: '',
        position: 'CF',
        rating: 80,
        age: 25,
        nationality: '',
        team: '',
        stats: {
          // Attacco
          offensiveAwareness: 80,
          ballControl: 80,
          dribbling: 80,
          tightPossession: 80,
          lowPass: 80,
          loftedPass: 80,
          finishing: 80,
          heading: 80,
          placeKicking: 80,
          curl: 80,

          // Difesa
          defensiveAwareness: 50,
          tackling: 50,
          interception: 50,
          aggression: 50,
          goalkeeping: 40,
          gkCatching: 40,
          gkParrying: 40,
          gkReflexes: 40,
          gkReach: 40,

          // Fisico
          speed: 80,
          acceleration: 80,
          kickingPower: 80,
          jump: 80,
          physicalContact: 80,
          balance: 80,
          stamina: 80,
        },
        skills: [],
        communicationSkills: [],
        boosters: [],
        form: 'B',
        injuryResistance: 1,
        weakFoot: 2,
        weakFootAccuracy: 2,
        physical: {
          height: 180,
          weight: 75,
          preferredFoot: 'Right',
        },
      });
    }
  }, [player]);

  const handleStatChange = (category, stat, value) => {
    setEditedPlayer(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: Math.max(0, Math.min(99, parseInt(value) || 0)),
      },
    }));
  };

  const handleBasicInfoChange = (field, value) => {
    setEditedPlayer(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (editedPlayer) {
      onSave(editedPlayer);
    }
  };

  const handleAddSkill = (type) => {
    const skillName = prompt(`Inserisci il nome dell'abilità ${type === 'skills' ? 'giocatore' : 'comunicazione'}:`);
    if (skillName && skillName.trim()) {
      setEditedPlayer(prev => ({
        ...prev,
        [type]: [...prev[type], skillName.trim()]
      }));
    }
  };

  const handleRemoveSkill = (type, index) => {
    setEditedPlayer(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const getStatColor = value => {
    if (value >= 90) return '#10B981'; // Verde
    if (value >= 80) return '#3B82F6'; // Blu
    if (value >= 70) return '#F59E0B'; // Giallo
    if (value >= 60) return '#EF4444'; // Rosso
    return '#6B7280'; // Grigio
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    },
    modal: {
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '1400px',
      maxHeight: '95vh',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      padding: '1.5rem',
      borderBottom: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    sidebar: {
      width: '300px',
      backgroundColor: '#2a2a2a',
      borderRight: '1px solid #333',
      padding: '1rem',
      overflow: 'auto',
    },
    playerCard: {
      backgroundColor: '#333',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    playerImage: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#555',
      margin: '0 auto 0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
    },
    playerName: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '0.25rem',
    },
    playerRating: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#3B82F6',
      marginBottom: '0.5rem',
    },
    playerInfo: {
      fontSize: '0.875rem',
      color: '#ccc',
      marginBottom: '0.25rem',
    },
    tabs: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    tab: {
      padding: '0.75rem 1rem',
      backgroundColor: '#444',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
    },
    tabActive: {
      backgroundColor: '#3B82F6',
      transform: 'translateX(4px)',
    },
    mainContent: {
      flex: 1,
      padding: '1.5rem',
      overflow: 'auto',
    },
    section: {
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
    },
    statGroup: {
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '1rem',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
      padding: '0.5rem',
      backgroundColor: '#333',
      borderRadius: '6px',
    },
    statLabel: {
      color: '#ccc',
      fontSize: '0.875rem',
      flex: 1,
    },
    statValue: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    statInput: {
      width: '60px',
      padding: '0.25rem 0.5rem',
      backgroundColor: '#1a1a1a',
      border: '1px solid #444',
      borderRadius: '4px',
      color: '#fff',
      textAlign: 'center',
      fontSize: '0.875rem',
    },
    statBar: {
      width: '100px',
      height: '6px',
      backgroundColor: '#444',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    statBarFill: {
      height: '100%',
      borderRadius: '3px',
      transition: 'all 0.3s',
    },
    basicInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      color: '#ccc',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    input: {
      padding: '0.75rem',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '0.875rem',
    },
    select: {
      padding: '0.75rem',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '0.875rem',
    },
    skillsSection: {
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '1rem',
    },
    skillTag: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      backgroundColor: '#3B82F6',
      color: '#fff',
      borderRadius: '4px',
      fontSize: '0.75rem',
      margin: '0.25rem',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      padding: '1rem',
      borderTop: '1px solid #333',
    },
    saveButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#10B981',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    cancelButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#6B7280',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
    },
  };

  if (!isOpen) return null;
  
  // Mostra loading se editedPlayer non è ancora inizializzato
  if (!editedPlayer) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: '#1F2937',
          padding: '2rem',
          borderRadius: '0.75rem',
          color: 'white',
          textAlign: 'center',
        }}>
          <div>Caricamento editor...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Info Base', icon: Users },
    { id: 'stats', label: 'Statistiche', icon: Target },
    { id: 'skills', label: 'Abilità', icon: Star },
    { id: 'physical', label: 'Fisico', icon: Activity },
    { id: 'settings', label: 'Impostazioni', icon: Settings },
  ];

  const attackingStats = [
    { key: 'offensiveAwareness', label: 'Consapevolezza Offensiva' },
    { key: 'ballControl', label: 'Controllo Palla' },
    { key: 'dribbling', label: 'Dribbling' },
    { key: 'tightPossession', label: 'Possesso Palla Stretto' },
    { key: 'lowPass', label: 'Passaggio Basso' },
    { key: 'loftedPass', label: 'Passaggio Alto' },
    { key: 'finishing', label: 'Finitura' },
    { key: 'heading', label: 'Intestazione' },
    { key: 'placeKicking', label: 'Calci Piazzati' },
    { key: 'curl', label: 'Arricciare' },
  ];

  const defendingStats = [
    { key: 'defensiveAwareness', label: 'Consapevolezza Difensiva' },
    { key: 'tackling', label: 'Tackling' },
    { key: 'interception', label: 'Intercettazione' },
    { key: 'aggression', label: 'Aggressione' },
    { key: 'goalkeeping', label: 'Portiere' },
    { key: 'gkCatching', label: 'Cattura GK' },
    { key: 'gkParrying', label: 'Parata GK' },
    { key: 'gkReflexes', label: 'Riflessi GK' },
    { key: 'gkReach', label: 'Raggiungimento GK' },
  ];

  const physicalStats = [
    { key: 'speed', label: 'Velocità' },
    { key: 'acceleration', label: 'Accelerazione' },
    { key: 'kickingPower', label: 'Potenza di Calcio' },
    { key: 'jump', label: 'Salto' },
    { key: 'physicalContact', label: 'Contatto Fisico' },
    { key: 'balance', label: 'Bilanciamento' },
    { key: 'stamina', label: 'Resistenza' },
  ];

  const renderStatItem = stat => (
    <div key={stat.key} style={styles.statItem}>
      <span style={styles.statLabel}>{stat.label}</span>
      <div style={styles.statValue}>
        <input
          type="number"
          min="0"
          max="99"
          value={editedPlayer.stats[stat.key]}
          onChange={e => handleStatChange('stats', stat.key, e.target.value)}
          style={styles.statInput}
        />
        <div style={styles.statBar}>
          <div
            style={{
              ...styles.statBarFill,
              width: `${(editedPlayer.stats[stat.key] / 99) * 100}%`,
              backgroundColor: getStatColor(editedPlayer.stats[stat.key]),
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div style={styles.section}>
            <div style={styles.basicInfo}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nome</label>
                <input
                  type="text"
                  value={editedPlayer.name}
                  onChange={e => handleBasicInfoChange('name', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Posizione</label>
                <select
                  value={editedPlayer.position}
                  onChange={e =>
                    handleBasicInfoChange('position', e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="GK">Portiere</option>
                  <option value="CB">Difensore Centrale</option>
                  <option value="LB">Terzino Sinistro</option>
                  <option value="RB">Terzino Destro</option>
                  <option value="DMF">Mediano</option>
                  <option value="CMF">Centrocampista</option>
                  <option value="LMF">Esterno Sinistro</option>
                  <option value="RMF">Esterno Destro</option>
                  <option value="AMF">Trequartista</option>
                  <option value="LWF">Ala Sinistra</option>
                  <option value="RWF">Ala Destra</option>
                  <option value="SS">Seconda Punta</option>
                  <option value="CF">Attaccante</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Club</label>
                <input
                  type="text"
                  value={editedPlayer.club}
                  onChange={e => handleBasicInfoChange('club', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nazionalità</label>
                <input
                  type="text"
                  value={editedPlayer.nationality}
                  onChange={e =>
                    handleBasicInfoChange('nationality', e.target.value)
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Età</label>
                <input
                  type="number"
                  min="16"
                  max="45"
                  value={editedPlayer.age}
                  onChange={e => handleBasicInfoChange('age', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Altezza (cm)</label>
                <input
                  type="number"
                  min="150"
                  max="220"
                  value={editedPlayer.height}
                  onChange={e =>
                    handleBasicInfoChange('height', e.target.value)
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Peso (kg)</label>
                <input
                  type="number"
                  min="50"
                  max="120"
                  value={editedPlayer.weight}
                  onChange={e =>
                    handleBasicInfoChange('weight', e.target.value)
                  }
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div style={styles.section}>
            <div style={styles.statsGrid}>
              <div style={styles.statGroup}>
                <h3 style={styles.sectionTitle}>
                  <Target size={20} />
                  Attacco
                </h3>
                {attackingStats.map(renderStatItem)}
              </div>
              <div style={styles.statGroup}>
                <h3 style={styles.sectionTitle}>
                  <Shield size={20} />
                  Difesa
                </h3>
                {defendingStats.map(renderStatItem)}
              </div>
            </div>
          </div>
        );

      case 'physical':
        return (
          <div style={styles.section}>
            <div style={styles.statGroup}>
              <h3 style={styles.sectionTitle}>
                <Activity size={20} />
                Attributi Fisici
              </h3>
              {physicalStats.map(renderStatItem)}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div style={styles.section}>
            <div style={styles.skillsSection}>
              <h3 style={styles.sectionTitle}>
                <Star size={20} />
                Abilità e Competenze
              </h3>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ color: '#ccc', margin: 0 }}>
                    Abilità Giocatore
                  </h4>
                  <button 
                    onClick={() => handleAddSkill('skills')}
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Aggiungi
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {editedPlayer.skills.map((skill, index) => (
                    <span key={index} style={{...styles.skillTag, position: 'relative'}}>
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill('skills', index)}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          fontSize: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ color: '#ccc', margin: 0 }}>
                    Abilità di Comunicazione
                  </h4>
                  <button 
                    onClick={() => handleAddSkill('communicationSkills')}
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Aggiungi
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {editedPlayer.communicationSkills.map((skill, index) => (
                    <span key={index} style={{...styles.skillTag, position: 'relative'}}>
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill('communicationSkills', index)}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          fontSize: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div style={styles.section}>
            <div style={styles.basicInfo}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Form</label>
                <select
                  value={editedPlayer.form}
                  onChange={e => handleBasicInfoChange('form', e.target.value)}
                  style={styles.select}
                >
                  <option value="A">A (Eccellente)</option>
                  <option value="B">B (Buono)</option>
                  <option value="C">C (Normale)</option>
                  <option value="D">D (Scarso)</option>
                  <option value="E">E (Pessimo)</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Piede Debole</label>
                <select
                  value={editedPlayer.weakFoot}
                  onChange={e =>
                    handleBasicInfoChange('weakFoot', e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="1">1 (Mono-piede)</option>
                  <option value="2">2 (Piede debole limitato)</option>
                  <option value="3">3 (Piede debole normale)</option>
                  <option value="4">4 (Piede debole buono)</option>
                  <option value="5">5 (Ambidestro)</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Precisione Piede Debole</label>
                <select
                  value={editedPlayer.weakFootAccuracy}
                  onChange={e =>
                    handleBasicInfoChange('weakFootAccuracy', e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Resistenza Infortuni</label>
                <select
                  value={editedPlayer.injuryResistance}
                  onChange={e =>
                    handleBasicInfoChange('injuryResistance', e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="1">1 (Fragile)</option>
                  <option value="2">2 (Normale)</option>
                  <option value="3">3 (Resistente)</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            <Settings size={24} />
            Editor Giocatore - {editedPlayer.name}
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.sidebar}>
            <div style={styles.playerCard}>
              <div style={styles.playerImage}>⚽</div>
              <div style={styles.playerName}>{editedPlayer.name}</div>
              <div style={styles.playerRating}>{editedPlayer.overall}</div>
              <div style={styles.playerInfo}>
                {editedPlayer.position} • {editedPlayer.club}
              </div>
              <div style={styles.playerInfo}>
                {editedPlayer.nationality} • {editedPlayer.age} anni
              </div>
            </div>

            <div style={styles.tabs}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    style={{
                      ...styles.tab,
                      ...(activeTab === tab.id ? styles.tabActive : {}),
                    }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.mainContent}>{renderTabContent()}</div>
        </div>

        <div style={styles.actions}>
          <button style={styles.cancelButton} onClick={onClose}>
            <X size={16} />
            Annulla
          </button>
          <button style={styles.saveButton} onClick={handleSave}>
            <Save size={16} />
            Salva Modifiche
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletePlayerEditor;
