import React, { useState, useEffect } from 'react';
import { aiProfilingService } from '../services/aiProfilingService';
import PlayerAnalysis from './PlayerAnalysis';

const TeamAnalysis = ({ players, formation, showDetails = false }) => {
  const [teamAnalysis, setTeamAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedPlayers, setExpandedPlayers] = useState({});

  useEffect(() => {
    if (players && players.length > 0) {
      analyzeTeam();
    }
  }, [players, formation]);

  const analyzeTeam = async () => {
    setLoading(true);
    console.log('🧠 Analyzing team with AI...');

    try {
      const teamContext = {
        players: players,
        formation: formation,
        tactics: 'Unknown',
      };

      // Analizza ogni giocatore
      const playerAnalyses = players.map(player => {
        const assignedPosition = player.assignedPosition || player.position;
        return aiProfilingService.profilePlayer(
          player,
          assignedPosition,
          teamContext
        );
      });

      // Calcola statistiche di squadra
      const teamStats = calculateTeamStats(playerAnalyses);

      // Genera suggerimenti di squadra
      const teamSuggestions = generateTeamSuggestions(
        playerAnalyses,
        teamStats
      );

      setTeamAnalysis({
        playerAnalyses,
        teamStats,
        teamSuggestions,
        overallRating: teamStats.averageRating,
      });

      console.log('✅ Team analysis completed:', teamStats);
    } catch (error) {
      console.error('❌ Team analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTeamStats = playerAnalyses => {
    const totalRating = playerAnalyses.reduce(
      (sum, analysis) => sum + analysis.overallRating,
      0
    );
    const averageRating = Math.round(totalRating / playerAnalyses.length);

    const roleCompatibility =
      playerAnalyses.reduce(
        (sum, analysis) => sum + analysis.roleCompatibility.compatibility,
        0
      ) / playerAnalyses.length;

    const buildEfficiency =
      playerAnalyses.reduce(
        (sum, analysis) => sum + analysis.buildAnalysis.compatibility,
        0
      ) / playerAnalyses.length;

    const boosterEfficiency =
      playerAnalyses.reduce(
        (sum, analysis) => sum + analysis.boosterAnalysis.efficiency,
        0
      ) / playerAnalyses.length;

    const teamSynergy =
      playerAnalyses.reduce(
        (sum, analysis) => sum + analysis.teamSynergy.synergy,
        0
      ) / playerAnalyses.length;

    return {
      averageRating: Math.round(averageRating),
      roleCompatibility: Math.round(roleCompatibility),
      buildEfficiency: Math.round(buildEfficiency),
      boosterEfficiency: Math.round(boosterEfficiency),
      teamSynergy: Math.round(teamSynergy),
      totalPlayers: playerAnalyses.length,
      highPerformers: playerAnalyses.filter(a => a.overallRating >= 80).length,
      lowPerformers: playerAnalyses.filter(a => a.overallRating < 60).length,
    };
  };

  const generateTeamSuggestions = (playerAnalyses, teamStats) => {
    const suggestions = [];

    // Suggerimenti basati su rating medio
    if (teamStats.averageRating < 70) {
      suggestions.push({
        type: 'warning',
        priority: 'high',
        message: `⚠️ Rating squadra basso: ${teamStats.averageRating}/100`,
        action: 'Considera di ottimizzare formazione e ruoli',
      });
    }

    // Suggerimenti basati su compatibilità ruoli
    if (teamStats.roleCompatibility < 70) {
      suggestions.push({
        type: 'suggestion',
        priority: 'medium',
        message: `🎯 Compatibilità ruoli bassa: ${teamStats.roleCompatibility}%`,
        action: "Rivedi l'assegnazione dei ruoli per migliorare l'efficacia",
      });
    }

    // Suggerimenti basati su efficienza booster
    if (teamStats.boosterEfficiency < 70) {
      suggestions.push({
        type: 'optimization',
        priority: 'medium',
        message: `🚀 Efficienza booster bassa: ${teamStats.boosterEfficiency}%`,
        action: "Ridistribuisci i booster per massimizzare l'impatto",
      });
    }

    // Suggerimenti basati su sinergie
    if (teamStats.teamSynergy < 60) {
      suggestions.push({
        type: 'info',
        priority: 'low',
        message: `🤝 Sinergie squadra basse: ${teamStats.teamSynergy}%`,
        action: 'Considera giocatori con caratteristiche complementari',
      });
    }

    return suggestions;
  };

  const togglePlayerExpansion = playerId => {
    setExpandedPlayers(prev => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };

  const getRatingColor = rating => {
    if (rating >= 80) return '#10B981';
    if (rating >= 60) return '#3B82F6';
    if (rating >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #374151',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#9CA3AF',
    },
    loading: {
      textAlign: 'center',
      color: '#9CA3AF',
      padding: '2rem',
    },
    teamStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: '#374151',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #4B5563',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    playersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    playerCard: {
      backgroundColor: '#374151',
      borderRadius: '0.5rem',
      border: '1px solid #4B5563',
      overflow: 'hidden',
    },
    playerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#4B5563',
      cursor: 'pointer',
    },
    playerName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#E5E7EB',
    },
    playerRating: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    teamSuggestions: {
      backgroundColor: '#374151',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginTop: '1rem',
    },
    suggestion: {
      padding: '0.75rem',
      marginBottom: '0.5rem',
      borderRadius: '0.375rem',
      borderLeft: '4px solid',
      backgroundColor: '#1F2937',
    },
    suggestionHigh: {
      borderLeftColor: '#EF4444',
      backgroundColor: '#FEF2F2',
    },
    suggestionMedium: {
      borderLeftColor: '#F59E0B',
      backgroundColor: '#FFFBEB',
    },
    suggestionLow: {
      borderLeftColor: '#3B82F6',
      backgroundColor: '#EFF6FF',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
          <div>Analizzando squadra con AI...</div>
        </div>
      </div>
    );
  }

  if (!teamAnalysis) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
          Nessuna analisi di squadra disponibile
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>🧠 Analisi AI Squadra</h2>
        <div style={styles.subtitle}>
          Formazione: {formation} • Rating: {teamAnalysis.overallRating}/100
        </div>
      </div>

      {/* Statistiche Squadra */}
      <div style={styles.teamStats}>
        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statValue,
              color: getRatingColor(teamAnalysis.teamStats.averageRating),
            }}
          >
            {teamAnalysis.teamStats.averageRating}
          </div>
          <div style={styles.statLabel}>Rating Medio</div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statValue,
              color: getRatingColor(teamAnalysis.teamStats.roleCompatibility),
            }}
          >
            {teamAnalysis.teamStats.roleCompatibility}%
          </div>
          <div style={styles.statLabel}>Compatibilità Ruoli</div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statValue,
              color: getRatingColor(teamAnalysis.teamStats.buildEfficiency),
            }}
          >
            {teamAnalysis.teamStats.buildEfficiency}%
          </div>
          <div style={styles.statLabel}>Efficienza Build</div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statValue,
              color: getRatingColor(teamAnalysis.teamStats.teamSynergy),
            }}
          >
            {teamAnalysis.teamStats.teamSynergy}%
          </div>
          <div style={styles.statLabel}>Sinergie Squadra</div>
        </div>
      </div>

      {/* Analisi Giocatori */}
      <div style={styles.playersGrid}>
        {teamAnalysis.playerAnalyses.map((analysis, index) => (
          <div key={index} style={styles.playerCard}>
            <div
              style={styles.playerHeader}
              onClick={() => togglePlayerExpansion(analysis.player.id || index)}
            >
              <div style={styles.playerName}>{analysis.player.name}</div>
              <div
                style={{
                  ...styles.playerRating,
                  color: getRatingColor(analysis.overallRating),
                }}
              >
                {analysis.overallRating}
              </div>
            </div>

            {expandedPlayers[analysis.player.id || index] && (
              <PlayerAnalysis analysis={analysis} showDetails={true} />
            )}
          </div>
        ))}
      </div>

      {/* Suggerimenti Squadra */}
      {teamAnalysis.teamSuggestions.length > 0 && (
        <div style={styles.teamSuggestions}>
          <h3 style={{ color: '#E5E7EB', marginBottom: '1rem' }}>
            💡 Suggerimenti AI Squadra
          </h3>
          {teamAnalysis.teamSuggestions.map((suggestion, index) => (
            <div
              key={index}
              style={{
                ...styles.suggestion,
                ...(suggestion.priority === 'high'
                  ? styles.suggestionHigh
                  : suggestion.priority === 'medium'
                    ? styles.suggestionMedium
                    : styles.suggestionLow),
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {suggestion.message}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {suggestion.action}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamAnalysis;
