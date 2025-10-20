import React, { useState, useEffect } from 'react';
import { Users, Target, Zap, Shield, Settings, Save, RotateCcw } from 'lucide-react';

const FormationBuilder = ({ players, onSave, onReset }) => {
  const [formation, setFormation] = useState('4-3-3');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [formationData, setFormationData] = useState({});
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);

  const formations = [
    { name: '4-3-3', description: 'Formazione offensiva equilibrata', positions: 11 },
    { name: '4-4-2', description: 'Formazione classica bilanciata', positions: 11 },
    { name: '3-5-2', description: 'Formazione con 3 difensori', positions: 11 },
    { name: '4-2-3-1', description: 'Formazione moderna con trequartista', positions: 11 },
    { name: '5-3-2', description: 'Formazione difensiva', positions: 11 }
  ];

  const positionMap = {
    '4-3-3': {
      GK: { x: 50, y: 95 },
      LB: { x: 15, y: 75 }, CB1: { x: 35, y: 80 }, CB2: { x: 65, y: 80 }, RB: { x: 85, y: 75 },
      CDM: { x: 50, y: 55 }, CM1: { x: 30, y: 45 }, CM2: { x: 70, y: 45 },
      LW: { x: 20, y: 25 }, ST: { x: 50, y: 15 }, RW: { x: 80, y: 25 }
    },
    '4-4-2': {
      GK: { x: 50, y: 95 },
      LB: { x: 15, y: 75 }, CB1: { x: 35, y: 80 }, CB2: { x: 65, y: 80 }, RB: { x: 85, y: 75 },
      LM: { x: 20, y: 50 }, CM1: { x: 40, y: 45 }, CM2: { x: 60, y: 45 }, RM: { x: 80, y: 50 },
      ST1: { x: 40, y: 15 }, ST2: { x: 60, y: 15 }
    },
    '3-5-2': {
      GK: { x: 50, y: 95 },
      CB1: { x: 25, y: 80 }, CB2: { x: 50, y: 85 }, CB3: { x: 75, y: 80 },
      LWB: { x: 15, y: 60 }, CDM: { x: 50, y: 55 }, CM1: { x: 30, y: 45 }, CM2: { x: 70, y: 45 }, RWB: { x: 85, y: 60 },
      ST1: { x: 40, y: 15 }, ST2: { x: 60, y: 15 }
    }
  };

  const getPositionForFormation = (pos, formation) => {
    return positionMap[formation]?.[pos] || { x: 50, y: 50 };
  };

  const handlePlayerDrop = (position) => {
    if (draggedPlayer) {
      setFormationData(prev => ({
        ...prev,
        [position]: draggedPlayer
      }));
      setDraggedPlayer(null);
    }
  };

  const handlePlayerDrag = (player) => {
    setDraggedPlayer(player);
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setShowPlayerDetails(true);
  };

  const calculateFormationStats = () => {
    const stats = {
      overallRating: 0,
      chemistry: 0,
      balance: 0,
      attack: 0,
      defense: 0,
      midfield: 0
    };

    const positions = Object.values(formationData);
    if (positions.length === 0) return stats;

    // Calculate overall rating
    stats.overallRating = Math.round(
      positions.reduce((sum, player) => sum + (player.rating || 0), 0) / positions.length
    );

    // Calculate chemistry based on player compatibility
    stats.chemistry = Math.min(100, positions.length * 9);

    // Calculate balance
    const attackPlayers = positions.filter(p => ['LW', 'RW', 'ST', 'ST1', 'ST2'].includes(p.position));
    const midfieldPlayers = positions.filter(p => ['CM', 'CM1', 'CM2', 'CDM', 'LM', 'RM'].includes(p.position));
    const defensePlayers = positions.filter(p => ['GK', 'LB', 'RB', 'CB', 'CB1', 'CB2', 'CB3'].includes(p.position));

    stats.attack = attackPlayers.length;
    stats.midfield = midfieldPlayers.length;
    stats.defense = defensePlayers.length;

    stats.balance = Math.abs(stats.attack - stats.defense) <= 1 ? 100 : 50;

    return stats;
  };

  const formationStats = calculateFormationStats();

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      minHeight: '100vh',
      padding: '2rem',
      color: 'white'
    },
    header: {
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#9CA3AF'
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    select: {
      padding: '0.75rem',
      backgroundColor: '#374151',
      border: '1px solid #4B5563',
      borderRadius: '0.5rem',
      color: '#E5E7EB',
      fontSize: '0.875rem'
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    resetButton: {
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: '2rem',
      alignItems: 'start'
    },
    fieldContainer: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563'
    },
    field: {
      position: 'relative',
      width: '100%',
      height: '500px',
      backgroundColor: '#10B981',
      borderRadius: '0.5rem',
      border: '2px solid #E5E7EB',
      overflow: 'hidden'
    },
    fieldLines: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      border: '2px solid #E5E7EB',
      borderRadius: '0.5rem'
    },
    centerLine: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#E5E7EB',
      transform: 'translateY(-50%)'
    },
    centerCircle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '80px',
      height: '80px',
      border: '2px solid #E5E7EB',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)'
    },
    penaltyArea: {
      position: 'absolute',
      top: '20px',
      left: '50%',
      width: '200px',
      height: '100px',
      border: '2px solid #E5E7EB',
      borderRadius: '0 0 100px 100px',
      transform: 'translateX(-50%)'
    },
    playerPosition: {
      position: 'absolute',
      width: '40px',
      height: '40px',
      backgroundColor: '#3B82F6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '2px solid #1E40AF',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.2s',
      zIndex: 10
    },
    playerPositionHover: {
      backgroundColor: '#1D4ED8',
      transform: 'translate(-50%, -50%) scale(1.1)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    playerNameShort: {
      fontSize: '0.75rem',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      lineHeight: 1
    },
    playerRatingSmall: {
      fontSize: '0.625rem',
      color: '#E5E7EB',
      textAlign: 'center'
    },
    sidebar: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563',
      height: 'fit-content'
    },
    sidebarTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    statCard: {
      backgroundColor: '#1F2937',
      padding: '1rem',
      borderRadius: '0.5rem',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '0.25rem'
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    playersList: {
      maxHeight: '300px',
      overflowY: 'auto'
    },
    playerItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem',
      backgroundColor: '#1F2937',
      borderRadius: '0.5rem',
      marginBottom: '0.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    playerItemHover: {
      backgroundColor: '#4B5563'
    },
    playerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    playerAvatar: {
      width: '32px',
      height: '32px',
      backgroundColor: '#3B82F6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      color: 'white'
    },
    playerDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    playerName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#E5E7EB'
    },
    playerPositionText: {
      fontSize: '0.75rem',
      color: '#9CA3AF'
    },
    playerRating: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: '#10B981'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📐 Costruttore Formazione</h1>
        <p style={styles.subtitle}>
          Crea e personalizza la tua formazione ideale
        </p>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <select
          style={styles.select}
          value={formation}
          onChange={(e) => setFormation(e.target.value)}
        >
          {formations.map(form => (
            <option key={form.name} value={form.name}>
              {form.name} - {form.description}
            </option>
          ))}
        </select>
        
        <button
          style={styles.button}
          onClick={() => onSave && onSave(formationData)}
        >
          <Save size={16} />
          Salva Formazione
        </button>
        
        <button
          style={styles.resetButton}
          onClick={() => {
            setFormationData({});
            onReset && onReset();
          }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Field */}
        <div style={styles.fieldContainer}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E5E7EB' }}>
            Campo di Gioco
          </h3>
          <div style={styles.field}>
            {/* Field Lines */}
            <div style={styles.fieldLines}>
              <div style={styles.centerLine} />
              <div style={styles.centerCircle} />
              <div style={styles.penaltyArea} />
            </div>

            {/* Player Positions */}
            {Object.entries(formationData).map(([position, player]) => {
              const coords = getPositionForFormation(position, formation);
              return (
                <div
                  key={position}
                  style={{
                    ...styles.playerPosition,
                    left: `${coords.x}%`,
                    top: `${coords.y}%`
                  }}
                  onClick={() => handlePlayerClick(player)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1D4ED8';
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3B82F6';
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={styles.playerNameShort}>
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={styles.playerRatingSmall}>{player.rating}</div>
                </div>
              );
            })}

            {/* Drop Zones */}
            {Object.entries(positionMap[formation] || {}).map(([position, coords]) => (
              <div
                key={position}
                style={{
                  position: 'absolute',
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  width: '40px',
                  height: '40px',
                  border: '2px dashed #6B7280',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handlePlayerDrop(position)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#6B7280';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>📊 Statistiche Formazione</h3>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{formationStats.overallRating}</div>
              <div style={styles.statLabel}>Rating Medio</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{formationStats.chemistry}%</div>
              <div style={styles.statLabel}>Chimica</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{formationStats.balance}%</div>
              <div style={styles.statLabel}>Bilanciamento</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{Object.keys(formationData).length}/11</div>
              <div style={styles.statLabel}>Giocatori</div>
            </div>
          </div>

          <h3 style={styles.sidebarTitle}>👥 Giocatori Disponibili</h3>
          <div style={styles.playersList}>
            {players.map((player) => (
              <div
                key={player.id}
                style={styles.playerItem}
                draggable
                onDragStart={() => handlePlayerDrag(player)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4B5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F2937';
                }}
              >
                <div style={styles.playerInfo}>
                  <div style={styles.playerAvatar}>
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={styles.playerDetails}>
                    <div style={styles.playerName}>{player.name}</div>
                    <div style={styles.playerPositionText}>{player.position}</div>
                  </div>
                </div>
                <div style={styles.playerRating}>{player.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationBuilder;
