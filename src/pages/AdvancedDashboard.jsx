import React, { useState, useEffect } from 'react';
import AICoach from '../components/AICoach';
import TeamAnalysis from '../components/TeamAnalysis';

const AdvancedDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [teamData, setTeamData] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Carica dati squadra e statistiche
    loadTeamData();
    loadMatchHistory();
    loadStats();
  }, [user]);

  const loadTeamData = async () => {
    // Simula caricamento dati squadra
    const mockTeamData = {
      name: 'AC Milan',
      formation: '4-3-3',
      players: [
        { name: 'Gianluigi Donnarumma', position: 'GK', rating: 95 },
        { name: 'Theo Hernández', position: 'LB', rating: 88 },
        { name: 'Fikayo Tomori', position: 'CB', rating: 85 },
        { name: 'Alessandro Bastoni', position: 'CB', rating: 87 },
        { name: 'Davide Calabria', position: 'RB', rating: 82 },
        { name: 'Sandro Tonali', position: 'CDM', rating: 89 },
        { name: 'Ismaël Bennacer', position: 'CM', rating: 86 },
        { name: 'Brahim Díaz', position: 'CAM', rating: 88 },
        { name: 'Rafael Leão', position: 'LW', rating: 91 },
        { name: 'Olivier Giroud', position: 'ST', rating: 87 },
        { name: 'Alexis Saelemaekers', position: 'RW', rating: 83 }
      ],
      averageRating: 87,
      lastUpdate: new Date()
    };
    
    setTeamData(mockTeamData);
  };

  const loadMatchHistory = async () => {
    // Simula caricamento storico partite
    const mockHistory = [
      {
        id: 1,
        opponent: 'Juventus',
        score: '3-1',
        result: 'W',
        date: '2024-01-15',
        stats: { possession: 58, shots: 12, goals: 3 }
      },
      {
        id: 2,
        opponent: 'Inter',
        score: '1-2',
        result: 'L',
        date: '2024-01-10',
        stats: { possession: 45, shots: 8, goals: 1 }
      },
      {
        id: 3,
        opponent: 'Napoli',
        score: '2-0',
        result: 'W',
        date: '2024-01-05',
        stats: { possession: 52, shots: 15, goals: 2 }
      }
    ];
    
    setMatchHistory(mockHistory);
  };

  const loadStats = async () => {
    // Simula caricamento statistiche
    const mockStats = {
      totalMatches: 15,
      wins: 10,
      draws: 3,
      losses: 2,
      winRate: 66.7,
      avgGoals: 2.1,
      avgConceded: 1.2,
      possession: 54.2,
      shotsPerGame: 12.8,
      accuracy: 68.5
    };
    
    setStats(mockStats);
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
    tabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      borderBottom: '1px solid #374151'
    },
    tab: {
      padding: '0.75rem 1.5rem',
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      border: 'none',
      borderRadius: '0.5rem 0.5rem 0 0',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    activeTab: {
      backgroundColor: '#374151',
      color: '#E5E7EB',
      borderBottom: '2px solid #10B981'
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '2rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: '#374151',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      border: '1px solid #4B5563',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    winRate: { color: '#10B981' },
    avgGoals: { color: '#3B82F6' },
    possession: { color: '#F59E0B' },
    accuracy: { color: '#8B5CF6' },
    matchHistory: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563'
    },
    matchItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#1F2937',
      borderRadius: '0.5rem',
      marginBottom: '0.5rem'
    },
    matchInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    matchResult: {
      fontSize: '1.25rem',
      fontWeight: 'bold'
    },
    win: { color: '#10B981' },
    loss: { color: '#EF4444' },
    draw: { color: '#F59E0B' },
    fullWidth: {
      gridColumn: '1 / -1'
    }
  };

  const getStatColor = (statName) => {
    const colors = {
      winRate: styles.winRate,
      avgGoals: styles.avgGoals,
      possession: styles.possession,
      accuracy: styles.accuracy
    };
    return colors[statName] || {};
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'W': return styles.win;
      case 'L': return styles.loss;
      case 'D': return styles.draw;
      default: return {};
    }
  };

  const renderOverview = () => (
    <div style={styles.content}>
      {/* Statistiche Principali */}
      <div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E5E7EB' }}>
          📊 Statistiche Squadra
        </h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, ...getStatColor('winRate') }}>
              {stats?.winRate}%
            </div>
            <div style={styles.statLabel}>Vittorie</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, ...getStatColor('avgGoals') }}>
              {stats?.avgGoals}
            </div>
            <div style={styles.statLabel}>Gol/Partita</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, ...getStatColor('possession') }}>
              {stats?.possession}%
            </div>
            <div style={styles.statLabel}>Possesso</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, ...getStatColor('accuracy') }}>
              {stats?.accuracy}%
            </div>
            <div style={styles.statLabel}>Precisione</div>
          </div>
        </div>
      </div>

      {/* Ultime Partite */}
      <div style={styles.matchHistory}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E5E7EB' }}>
          ⚽ Ultime Partite
        </h3>
        {matchHistory.map((match) => (
          <div key={match.id} style={styles.matchItem}>
            <div style={styles.matchInfo}>
              <div>
                <div style={{ fontWeight: '600' }}>vs {match.opponent}</div>
                <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>{match.date}</div>
              </div>
            </div>
            <div style={{ ...styles.matchResult, ...getResultColor(match.result) }}>
              {match.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div style={styles.fullWidth}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E5E7EB' }}>
        👥 Analisi Squadra
      </h3>
      {teamData && (
        <TeamAnalysis 
          players={teamData.players} 
          formation={teamData.formation}
          showDetails={true} 
        />
      )}
    </div>
  );

  const renderCoach = () => (
    <div style={styles.fullWidth}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E5E7EB' }}>
        🤖 Coach Virtuale
      </h3>
      <AICoach 
        user={user} 
        teamContext={teamData}
      />
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 eFootballLab Dashboard</h1>
        <p style={styles.subtitle}>
          Benvenuto, {user?.email}! Gestisci la tua squadra e migliora le tue prestazioni.
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'overview' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('overview')}
        >
          📊 Panoramica
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'team' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('team')}
        >
          👥 Squadra
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'coach' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('coach')}
        >
          🤖 Coach AI
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'team' && renderTeam()}
      {activeTab === 'coach' && renderCoach()}
    </div>
  );
};

export default AdvancedDashboard;
