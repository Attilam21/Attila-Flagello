import React, { useState } from 'react';

const PlayerAnalysis = ({ analysis, showDetails = false }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getRatingColor = (rating) => {
    if (rating >= 80) return '#10B981'; // Verde
    if (rating >= 60) return '#3B82F6'; // Blu
    if (rating >= 40) return '#F59E0B'; // Giallo
    return '#EF4444'; // Rosso
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #374151'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #374151'
    },
    playerName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB'
    },
    overallRating: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#10B981'
    },
    section: {
      marginBottom: '1rem',
      backgroundColor: '#374151',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#4B5563',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    sectionTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#E5E7EB'
    },
    sectionRating: {
      fontSize: '1.2rem',
      fontWeight: 'bold'
    },
    sectionContent: {
      padding: '1rem',
      backgroundColor: '#374151'
    },
    suggestion: {
      padding: '0.75rem',
      marginBottom: '0.5rem',
      borderRadius: '0.375rem',
      borderLeft: '4px solid',
      backgroundColor: '#1F2937'
    },
    suggestionHigh: {
      borderLeftColor: '#EF4444',
      backgroundColor: '#FEF2F2'
    },
    suggestionMedium: {
      borderLeftColor: '#F59E0B',
      backgroundColor: '#FFFBEB'
    },
    suggestionLow: {
      borderLeftColor: '#3B82F6',
      backgroundColor: '#EFF6FF'
    },
    suggestionText: {
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.25rem'
    },
    suggestionAction: {
      fontSize: '0.75rem',
      color: '#6B7280',
      fontStyle: 'italic'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    statItem: {
      backgroundColor: '#1F2937',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #374151'
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.25rem'
    },
    statValue: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB'
    },
    statBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#1F2937',
      borderRadius: '3px',
      marginTop: '0.5rem',
      overflow: 'hidden'
    },
    statBarFill: {
      height: '100%',
      borderRadius: '3px',
      transition: 'width 0.3s ease'
    }
  };

  if (!analysis) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
          Nessuna analisi disponibile
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.playerName}>{analysis.player.name}</div>
          <div style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
            {analysis.assignedPosition} • {analysis.naturalPosition}
          </div>
        </div>
        <div style={styles.overallRating}>
          {analysis.overallRating}/100
        </div>
      </div>

      {/* Compatibilità Ruolo */}
      <div style={styles.section}>
        <div 
          style={styles.sectionHeader}
          onClick={() => toggleSection('roleCompatibility')}
        >
          <div style={styles.sectionTitle}>🎯 Compatibilità Ruolo</div>
          <div style={{
            ...styles.sectionRating,
            color: getRatingColor(analysis.roleCompatibility.compatibility)
          }}>
            {analysis.roleCompatibility.compatibility}%
          </div>
        </div>
        {expandedSections.roleCompatibility && (
          <div style={styles.sectionContent}>
            <div style={{ color: '#E5E7EB', marginBottom: '0.5rem' }}>
              {analysis.roleCompatibility.reason}
            </div>
            {analysis.roleCompatibility.penalty > 0 && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem' }}>
                Penalità: -{analysis.roleCompatibility.penalty}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analisi Build */}
      <div style={styles.section}>
        <div 
          style={styles.sectionHeader}
          onClick={() => toggleSection('buildAnalysis')}
        >
          <div style={styles.sectionTitle}>⚙️ Analisi Build</div>
          <div style={{
            ...styles.sectionRating,
            color: getRatingColor(analysis.buildAnalysis.compatibility)
          }}>
            {analysis.buildAnalysis.compatibility}%
          </div>
        </div>
        {expandedSections.buildAnalysis && (
          <div style={styles.sectionContent}>
            <div style={{ color: '#E5E7EB', marginBottom: '0.5rem' }}>
              {analysis.buildAnalysis.reason}
            </div>
            {analysis.buildAnalysis.suggestion && (
              <div style={{ color: '#10B981', fontSize: '0.875rem' }}>
                💡 {analysis.buildAnalysis.suggestion}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analisi Booster */}
      <div style={styles.section}>
        <div 
          style={styles.sectionHeader}
          onClick={() => toggleSection('boosterAnalysis')}
        >
          <div style={styles.sectionTitle}>🚀 Efficienza Booster</div>
          <div style={{
            ...styles.sectionRating,
            color: getRatingColor(analysis.boosterAnalysis.efficiency)
          }}>
            {analysis.boosterAnalysis.efficiency}%
          </div>
        </div>
        {expandedSections.boosterAnalysis && (
          <div style={styles.sectionContent}>
            <div style={{ color: '#E5E7EB', marginBottom: '0.5rem' }}>
              Booster sprecati: {analysis.boosterAnalysis.waste}
            </div>
            {analysis.boosterAnalysis.suggestions.map((suggestion, index) => (
              <div key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analisi Abilità */}
      <div style={styles.section}>
        <div 
          style={styles.sectionHeader}
          onClick={() => toggleSection('skillsAnalysis')}
        >
          <div style={styles.sectionTitle}>🎨 Utilizzo Abilità</div>
          <div style={{
            ...styles.sectionRating,
            color: getRatingColor(analysis.skillsAnalysis.utilization)
          }}>
            {analysis.skillsAnalysis.utilization}%
          </div>
        </div>
        {expandedSections.skillsAnalysis && (
          <div style={styles.sectionContent}>
            <div style={{ color: '#E5E7EB', marginBottom: '0.5rem' }}>
              Abilità sottoutilizzate: {analysis.skillsAnalysis.unused}
            </div>
            {analysis.skillsAnalysis.suggestions.map((suggestion, index) => (
              <div key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sinergie Squadra */}
      <div style={styles.section}>
        <div 
          style={styles.sectionHeader}
          onClick={() => toggleSection('teamSynergy')}
        >
          <div style={styles.sectionTitle}>🤝 Sinergie Squadra</div>
          <div style={{
            ...styles.sectionRating,
            color: getRatingColor(analysis.teamSynergy.synergy)
          }}>
            {analysis.teamSynergy.synergy}%
          </div>
        </div>
        {expandedSections.teamSynergy && (
          <div style={styles.sectionContent}>
            <div style={{ color: '#E5E7EB', marginBottom: '0.5rem' }}>
              Connessioni: {analysis.teamSynergy.connections}
            </div>
            {analysis.teamSynergy.suggestions.map((suggestion, index) => (
              <div key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggerimenti */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div style={styles.section}>
          <div 
            style={styles.sectionHeader}
            onClick={() => toggleSection('suggestions')}
          >
            <div style={styles.sectionTitle}>💡 Suggerimenti AI</div>
            <div style={{ color: '#10B981', fontSize: '0.875rem' }}>
              {analysis.suggestions.length} suggerimenti
            </div>
          </div>
          {expandedSections.suggestions && (
            <div style={styles.sectionContent}>
              {analysis.suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  style={{
                    ...styles.suggestion,
                    ...(suggestion.priority === 'high' ? styles.suggestionHigh :
                        suggestion.priority === 'medium' ? styles.suggestionMedium :
                        styles.suggestionLow)
                  }}
                >
                  <div style={styles.suggestionText}>
                    {suggestion.message}
                  </div>
                  <div style={styles.suggestionAction}>
                    {suggestion.action}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerAnalysis;
