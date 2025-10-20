import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Registra i componenti di Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdvancedStats = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [selectedMatch, setSelectedMatch] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [availableMatches, setAvailableMatches] = useState([]);

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    // Simula caricamento statistiche avanzate
    const mockStats = {
      team: {
        name: 'AC Milan',
        totalMatches: 25,
        wins: 18,
        draws: 4,
        losses: 3,
        winRate: 72,
        goalsScored: 45,
        goalsConceded: 18,
        avgPossession: 58.5,
        avgShots: 14.2,
        avgShotsOnTarget: 6.8,
        avgPasses: 485,
        avgPassAccuracy: 87.3,
        avgTackles: 18.5,
        avgInterceptions: 12.3,
        avgClearances: 8.7,
        avgFouls: 11.2,
        avgCards: 2.1,
      },
      players: [
        {
          id: 1,
          name: 'Rafael Leão',
          position: 'LW',
          matches: 22,
          goals: 12,
          assists: 8,
          shots: 45,
          shotsOnTarget: 28,
          passes: 312,
          passAccuracy: 84.2,
          dribbles: 89,
          dribbleSuccess: 67.4,
          tackles: 12,
          interceptions: 8,
          rating: 8.2,
        },
        {
          id: 2,
          name: 'Olivier Giroud',
          position: 'ST',
          matches: 20,
          goals: 15,
          assists: 3,
          shots: 38,
          shotsOnTarget: 22,
          passes: 198,
          passAccuracy: 78.8,
          dribbles: 23,
          dribbleSuccess: 52.2,
          tackles: 5,
          interceptions: 3,
          rating: 8.5,
        },
        {
          id: 3,
          name: 'Sandro Tonali',
          position: 'CDM',
          matches: 24,
          goals: 2,
          assists: 6,
          shots: 18,
          shotsOnTarget: 8,
          passes: 1256,
          passAccuracy: 91.2,
          dribbles: 45,
          dribbleSuccess: 71.1,
          tackles: 67,
          interceptions: 89,
          rating: 8.8,
        },
      ],
      trends: {
        goals: [2, 3, 1, 4, 2, 3, 2, 1, 3, 2],
        possession: [55, 62, 48, 71, 58, 65, 52, 59, 68, 61],
        shots: [12, 18, 8, 22, 15, 19, 11, 16, 24, 17],
        rating: [7.8, 8.2, 7.5, 8.9, 8.1, 8.4, 7.9, 8.3, 9.1, 8.6],
      },
    };

    setStats(mockStats);
  };

  const periods = [
    { value: 'last7days', label: 'Ultimi 7 giorni' },
    { value: 'last30days', label: 'Ultimi 30 giorni' },
    { value: 'last90days', label: 'Ultimi 90 giorni' },
    { value: 'alltime', label: 'Tutto il tempo' },
  ];

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
    controls: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      alignItems: 'center',
    },
    select: {
      padding: '0.75rem',
      backgroundColor: '#374151',
      border: '1px solid #4B5563',
      borderRadius: '0.5rem',
      color: '#E5E7EB',
      fontSize: '0.875rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: '#374151',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      border: '1px solid #4B5563',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    winRate: { color: '#10B981' },
    goalsColor: { color: '#3B82F6' },
    possession: { color: '#F59E0B' },
    accuracy: { color: '#8B5CF6' },
    playersTable: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563',
      marginBottom: '2rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      borderBottom: '1px solid #4B5563',
      color: '#E5E7EB',
      fontWeight: '600',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #4B5563',
      color: '#E5E7EB',
      fontSize: '0.875rem',
    },
    playerName: {
      fontWeight: '600',
      color: '#E5E7EB',
    },
    position: {
      color: '#9CA3AF',
      fontSize: '0.75rem',
    },
    rating: {
      fontWeight: 'bold',
      color: '#10B981',
    },
    goalsText: {
      fontWeight: 'bold',
      color: '#3B82F6',
    },
    assists: {
      fontWeight: 'bold',
      color: '#F59E0B',
    },
    chartContainer: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563',
      marginBottom: '2rem',
    },
    chartTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem',
    },
    chartGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
    },
    miniChart: {
      backgroundColor: '#1F2937',
      borderRadius: '0.5rem',
      padding: '1rem',
      border: '1px solid #4B5563',
    },
    chartBar: {
      height: '4px',
      backgroundColor: '#10B981',
      borderRadius: '2px',
      marginBottom: '0.5rem',
      transition: 'width 0.3s ease',
    },
    chartLabel: {
      fontSize: '0.75rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  };

  const getStatColor = statName => {
    const colors = {
      winRate: styles.winRate,
      goals: styles.goalsColor,
      possession: styles.possession,
      accuracy: styles.accuracy,
    };
    return colors[statName] || {};
  };

  const renderTeamStats = () => (
    <div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, ...getStatColor('winRate') }}>
            {stats?.team.winRate}%
          </div>
          <div style={styles.statLabel}>Vittorie</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, ...getStatColor('goals') }}>
            {stats?.team.goalsScored}
          </div>
          <div style={styles.statLabel}>Gol Segnati</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, ...getStatColor('possession') }}>
            {stats?.team.avgPossession}%
          </div>
          <div style={styles.statLabel}>Possesso Medio</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, ...getStatColor('accuracy') }}>
            {stats?.team.avgPassAccuracy}%
          </div>
          <div style={styles.statLabel}>Precisione Passaggi</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#EF4444' }}>
            {stats?.team.goalsConceded}
          </div>
          <div style={styles.statLabel}>Gol Subiti</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#8B5CF6' }}>
            {stats?.team.avgShots}
          </div>
          <div style={styles.statLabel}>Tiri/Partita</div>
        </div>
      </div>

      {/* Grafici Team */}
      <div style={styles.chartGrid}>
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>📊 Performance Squadra</h3>
          <Bar
            data={{
              labels: ['Vittorie', 'Pareggi', 'Sconfitte'],
              datasets: [
                {
                  label: 'Risultati',
                  data: [
                    stats?.team.wins || 0,
                    stats?.team.draws || 0,
                    stats?.team.losses || 0,
                  ],
                  backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                  borderColor: ['#059669', '#D97706', '#DC2626'],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: '#E5E7EB' },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: '#9CA3AF' },
                  grid: { color: '#4B5563' },
                },
                x: {
                  ticks: { color: '#9CA3AF' },
                  grid: { color: '#4B5563' },
                },
              },
            }}
          />
        </div>

        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>⚽ Gol e Possesso</h3>
          <Doughnut
            data={{
              labels: ['Gol Segnati', 'Gol Subiti'],
              datasets: [
                {
                  data: [
                    stats?.team.goalsScored || 0,
                    stats?.team.goalsConceded || 0,
                  ],
                  backgroundColor: ['#3B82F6', '#EF4444'],
                  borderColor: ['#2563EB', '#DC2626'],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: '#E5E7EB' },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderPlayersTable = () => (
    <div>
      <div style={styles.playersTable}>
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#E5E7EB',
          }}
        >
          👥 Statistiche Giocatori
        </h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Giocatore</th>
              <th style={styles.th}>Pos</th>
              <th style={styles.th}>Partite</th>
              <th style={styles.th}>Gol</th>
              <th style={styles.th}>Assist</th>
              <th style={styles.th}>Tiri</th>
              <th style={styles.th}>Passaggi</th>
              <th style={styles.th}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stats?.players.map(player => (
              <tr key={player.id}>
                <td style={styles.td}>
                  <div style={styles.playerName}>{player.name}</div>
                  <div style={styles.position}>{player.position}</div>
                </td>
                <td style={styles.td}>{player.position}</td>
                <td style={styles.td}>{player.matches}</td>
                <td style={{ ...styles.td, ...styles.goalsText }}>
                  {player.goals}
                </td>
                <td style={{ ...styles.td, ...styles.assists }}>
                  {player.assists}
                </td>
                <td style={styles.td}>{player.shots}</td>
                <td style={styles.td}>{player.passes}</td>
                <td style={{ ...styles.td, ...styles.rating }}>
                  {player.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grafico Top Performers */}
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>⭐ Top Performers - Gol e Assist</h3>
        <Bar
          data={{
            labels: stats?.players.slice(0, 5).map(p => p.name) || [],
            datasets: [
              {
                label: 'Gol',
                data: stats?.players.slice(0, 5).map(p => p.goals) || [],
                backgroundColor: '#3B82F6',
                borderColor: '#2563EB',
                borderWidth: 1,
              },
              {
                label: 'Assist',
                data: stats?.players.slice(0, 5).map(p => p.assists) || [],
                backgroundColor: '#F59E0B',
                borderColor: '#D97706',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: { color: '#E5E7EB' },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: '#9CA3AF' },
                grid: { color: '#4B5563' },
              },
              x: {
                ticks: { color: '#9CA3AF' },
                grid: { color: '#4B5563' },
              },
            },
          }}
        />
      </div>
    </div>
  );

  const renderTrends = () => (
    <div style={styles.chartContainer}>
      <h3 style={styles.chartTitle}>📈 Trend Prestazioni</h3>
      <div style={styles.chartGrid}>
        <div style={styles.miniChart}>
          <div style={styles.chartLabel}>Gol per Partita</div>
          {stats?.trends.goals.map((value, index) => (
            <div
              key={index}
              style={{
                ...styles.chartBar,
                width: `${(value / 4) * 100}%`,
                backgroundColor: '#3B82F6',
              }}
            />
          ))}
        </div>
        <div style={styles.miniChart}>
          <div style={styles.chartLabel}>Possesso Palla</div>
          {stats?.trends.possession.map((value, index) => (
            <div
              key={index}
              style={{
                ...styles.chartBar,
                width: `${value}%`,
                backgroundColor: '#F59E0B',
              }}
            />
          ))}
        </div>
        <div style={styles.miniChart}>
          <div style={styles.chartLabel}>Tiri per Partita</div>
          {stats?.trends.shots.map((value, index) => (
            <div
              key={index}
              style={{
                ...styles.chartBar,
                width: `${(value / 25) * 100}%`,
                backgroundColor: '#8B5CF6',
              }}
            />
          ))}
        </div>
        <div style={styles.miniChart}>
          <div style={styles.chartLabel}>Rating Squadra</div>
          {stats?.trends.rating.map((value, index) => (
            <div
              key={index}
              style={{
                ...styles.chartBar,
                width: `${(value / 10) * 100}%`,
                backgroundColor: '#10B981',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Statistiche Avanzate</h1>
        <p style={styles.subtitle}>
          Analisi dettagliate delle prestazioni della squadra e dei giocatori
        </p>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select
            style={styles.select}
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
          >
            <option value="last7days">Ultimi 7 giorni</option>
            <option value="last30days">Ultimi 30 giorni</option>
            <option value="last90days">Ultimi 90 giorni</option>
            <option value="all">Tutto il periodo</option>
          </select>
          
          <select
            style={styles.select}
            value={selectedMatch}
            onChange={e => setSelectedMatch(e.target.value)}
          >
            <option value="all">Tutte le partite</option>
            {availableMatches.map(match => (
              <option key={match.id} value={match.id}>
                {match.opponent} - {match.result} ({match.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Stats */}
      {renderTeamStats()}

      {/* Players Table */}
      {renderPlayersTable()}

      {/* Trends */}
      {renderTrends()}
    </div>
  );
};

export default AdvancedStats;
