import React from 'react';

const PlayerStatsAdvanced = ({ stats, showDetails = false }) => {
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
    },
    statCard: {
      backgroundColor: '#374151',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #4B5563',
      textAlign: 'center',
    },
    statName: {
      fontSize: '0.875rem',
      color: '#9CA3AF',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '0.25rem',
    },
    statBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#1F2937',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    statBarFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
    },
    overallRating: {
      textAlign: 'center',
      marginBottom: '1rem',
    },
    overallValue: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#10B981',
      marginBottom: '0.5rem',
    },
    overallLabel: {
      fontSize: '1rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  };

  const getStatColor = value => {
    if (value >= 90) return '#10B981'; // Verde
    if (value >= 80) return '#3B82F6'; // Blu
    if (value >= 70) return '#F59E0B'; // Giallo
    if (value >= 60) return '#EF4444'; // Rosso
    return '#6B7280'; // Grigio
  };

  const getStatLabel = statName => {
    const labels = {
      shooting: 'Tiro',
      passing: 'Passaggio',
      dribbling: 'Dribbling',
      defending: 'Difesa',
      physical: 'Fisico',
      speed: 'Velocità',
    };
    return labels[statName] || statName;
  };

  const calculateOverall = () => {
    if (!stats) return 0;
    const values = Object.values(stats).filter(v => typeof v === 'number');
    if (values.length === 0) return 0;
    return Math.round(
      values.reduce((sum, val) => sum + val, 0) / values.length
    );
  };

  const overall = calculateOverall();

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>⚽ Statistiche Giocatore</h3>

      {overall > 0 && (
        <div style={styles.overallRating}>
          <div style={styles.overallValue}>{overall}</div>
          <div style={styles.overallLabel}>Overall Rating</div>
        </div>
      )}

      {stats && (
        <div style={styles.statsGrid}>
          {Object.entries(stats).map(([statName, value]) => (
            <div key={statName} style={styles.statCard}>
              <div style={styles.statName}>{getStatLabel(statName)}</div>
              <div style={styles.statValue}>{value}</div>
              <div style={styles.statBar}>
                <div
                  style={{
                    ...styles.statBarFill,
                    width: `${value}%`,
                    backgroundColor: getStatColor(value),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetails && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#374151',
            borderRadius: '0.5rem',
          }}
        >
          <h4 style={{ color: '#E5E7EB', marginBottom: '0.5rem' }}>
            📊 Analisi Dettagliata
          </h4>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
            Le statistiche mostrano le abilità del giocatore in diverse aree del
            gioco. Valori alti indicano prestazioni superiori in quella
            specifica competenza.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsAdvanced;
