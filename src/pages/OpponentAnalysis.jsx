import React, { useState, useEffect } from 'react';
import {
  Target,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
} from 'lucide-react';
import OpponentFormationViewer from '../components/OpponentFormationViewer';

const OpponentAnalysis = ({ user }) => {
  const [opponents, setOpponents] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadOpponents();
  }, []);

  const loadOpponents = async () => {
    // Simula caricamento avversari
    const mockOpponents = [
      {
        id: 1,
        name: 'Real Madrid',
        formation: '4-2-1-3',
        playStyle: 'Possesso',
        strengths: ['Attacco', 'Velocità', 'Cross'],
        weaknesses: ['Difesa', 'Arie', 'Fisico'],
        lastMatch: '2024-01-15',
        result: 'L',
        score: '2-3',
        analysis: {
          possession: 45,
          shots: 8,
          shotsOnTarget: 3,
          passes: 320,
          passAccuracy: 82,
          tackles: 12,
          interceptions: 8,
        },
        heatmap: {
          attack: { left: 30, center: 50, right: 20 },
          defense: { left: 25, center: 45, right: 30 },
        },
        players: [
          {
            name: 'Gianluigi Buffon',
            position: 'GK',
            rating: 105,
            stats: {
              pace: 45,
              shooting: 25,
              passing: 88,
              dribbling: 35,
              defending: 95,
              physical: 92,
            },
            physical: { height: 192, weight: 92, preferredFoot: 'Right' },
          },
          {
            name: 'Javier Zanetti',
            position: 'LB',
            rating: 103,
            stats: {
              pace: 85,
              shooting: 70,
              passing: 88,
              dribbling: 82,
              defending: 95,
              physical: 88,
            },
            physical: { height: 178, weight: 75, preferredFoot: 'Right' },
          },
          {
            name: 'Paolo Maldini',
            position: 'CB',
            rating: 102,
            stats: {
              pace: 75,
              shooting: 60,
              passing: 85,
              dribbling: 70,
              defending: 98,
              physical: 85,
            },
            physical: { height: 186, weight: 85, preferredFoot: 'Right' },
          },
          {
            name: 'Frank Rijkaard',
            position: 'CB',
            rating: 105,
            stats: {
              pace: 70,
              shooting: 65,
              passing: 90,
              dribbling: 75,
              defending: 96,
              physical: 90,
            },
            physical: { height: 190, weight: 88, preferredFoot: 'Right' },
          },
          {
            name: 'Fabio Cannavaro',
            position: 'RB',
            rating: 105,
            stats: {
              pace: 80,
              shooting: 55,
              passing: 82,
              dribbling: 75,
              defending: 97,
              physical: 85,
            },
            physical: { height: 175, weight: 75, preferredFoot: 'Right' },
          },
          {
            name: 'Patrick Vieira',
            position: 'CDM',
            rating: 104,
            stats: {
              pace: 75,
              shooting: 70,
              passing: 88,
              dribbling: 80,
              defending: 95,
              physical: 92,
            },
            physical: { height: 191, weight: 88, preferredFoot: 'Right' },
          },
          {
            name: 'Edgar Davids',
            position: 'CDM',
            rating: 102,
            stats: {
              pace: 85,
              shooting: 75,
              passing: 85,
              dribbling: 88,
              defending: 90,
              physical: 88,
            },
            physical: { height: 169, weight: 68, preferredFoot: 'Left' },
          },
          {
            name: 'Wesley Sneijder',
            position: 'CAM',
            rating: 104,
            stats: {
              pace: 80,
              shooting: 90,
              passing: 95,
              dribbling: 88,
              defending: 70,
              physical: 75,
            },
            physical: { height: 170, weight: 72, preferredFoot: 'Right' },
          },
          {
            name: 'Vinícius Júnior',
            position: 'LW',
            rating: 105,
            stats: {
              pace: 95,
              shooting: 85,
              passing: 82,
              dribbling: 95,
              defending: 35,
              physical: 78,
            },
            physical: { height: 176, weight: 73, preferredFoot: 'Right' },
          },
          {
            name: "Samuel Eto'o",
            position: 'ST',
            rating: 104,
            stats: {
              pace: 90,
              shooting: 95,
              passing: 80,
              dribbling: 88,
              defending: 40,
              physical: 85,
            },
            physical: { height: 180, weight: 80, preferredFoot: 'Right' },
          },
          {
            name: 'Ruud Gullit',
            position: 'RW',
            rating: 104,
            stats: {
              pace: 85,
              shooting: 90,
              passing: 92,
              dribbling: 90,
              defending: 75,
              physical: 88,
            },
            physical: { height: 191, weight: 85, preferredFoot: 'Right' },
          },
        ],
        keyPlayers: [
          { name: "Samuel Eto'o", position: 'ST', rating: 104, threat: 'high' },
          {
            name: 'Wesley Sneijder',
            position: 'CAM',
            rating: 104,
            threat: 'high',
          },
          {
            name: 'Vinícius Júnior',
            position: 'LW',
            rating: 105,
            threat: 'high',
          },
        ],
      },
      {
        id: 2,
        name: 'Barcelona',
        formation: '4-3-3',
        playStyle: 'Tiki-Taka',
        strengths: ['Possesso', 'Passaggi', 'Tecnica'],
        weaknesses: ['Fisico', 'Velocità', 'Arie'],
        lastMatch: '2024-01-10',
        result: 'W',
        score: '1-0',
        analysis: {
          possession: 65,
          shots: 12,
          shotsOnTarget: 5,
          passes: 580,
          passAccuracy: 91,
          tackles: 8,
          interceptions: 15,
        },
        heatmap: {
          attack: { left: 20, center: 60, right: 20 },
          defense: { left: 30, center: 40, right: 30 },
        },
        keyPlayers: [
          { name: 'Lewandowski', position: 'ST', rating: 92, threat: 'high' },
          { name: 'Pedri', position: 'CM', rating: 88, threat: 'medium' },
          { name: 'Gavi', position: 'CM', rating: 85, threat: 'medium' },
        ],
      },
    ];

    setOpponents(mockOpponents);
  };

  const analyzeOpponent = async opponent => {
    setIsAnalyzing(true);
    setSelectedOpponent(opponent);

    // Simula analisi AI
    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiAnalysis = {
      threatLevel:
        opponent.keyPlayers.filter(p => p.threat === 'high').length > 1
          ? 'high'
          : 'medium',
      recommendedFormation: opponent.formation === '4-3-3' ? '4-4-2' : '4-3-3',
      counterMeasures: [
        `Contrasta ${opponent.strengths[0]} con pressing alto`,
        `Sfrutta ${opponent.weaknesses[0]} con gioco aereo`,
        `Marca stretto ${opponent.keyPlayers[0].name}`,
      ],
      tacticalAdvice: [
        'Gioca sui contropiedi',
        'Sfrutta le corse laterali',
        'Mantieni il possesso palla',
      ],
      predictedOutcome:
        opponent.analysis.possession > 60 ? 'Difficile' : 'Favorevole',
    };

    setAnalysis(aiAnalysis);
    setIsAnalyzing(false);
  };

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      minHeight: '100vh',
      padding: '2rem',
      color: 'white',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#9CA3AF',
    },
    opponentsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    opponentCard: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    opponentCardHover: {
      backgroundColor: '#4B5563',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
    opponentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    opponentName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
    },
    lastResult: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    win: { backgroundColor: '#10B981', color: 'white' },
    loss: { backgroundColor: '#EF4444', color: 'white' },
    draw: { backgroundColor: '#F59E0B', color: 'white' },
    opponentInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1rem',
    },
    infoItem: {
      fontSize: '0.875rem',
      color: '#9CA3AF',
    },
    infoValue: {
      color: '#E5E7EB',
      fontWeight: '500',
    },
    strengths: {
      marginBottom: '1rem',
    },
    strengthsTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#E5E7EB',
      marginBottom: '0.5rem',
    },
    strengthTag: {
      display: 'inline-block',
      backgroundColor: '#10B981',
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      marginRight: '0.5rem',
      marginBottom: '0.25rem',
    },
    weaknesses: {
      marginBottom: '1rem',
    },
    weaknessesTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#E5E7EB',
      marginBottom: '0.5rem',
    },
    weaknessTag: {
      display: 'inline-block',
      backgroundColor: '#EF4444',
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      marginRight: '0.5rem',
      marginBottom: '0.25rem',
    },
    keyPlayers: {
      marginBottom: '1rem',
    },
    keyPlayersTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#E5E7EB',
      marginBottom: '0.5rem',
    },
    playerItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem',
      backgroundColor: '#1F2937',
      borderRadius: '0.25rem',
      marginBottom: '0.25rem',
    },
    playerName: {
      fontSize: '0.875rem',
      color: '#E5E7EB',
    },
    playerRating: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: '#10B981',
    },
    analysisContainer: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '2rem',
      border: '1px solid #4B5563',
      marginTop: '2rem',
    },
    analysisTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem',
    },
    analysisGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    analysisCard: {
      backgroundColor: '#1F2937',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #4B5563',
    },
    analysisCardTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    counterMeasure: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      backgroundColor: '#374151',
      borderRadius: '0.25rem',
      marginBottom: '0.5rem',
    },
    tacticalAdvice: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      backgroundColor: '#374151',
      borderRadius: '0.25rem',
      marginBottom: '0.5rem',
    },
    threatLevel: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      textAlign: 'center',
    },
    high: { backgroundColor: '#EF4444', color: 'white' },
    medium: { backgroundColor: '#F59E0B', color: 'white' },
    low: { backgroundColor: '#10B981', color: 'white' },
  };

  const getResultColor = result => {
    switch (result) {
      case 'W':
        return styles.win;
      case 'L':
        return styles.loss;
      case 'D':
        return styles.draw;
      default:
        return styles.draw;
    }
  };

  const getThreatColor = level => {
    switch (level) {
      case 'high':
        return styles.high;
      case 'medium':
        return styles.medium;
      case 'low':
        return styles.low;
      default:
        return styles.medium;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 Analisi Avversari</h1>
        <p style={styles.subtitle}>
          Studia le formazioni nemiche e prepara le contro-misure
        </p>
      </div>

      {/* Opponents Grid */}
      <div style={styles.opponentsGrid}>
        {opponents.map(opponent => (
          <div
            key={opponent.id}
            style={styles.opponentCard}
            onClick={() => analyzeOpponent(opponent)}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#4B5563';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Header */}
            <div style={styles.opponentHeader}>
              <div style={styles.opponentName}>{opponent.name}</div>
              <div
                style={{
                  ...styles.lastResult,
                  ...getResultColor(opponent.result),
                }}
              >
                {opponent.result} {opponent.score}
              </div>
            </div>

            {/* Info */}
            <div style={styles.opponentInfo}>
              <div style={styles.infoItem}>
                <div>Formazione:</div>
                <div style={styles.infoValue}>{opponent.formation}</div>
              </div>
              <div style={styles.infoItem}>
                <div>Stile:</div>
                <div style={styles.infoValue}>{opponent.playStyle}</div>
              </div>
              <div style={styles.infoItem}>
                <div>Possesso:</div>
                <div style={styles.infoValue}>
                  {opponent.analysis.possession}%
                </div>
              </div>
              <div style={styles.infoItem}>
                <div>Tiri:</div>
                <div style={styles.infoValue}>{opponent.analysis.shots}</div>
              </div>
            </div>

            {/* Strengths */}
            <div style={styles.strengths}>
              <div style={styles.strengthsTitle}>💪 Punti di Forza</div>
              {opponent.strengths.map((strength, index) => (
                <span key={index} style={styles.strengthTag}>
                  {strength}
                </span>
              ))}
            </div>

            {/* Weaknesses */}
            <div style={styles.weaknesses}>
              <div style={styles.weaknessesTitle}>⚠️ Punti Deboli</div>
              {opponent.weaknesses.map((weakness, index) => (
                <span key={index} style={styles.weaknessTag}>
                  {weakness}
                </span>
              ))}
            </div>

            {/* Key Players */}
            <div style={styles.keyPlayers}>
              <div style={styles.keyPlayersTitle}>⭐ Giocatori Chiave</div>
              {opponent.keyPlayers.slice(0, 3).map((player, index) => (
                <div key={index} style={styles.playerItem}>
                  <div style={styles.playerName}>
                    {player.name} ({player.position})
                  </div>
                  <div style={styles.playerRating}>{player.rating}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Formation Viewer */}
      {selectedOpponent && (
        <OpponentFormationViewer
          opponent={selectedOpponent}
          onAnalyze={aiAnalysis => setAnalysis(aiAnalysis)}
        />
      )}

      {/* Analysis Results */}
      {selectedOpponent && analysis && (
        <div style={styles.analysisContainer}>
          <h2 style={styles.analysisTitle}>
            🧠 Analisi AI: {selectedOpponent.name}
          </h2>

          <div style={styles.analysisGrid}>
            {/* Threat Level */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <AlertTriangle size={20} />
                Livello di Minaccia
              </div>
              <div
                style={{
                  ...styles.threatLevel,
                  ...getThreatColor(analysis.threatLevel),
                }}
              >
                {analysis.threatLevel.toUpperCase()}
              </div>
              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem',
                }}
              >
                Basato su giocatori chiave e statistiche recenti
              </p>
            </div>

            {/* Counter Measures */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <Target size={20} />
                Contro-misure
              </div>
              {analysis.counterMeasures.map((measure, index) => (
                <div key={index} style={styles.counterMeasure}>
                  <CheckCircle size={16} color="#10B981" />
                  <span style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
                    {measure}
                  </span>
                </div>
              ))}
            </div>

            {/* Tactical Advice */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <Brain size={20} />
                Consigli Tattici
              </div>
              {analysis.tacticalAdvice.map((advice, index) => (
                <div key={index} style={styles.tacticalAdvice}>
                  <TrendingUp size={16} color="#3B82F6" />
                  <span style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
                    {advice}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommended Formation */}
            <div style={styles.analysisCard}>
              <div style={styles.analysisCardTitle}>
                <Users size={20} />
                Formazione Consigliata
              </div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#10B981',
                  textAlign: 'center',
                  margin: '1rem 0',
                }}
              >
                {analysis.recommendedFormation}
              </div>
              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
                Ottimizzata per contrastare {selectedOpponent.formation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              backgroundColor: '#374151',
              padding: '2rem',
              borderRadius: '0.75rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '4px solid #4B5563',
                borderTop: '4px solid #10B981',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
              }}
            ></div>
            <div style={{ color: '#E5E7EB', fontSize: '1.125rem' }}>
              🧠 Analisi AI in corso...
            </div>
            <div
              style={{
                color: '#9CA3AF',
                fontSize: '0.875rem',
                marginTop: '0.5rem',
              }}
            >
              Analizzando {selectedOpponent?.name}...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpponentAnalysis;
