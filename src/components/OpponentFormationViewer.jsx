import React, { useState, useEffect } from 'react';
import { Target, Users, AlertTriangle, CheckCircle, Brain, Zap, Shield } from 'lucide-react';

const OpponentFormationViewer = ({ opponent, onAnalyze }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Mappa posizioni per formazione 2D
  const getPositionCoordinates = (formation, position) => {
    const formations = {
      '4-2-1-3': {
        GK: { x: 50, y: 95 },
        LB: { x: 15, y: 75 }, CB1: { x: 35, y: 80 }, CB2: { x: 65, y: 80 }, RB: { x: 85, y: 75 },
        CDM1: { x: 40, y: 55 }, CDM2: { x: 60, y: 55 },
        CAM: { x: 50, y: 35 },
        LW: { x: 20, y: 20 }, ST: { x: 50, y: 15 }, RW: { x: 80, y: 20 }
      },
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
      }
    };

    return formations[formation]?.[position] || { x: 50, y: 50 };
  };

  const analyzeFormation = async () => {
    setIsAnalyzing(true);
    
    // Simula analisi AI della formazione
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiAnalysis = {
      formation: opponent.formation,
      strengths: analyzeStrengths(opponent),
      weaknesses: analyzeWeaknesses(opponent),
      keyPlayers: identifyKeyPlayers(opponent),
      tacticalAdvice: generateTacticalAdvice(opponent),
      counterMeasures: generateCounterMeasures(opponent),
      threatLevel: calculateThreatLevel(opponent)
    };
    
    setAnalysis(aiAnalysis);
    setIsAnalyzing(false);
    
    if (onAnalyze) {
      onAnalyze(aiAnalysis);
    }
  };

  const analyzeStrengths = (opponent) => {
    const strengths = [];
    const players = opponent.players || [];
    
    // Analizza attacco
    const attackers = players.filter(p => ['ST', 'LW', 'RW', 'CAM'].includes(p.position));
    if (attackers.length >= 3) {
      strengths.push('Attacco potente');
    }
    
    // Analizza centrocampo
    const midfielders = players.filter(p => ['CM', 'CDM', 'CAM'].includes(p.position));
    if (midfielders.length >= 3) {
      strengths.push('Centrocampo solido');
    }
    
    // Analizza difesa
    const defenders = players.filter(p => ['CB', 'LB', 'RB'].includes(p.position));
    if (defenders.length >= 4) {
      strengths.push('Difesa compatta');
    }
    
    // Analizza rating medio
    const avgRating = players.reduce((sum, p) => sum + p.rating, 0) / players.length;
    if (avgRating >= 90) {
      strengths.push('Squadra di qualità');
    }
    
    return strengths;
  };

  const analyzeWeaknesses = (opponent) => {
    const weaknesses = [];
    const players = opponent.players || [];
    
    // Analizza velocità
    const slowPlayers = players.filter(p => p.stats?.pace < 70);
    if (slowPlayers.length >= 3) {
      weaknesses.push('Lenta in contropiede');
    }
    
    // Analizza altezza
    const shortPlayers = players.filter(p => p.physical?.height < 180);
    if (shortPlayers.length >= 5) {
      weaknesses.push('Debole nel gioco aereo');
    }
    
    // Analizza creatività
    const creativePlayers = players.filter(p => p.stats?.passing > 85);
    if (creativePlayers.length < 2) {
      weaknesses.push('Poca creatività');
    }
    
    return weaknesses;
  };

  const identifyKeyPlayers = (opponent) => {
    const players = opponent.players || [];
    return players
      .filter(p => p.rating >= 90)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  };

  const generateTacticalAdvice = (opponent) => {
    const advice = [];
    const formation = opponent.formation;
    
    switch (formation) {
      case '4-2-1-3':
        advice.push('Contrasta il trequartista con doppio marcamento');
        advice.push('Sfrutta gli spazi laterali');
        advice.push('Pressione alta sui centrocampisti');
        break;
      case '4-3-3':
        advice.push('Gioca sui contropiedi');
        advice.push('Sfrutta le corse laterali');
        advice.push('Marca stretto gli attaccanti');
        break;
      case '4-4-2':
        advice.push('Possesso palla per controllare il centrocampo');
        advice.push('Gioca stretto per limitare gli spazi');
        advice.push('Sfrutta la superiorità numerica in mezzo');
        break;
    }
    
    return advice;
  };

  const generateCounterMeasures = (opponent) => {
    const measures = [];
    const formation = opponent.formation;
    
    // Contro-misure basate sulla formazione
    if (formation === '4-2-1-3') {
      measures.push('Formazione 4-4-2 per bilanciare il centrocampo');
      measures.push('Marcatura a zona sul trequartista');
      measures.push('Pressing alto sui centrocampisti');
    } else if (formation === '4-3-3') {
      measures.push('Formazione 4-4-2 per controllo del centrocampo');
      measures.push('Gioco laterale per sfruttare gli spazi');
      measures.push('Contropiedi veloci');
    }
    
    return measures;
  };

  const calculateThreatLevel = (opponent) => {
    const players = opponent.players || [];
    const avgRating = players.reduce((sum, p) => sum + p.rating, 0) / players.length;
    const highRatedPlayers = players.filter(p => p.rating >= 95).length;
    
    if (avgRating >= 95 && highRatedPlayers >= 3) return 'high';
    if (avgRating >= 90 && highRatedPlayers >= 2) return 'medium';
    return 'low';
  };

  const getThreatColor = (level) => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

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
    formationContainer: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '2rem',
      border: '1px solid #4B5563',
      marginBottom: '2rem'
    },
    formationTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    field: {
      position: 'relative',
      width: '100%',
      height: '400px',
      backgroundColor: '#10B981',
      borderRadius: '0.5rem',
      border: '2px solid #E5E7EB',
      overflow: 'hidden',
      marginBottom: '2rem'
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
      width: '60px',
      height: '60px',
      border: '2px solid #E5E7EB',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)'
    },
    penaltyArea: {
      position: 'absolute',
      top: '20px',
      left: '50%',
      width: '150px',
      height: '80px',
      border: '2px solid #E5E7EB',
      borderRadius: '0 0 80px 80px',
      transform: 'translateX(-50%)'
    },
    playerCard: {
      position: 'absolute',
      width: '60px',
      height: '80px',
      backgroundColor: '#3B82F6',
      borderRadius: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '2px solid #1E40AF',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.2s',
      zIndex: 10
    },
    playerCardHover: {
      backgroundColor: '#1D4ED8',
      transform: 'translate(-50%, -50%) scale(1.1)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    playerName: {
      fontSize: '0.625rem',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      lineHeight: 1,
      marginBottom: '0.25rem'
    },
    playerPosition: {
      fontSize: '0.5rem',
      color: '#E5E7EB',
      textAlign: 'center'
    },
    playerRating: {
      fontSize: '0.75rem',
      fontWeight: 'bold',
      color: '#10B981',
      textAlign: 'center'
    },
    analysisContainer: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '2rem',
      border: '1px solid #4B5563'
    },
    analysisTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    analysisGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    analysisCard: {
      backgroundColor: '#1F2937',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #4B5563'
    },
    analysisCardTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    strengthTag: {
      display: 'inline-block',
      backgroundColor: '#10B981',
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      marginRight: '0.5rem',
      marginBottom: '0.25rem'
    },
    weaknessTag: {
      display: 'inline-block',
      backgroundColor: '#EF4444',
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      marginRight: '0.5rem',
      marginBottom: '0.25rem'
    },
    adviceItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      backgroundColor: '#374151',
      borderRadius: '0.25rem',
      marginBottom: '0.5rem'
    },
    measureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      backgroundColor: '#374151',
      borderRadius: '0.25rem',
      marginBottom: '0.5rem'
    },
    threatLevel: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '1rem'
    },
    analyzeButton: {
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '1rem 2rem',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '2rem'
    },
    loadingOverlay: {
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
    loadingContent: {
      backgroundColor: '#374151',
      padding: '2rem',
      borderRadius: '0.75rem',
      textAlign: 'center'
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #4B5563',
      borderTop: '4px solid #10B981',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem'
    }
  };

  if (!opponent) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎯 Analisi Formazione Avversario</h1>
          <p style={styles.subtitle}>Seleziona un avversario per analizzare la sua formazione</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 Analisi Formazione: {opponent.name}</h1>
        <p style={styles.subtitle}>
          Formazione: {opponent.formation} • Stile: {opponent.playStyle}
        </p>
      </div>

      {/* Formation Viewer */}
      <div style={styles.formationContainer}>
        <div style={styles.formationTitle}>
          <Users size={24} />
          Formazione {opponent.formation}
        </div>
        
        <div style={styles.field}>
          {/* Field Lines */}
          <div style={styles.fieldLines}>
            <div style={styles.centerLine} />
            <div style={styles.centerCircle} />
            <div style={styles.penaltyArea} />
          </div>

          {/* Players */}
          {opponent.players?.map((player, index) => {
            const coords = getPositionCoordinates(opponent.formation, player.position);
            return (
              <div
                key={index}
                style={{
                  ...styles.playerCard,
                  left: `${coords.x}%`,
                  top: `${coords.y}%`
                }}
                onClick={() => setSelectedPlayer(player)}
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
                <div style={styles.playerName}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={styles.playerPosition}>{player.position}</div>
                <div style={styles.playerRating}>{player.rating}</div>
              </div>
            );
          })}
        </div>

        <button
          style={styles.analyzeButton}
          onClick={analyzeFormation}
          disabled={isAnalyzing}
        >
          <Brain size={20} />
          {isAnalyzing ? 'Analizzando...' : 'Analizza Formazione con AI'}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div style={styles.analysisContainer}>
          <h2 style={styles.analysisTitle}>
            <Brain size={24} />
            Analisi AI Completata
          </h2>
          
          <div style={styles.analysisGrid}>
            {/* Threat Level */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <AlertTriangle size={20} />
                Livello di Minaccia
              </div>
              <div style={{ 
                ...styles.threatLevel, 
                backgroundColor: getThreatColor(analysis.threatLevel),
                color: 'white'
              }}>
                {analysis.threatLevel.toUpperCase()}
              </div>
            </div>

            {/* Strengths */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <CheckCircle size={20} />
                Punti di Forza
              </div>
              {analysis.strengths.map((strength, index) => (
                <span key={index} style={styles.strengthTag}>
                  {strength}
                </span>
              ))}
            </div>

            {/* Weaknesses */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <AlertTriangle size={20} />
                Punti Deboli
              </div>
              {analysis.weaknesses.map((weakness, index) => (
                <span key={index} style={styles.weaknessTag}>
                  {weakness}
                </span>
              ))}
            </div>

            {/* Tactical Advice */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <Brain size={20} />
                Consigli Tattici
              </div>
              {analysis.tacticalAdvice.map((advice, index) => (
                <div key={index} style={styles.adviceItem}>
                  <Zap size={16} color="#3B82F6" />
                  <span style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
                    {advice}
                  </span>
                </div>
              ))}
            </div>

            {/* Counter Measures */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <Target size={20} />
                Contro-misure
              </div>
              {analysis.counterMeasures.map((measure, index) => (
                <div key={index} style={styles.measureItem}>
                  <Shield size={16} color="#10B981" />
                  <span style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
                    {measure}
                  </span>
                </div>
              ))}
            </div>

            {/* Key Players */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <Users size={20} />
                Giocatori Chiave
              </div>
              {analysis.keyPlayers.map((player, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  backgroundColor: '#374151',
                  borderRadius: '0.25rem',
                  marginBottom: '0.25rem'
                }}>
                  <span style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
                    {player.name} ({player.position})
                  </span>
                  <span style={{ color: '#10B981', fontWeight: 'bold' }}>
                    {player.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.spinner}></div>
            <div style={{ color: '#E5E7EB', fontSize: '1.125rem' }}>
              🧠 AI sta analizzando la formazione...
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Identificando punti di forza e debolezze
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpponentFormationViewer;
