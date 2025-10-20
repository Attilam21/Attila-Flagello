import React from 'react';

const Formation2D = ({ formation, players, showDetails = false }) => {
  const styles = {
    container: {
      backgroundColor: '#1F2937',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #374151',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    formation: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#10B981',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    field: {
      backgroundColor: '#065F46',
      border: '2px solid #10B981',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
      position: 'relative',
      minHeight: '300px',
    },
    player: {
      position: 'absolute',
      backgroundColor: '#1F2937',
      color: '#E5E7EB',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      border: '1px solid #374151',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    playerHover: {
      backgroundColor: '#10B981',
      color: 'white',
      transform: 'scale(1.05)',
    },
    playersList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '0.5rem',
    },
    playerCard: {
      backgroundColor: '#374151',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #4B5563',
    },
    playerName: {
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '0.25rem',
    },
    playerPosition: {
      fontSize: '0.875rem',
      color: '#10B981',
      fontWeight: '500',
    },
    playerRole: {
      fontSize: '0.75rem',
      color: '#9CA3AF',
    },
  };

  // Posizioni predefinite per formazione 4-3-3
  const getPlayerPosition = (index, totalPlayers) => {
    const positions = [
      { x: 50, y: 90 }, // Portiere
      { x: 20, y: 70 }, // Difensore sinistro
      { x: 40, y: 70 }, // Difensore centrale sinistro
      { x: 60, y: 70 }, // Difensore centrale destro
      { x: 80, y: 70 }, // Difensore destro
      { x: 30, y: 50 }, // Centrocampista sinistro
      { x: 50, y: 50 }, // Centrocampista centrale
      { x: 70, y: 50 }, // Centrocampista destro
      { x: 20, y: 30 }, // Ala sinistra
      { x: 50, y: 30 }, // Attaccante centrale
      { x: 80, y: 30 }, // Ala destra
    ];

    return positions[index] || { x: 50, y: 50 };
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🏆 Formazione Squadra</h3>

      {formation && <div style={styles.formation}>{formation}</div>}

      <div style={styles.field}>
        {players &&
          players.map((player, index) => {
            const position = getPlayerPosition(index, players.length);
            return (
              <div
                key={index}
                style={{
                  ...styles.player,
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                title={`${player.name} - ${player.role}`}
              >
                {player.name}
                <br />
                <small style={{ color: '#10B981' }}>{player.position}</small>
              </div>
            );
          })}
      </div>

      {showDetails && players && (
        <div>
          <h4 style={{ color: '#E5E7EB', marginBottom: '0.75rem' }}>
            📋 Dettagli Giocatori
          </h4>
          <div style={styles.playersList}>
            {players.map((player, index) => (
              <div key={index} style={styles.playerCard}>
                <div style={styles.playerName}>{player.name}</div>
                <div style={styles.playerPosition}>{player.position}</div>
                <div style={styles.playerRole}>{player.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Formation2D;
