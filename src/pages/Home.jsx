import { useState, useEffect } from 'react';
import { Trophy, Target, Eye, Clock, Brain, Zap, TrendingUp, Users, Shield, BarChart3, Upload, MessageSquare, CheckCircle, ArrowRight, Star } from 'lucide-react';

const Home = ({ user, onPageChange }) => {
  console.log('🏠 Home component rendering with user:', user?.email);

  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [lastMatch, setLastMatch] = useState({
    result: 'W',
    score: '2-1',
    opponent: 'Real Madrid',
    opponentLogo: '⚽',
    date: '2024-01-15',
    mode: 'Divisione 1',
    kpis: {
      possession: 58,
      shots: 12,
      shotsOnTarget: 8,
      passAccuracy: 87,
      corners: 5
    }
  });

  const [generalKpis, setGeneralKpis] = useState({
    winrate: 75,
    goalsFor: 28,
    goalsAgainst: 12,
    goalDiff: 16,
    shotsOnTarget: 45,
    avgPossession: 58,
    currentStreak: 3,
    avgRating: 8.2,
    cleanSheets: 8
  });

  const [coachProgress, setCoachProgress] = useState({
    currentStep: 1,
    totalSteps: 5,
    progress: 20,
    nextAction: 'Completa la tua Rosa'
  });

  const [recentMatches, setRecentMatches] = useState(['W', 'W', 'D', 'W', 'L']);

  const [aiTasks, setAiTasks] = useState([
    { id: 1, priority: 'high', impact: 'Alto', text: 'Migliora il possesso palla', done: false },
    { id: 2, priority: 'medium', impact: 'Medio', text: 'Analizza formazione avversario', done: false },
    { id: 3, priority: 'low', impact: 'Basso', text: 'Aggiorna statistiche giocatori', done: false }
  ]);

  const [miniRosa, setMiniRosa] = useState({
    attack: 85,
    defense: 78,
    transition: 82,
    players: 11
  });

  useEffect(() => {
    // Simula controllo primo accesso
    const hasData = localStorage.getItem('eFootballLab_data');
    if (!hasData) {
      setIsFirstAccess(true);
    }
  }, []);

  const handleTaskToggle = (taskId) => {
    setAiTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, done: !task.done } : task
    ));
  };

  const handleKpiClick = (kpi) => {
    onPageChange('statistiche');
  };

  if (isFirstAccess) {
    return (
      <div className="first-access-container">
        <div className="first-access-header">
          <h1 className="first-access-title">🏆 Benvenuto in eFootballLab</h1>
          <p className="first-access-subtitle">Completa questi passaggi per iniziare</p>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '0%' }}></div>
          </div>
          <span className="progress-text">0% Completato</span>
        </div>

        <div className="cta-grid">
          <div className="cta-card" onClick={() => onPageChange('rosa')}>
            <div className="cta-icon">👥</div>
            <h3>Profilazione Rosa</h3>
            <p>Carica i tuoi giocatori via OCR o inserimento manuale</p>
            <button className="cta-button">Inizia</button>
          </div>

          <div className="cta-card" onClick={() => onPageChange('carica-partita')}>
            <div className="cta-icon">📸</div>
            <h3>Carica Statistiche Match</h3>
            <p>Analizza le tue partite con l'OCR</p>
            <button className="cta-button">Carica</button>
          </div>

          <div className="cta-card" onClick={() => onPageChange('suggerimenti')}>
            <div className="cta-icon">🤖</div>
            <h3>Apri Chat Coach</h3>
            <p>Inizia a ricevere consigli personalizzati</p>
            <button className="cta-button">Chat</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Hero - Ultima Partita */}
      <div className="hero-section">
        <div className="hero-header">
          <div className="match-result">
            <div className="result-badge success">W</div>
            <div className="result-score">{lastMatch.score}</div>
          </div>
          <div className="match-info">
            <div className="opponent-info">
              <span className="opponent-logo">{lastMatch.opponentLogo}</span>
              <span className="opponent-name">{lastMatch.opponent}</span>
            </div>
            <div className="match-details">
              <span className="match-date">{lastMatch.date}</span>
              <span className="match-mode">{lastMatch.mode}</span>
            </div>
          </div>
        </div>

        <div className="hero-kpis">
          <div className="kpi-item">
            <span className="kpi-label">Possesso</span>
            <span className="kpi-value">{lastMatch.kpis.possession}%</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-label">Tiri</span>
            <span className="kpi-value">{lastMatch.kpis.shots}</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-label">TiP</span>
            <span className="kpi-value">{lastMatch.kpis.shotsOnTarget}</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-label">Pass%</span>
            <span className="kpi-value">{lastMatch.kpis.passAccuracy}%</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-label">Corner</span>
            <span className="kpi-value">{lastMatch.kpis.corners}</span>
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onPageChange('statistiche')}>
            <BarChart3 size={16} />
            Apri Analisi
          </button>
          <button className="btn btn-secondary" onClick={() => onPageChange('carica-partita')}>
            <Upload size={16} />
            Nuova Partita
          </button>
          <button className="btn btn-secondary">
            <Brain size={16} />
            Genera Task
          </button>
        </div>
      </div>

      {/* KPI Strip - Statistiche Generali */}
      <div className="kpi-strip">
        <div className="kpi-card" onClick={() => handleKpiClick('winrate')}>
          <div className="kpi-icon green">
            <Trophy size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Winrate</div>
            <div className="kpi-value">{generalKpis.winrate}%</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('goals')}>
          <div className="kpi-icon blue">
            <Target size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Gol</div>
            <div className="kpi-value">{generalKpis.goalsFor}-{generalKpis.goalsAgainst}</div>
            <div className="kpi-diff">+{generalKpis.goalDiff}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('shots')}>
          <div className="kpi-icon purple">
            <Eye size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">TiP%</div>
            <div className="kpi-value">{generalKpis.shotsOnTarget}%</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('possession')}>
          <div className="kpi-icon orange">
            <Clock size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Possesso</div>
            <div className="kpi-value">{generalKpis.avgPossession}%</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('streak')}>
          <div className="kpi-icon red">
            <TrendingUp size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Streak</div>
            <div className="kpi-value">{generalKpis.currentStreak}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('rating')}>
          <div className="kpi-icon yellow">
            <Star size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Voto</div>
            <div className="kpi-value">{generalKpis.avgRating}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('cleanSheets')}>
          <div className="kpi-icon teal">
            <Shield size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Clean Sheets</div>
            <div className="kpi-value">{generalKpis.cleanSheets}</div>
          </div>
        </div>
      </div>

      {/* Gamification Bar */}
      <div className="gamification-bar">
        <div className="gamification-header">
          <h3>🎯 Percorso Coach IA</h3>
          <div className="progress-info">
            <span>{coachProgress.progress}% Completato</span>
            <span>Step {coachProgress.currentStep}/5</span>
          </div>
        </div>
        
        <div className="progress-steps">
          <div className="step active" onClick={() => onPageChange('rosa')}>
            <div className="step-number">1</div>
            <div className="step-label">Rosa</div>
          </div>
          <div className="step" onClick={() => onPageChange('statistiche')}>
            <div className="step-number">2</div>
            <div className="step-label">Statistiche</div>
          </div>
          <div className="step" onClick={() => onPageChange('carica-partita')}>
            <div className="step-number">3</div>
            <div className="step-label">Heatmap</div>
          </div>
          <div className="step" onClick={() => onPageChange('contromisure')}>
            <div className="step-number">4</div>
            <div className="step-label">Avversario</div>
          </div>
          <div className="step" onClick={() => onPageChange('suggerimenti')}>
            <div className="step-number">5</div>
            <div className="step-label">Task/Chat</div>
          </div>
        </div>

        <div className="next-action">
          <span>Prossima azione: {coachProgress.nextAction}</span>
          <ArrowRight size={16} />
        </div>
      </div>

      {/* Ultimi 5 Match */}
      <div className="recent-matches">
        <h3>⚽ Ultimi 5 Match</h3>
        <div className="match-results">
          {recentMatches.map((result, index) => (
            <button 
              key={index}
              className={`match-result-btn ${result === 'W' ? 'win' : result === 'D' ? 'draw' : 'loss'}`}
              onClick={() => onPageChange('statistiche')}
            >
              {result}
            </button>
          ))}
        </div>
        <div className="last-match-info">
          <strong>Ultima partita:</strong> {lastMatch.opponent} {lastMatch.score} ({lastMatch.date})
        </div>
      </div>

      {/* AI Tasks */}
      <div className="ai-tasks">
        <div className="tasks-header">
          <h3>🤖 Task IA - Top 3</h3>
          <button className="btn btn-secondary" onClick={() => onPageChange('suggerimenti')}>
            Vedi tutti
          </button>
        </div>
        <div className="tasks-list">
          {aiTasks.map(task => (
            <div key={task.id} className={`task-item ${task.done ? 'completed' : ''}`}>
              <button 
                className="task-toggle"
                onClick={() => handleTaskToggle(task.id)}
              >
                {task.done ? <CheckCircle size={16} /> : <div className="task-circle" />}
              </button>
              <div className="task-content">
                <div className="task-text">{task.text}</div>
                <div className="task-meta">
                  <span className={`priority ${task.priority}`}>{task.impact} impatto</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Rosa */}
      <div className="mini-rosa">
        <div className="mini-rosa-header">
          <h3>👥 Mini-Rosa & Modulo</h3>
          <button className="btn btn-primary" onClick={() => onPageChange('rosa')}>
            Gestisci Rosa
          </button>
        </div>
        
        <div className="formation-preview">
          <div className="formation-field">
            <div className="player-dot">GK</div>
            <div className="player-dot">CB</div>
            <div className="player-dot">CB</div>
            <div className="player-dot">LB</div>
            <div className="player-dot">RB</div>
            <div className="player-dot">CM</div>
            <div className="player-dot">CM</div>
            <div className="player-dot">LW</div>
            <div className="player-dot">RW</div>
            <div className="player-dot">ST</div>
            <div className="player-dot">ST</div>
          </div>
        </div>

        <div className="department-indices">
          <div className="index-item">
            <span className="index-label">Attacco</span>
            <div className="index-bar">
              <div className="index-fill" style={{ width: `${miniRosa.attack}%` }}></div>
            </div>
            <span className="index-value">{miniRosa.attack}</span>
          </div>
          <div className="index-item">
            <span className="index-label">Difesa</span>
            <div className="index-bar">
              <div className="index-fill" style={{ width: `${miniRosa.defense}%` }}></div>
            </div>
            <span className="index-value">{miniRosa.defense}</span>
          </div>
          <div className="index-item">
            <span className="index-label">Transizione</span>
            <div className="index-bar">
              <div className="index-fill" style={{ width: `${miniRosa.transition}%` }}></div>
            </div>
            <span className="index-value">{miniRosa.transition}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;