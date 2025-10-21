import { useState } from 'react';
import { Trophy, Target, Eye, Clock, Brain, Zap } from 'lucide-react';

const Home = ({ user, onPageChange }) => {
  console.log('🏠 Home component rendering with user:', user?.email);

  const [summary, setSummary] = useState({
    teamStats: {
      wins: 12,
      draws: 3,
      losses: 2,
      goalsScored: 28,
      goalsConceded: 12,
      possession: 58,
      shotsOnTarget: 45,
      passesCompleted: 320,
    },
    recentForm: ['W', 'W', 'D', 'W', 'L'],
    teamRating: 85,
    formation: '4-3-3',
    topScorer: 'Mbappé',
    topAssister: 'Messi',
    lastMatch: {
      opponent: 'Real Madrid',
      result: '2-1',
      date: '2024-01-15',
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="home-header">
        <div>
          <h1 className="home-title">🏆 Dashboard</h1>
          <p className="home-subtitle">Panoramica delle tue performance</p>
        </div>

        <div className="user-stats">
          <div className="stat-item">
            <div className="stat-label">Rating Squadra</div>
            <div className="stat-value">{summary.teamRating}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Formazione</div>
            <div className="stat-rank">{summary.formation}</div>
          </div>
          <div className="user-avatar-large">⚽</div>
        </div>
      </div>

      {/* Last 5 Games */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">⚽ Ultimi 5 Match</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {summary.recentForm.map((result, index) => (
            <span
              key={index}
              className={`badge ${result === 'W' ? 'success' : result === 'D' ? 'warning' : 'error'}`}
              style={{ fontSize: '16px', padding: '8px 12px' }}
            >
              {result}
            </span>
          ))}
        </div>
        {summary.lastMatch && (
          <div
            style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
            }}
          >
            <strong>Ultima partita:</strong> {summary.lastMatch.opponent} -{' '}
            {summary.lastMatch.result} ({summary.lastMatch.date})
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">Vittorie</div>
              <div className="kpi-value">{summary.teamStats.wins}</div>
            </div>
            <div className="kpi-icon green">
              <Trophy size={20} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">Gol Segnati</div>
              <div className="kpi-value">{summary.teamStats.goalsScored}</div>
            </div>
            <div className="kpi-icon blue">
              <Target size={20} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">Possesso</div>
              <div className="kpi-value">{summary.teamStats.possession}%</div>
            </div>
            <div className="kpi-icon yellow">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">Passaggi</div>
              <div className="kpi-value">
                {summary.teamStats.passesCompleted}
              </div>
            </div>
            <div className="kpi-icon red">
              <Zap size={20} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">Tiri in Porta</div>
              <div className="kpi-value">{summary.teamStats.shotsOnTarget}</div>
            </div>
            <div className="kpi-icon purple">
              <Eye size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Test Logout Button */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🧪 Test</h3>
        </div>
        <div style={{ padding: '16px' }}>
          <button 
            onClick={() => {
              console.log('🧪 Test logout');
              window.location.reload();
            }}
            className="btn btn-destructive"
          >
            🔄 Ricarica per vedere Login
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">⚡ Azioni Rapide</h3>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ marginBottom: '16px', color: '#9CA3AF' }}>
            Gestisci la tua squadra e analizza le partite.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">
              ➕ Aggiungi Giocatore
            </button>
            <button className="btn btn-secondary">
              📸 Analizza Partita
            </button>
            <button className="btn btn-secondary">
              📊 Statistiche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;