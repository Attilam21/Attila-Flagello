import { useState, useEffect } from 'react';
import {
  Trophy,
  Target,
  Eye,
  Clock,
  Brain,
  Zap,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  Upload,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Star,
  Activity,
  TrendingDown,
} from 'lucide-react';
import { auth, db } from '../services/firebaseClient';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const Home = ({ user, onPageChange }) => {
  console.log('🏠 Home component rendering with user:', user?.email);

  const [generalKpis, setGeneralKpis] = useState({
    winrate: 75,
    goalsFor: 28,
    goalsAgainst: 12,
    goalDiff: 16,
    shotsOnTarget: 45,
    avgPossession: 58,
    currentStreak: 3,
    avgRating: 8.2,
    cleanSheets: 8,
  });

  // Stati per i dati reali da Firestore
  const [realStats, setRealStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [coachProgress, setCoachProgress] = useState({
    currentStep: 1,
    totalSteps: 5,
    progress: 20,
    nextAction: 'Completa la tua Rosa',
  });

  const [recentMatches, setRecentMatches] = useState(['W', 'W', 'D', 'W', 'L']);

  const [aiTasks, setAiTasks] = useState([
    {
      id: 1,
      priority: 'high',
      impact: 'Alto',
      text: 'Migliora il possesso palla',
      done: false,
    },
    {
      id: 2,
      priority: 'medium',
      impact: 'Medio',
      text: 'Analizza formazione avversario',
      done: false,
    },
    {
      id: 3,
      priority: 'low',
      impact: 'Basso',
      text: 'Aggiorna statistiche giocatori',
      done: false,
    },
  ]);

  const [miniRosa, setMiniRosa] = useState({
    attack: 85,
    defense: 78,
    transition: 82,
    players: 11,
  });

  // Dati per i grafici
  const [performanceData, setPerformanceData] = useState({
    winrate: [65, 70, 68, 75, 72, 78, 75],
    possession: [52, 55, 58, 60, 58, 62, 58],
    goals: [1.2, 1.8, 2.1, 2.3, 2.0, 2.5, 2.1],
  });

  const handleTaskToggle = taskId => {
    setAiTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleKpiClick = kpi => {
    onPageChange('statistiche-avanzate');
  };

  // Carica dati reali da Firestore
  useEffect(() => {
    if (!auth.currentUser) {
      setIsLoadingStats(false);
      return;
    }

    console.log(
      '🏠 Loading real stats from Firestore for user:',
      auth.currentUser.uid
    );

    const loadRealStats = async () => {
      try {
        const statsRef = doc(
          db,
          'dashboard',
          auth.currentUser.uid,
          'stats',
          'general'
        );
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
          const statsData = statsSnap.data();
          console.log('📊 Real stats loaded:', statsData);
          setRealStats(statsData);

          // Aggiorna i KPI con i dati reali se disponibili
          if (statsData.lastMatch && typeof statsData.lastMatch === 'object') {
            try {
              setGeneralKpis(prev => {
                const newKpis = {
                  ...prev,
                  avgPossession:
                    statsData.lastMatch.possesso || prev.avgPossession,
                  shotsOnTarget:
                    statsData.lastMatch.tiriInPorta || prev.shotsOnTarget,
                };
                console.log(
                  '✅ Dashboard KPI updated with real data:',
                  newKpis
                );
                return newKpis;
              });
            } catch (error) {
              console.error('❌ Error updating KPI with real data:', error);
            }
          }
        } else {
          console.log('📊 No real stats found, using default values');
        }
      } catch (error) {
        console.error('❌ Error loading real stats:', error);
        // Fallback ai dati mock se Firestore non disponibile
        console.log('📊 Using fallback mock data');
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadRealStats();

    // Setup listener real-time per aggiornamenti con gestione errori robusta
    const statsRef = doc(
      db,
      'dashboard',
      auth.currentUser.uid,
      'stats',
      'general'
    );
    const unsubscribe = onSnapshot(
      statsRef,
      snap => {
        try {
          if (snap.exists()) {
            const statsData = snap.data();
            console.log('📊 Real-time stats update:', statsData);
            setRealStats(statsData);

            // Aggiorna KPI in tempo reale con validazione
            if (
              statsData.lastMatch &&
              typeof statsData.lastMatch === 'object'
            ) {
              try {
                setGeneralKpis(prev => {
                  const newKpis = {
                    ...prev,
                    avgPossession:
                      statsData.lastMatch.possesso || prev.avgPossession,
                    shotsOnTarget:
                      statsData.lastMatch.tiriInPorta || prev.shotsOnTarget,
                  };
                  console.log(
                    '✅ Dashboard KPI updated in real-time:',
                    newKpis
                  );
                  return newKpis;
                });
              } catch (error) {
                console.error('❌ Error updating KPI in real-time:', error);
              }
            }
          }
        } catch (error) {
          console.error('❌ Error processing real-time stats update:', error);
          // Non bloccare l'app per errori di parsing
        }
      },
      error => {
        console.error('❌ Real-time stats listener error:', error);

        // Se è un errore di permessi, disabilita il listener per evitare loop
        if (error.code === 'permission-denied') {
          console.log('🚫 Permission denied, disabling real-time listener');
          return;
        }

        // Per altri errori, continua a provare
        console.log('🔄 Will retry listener setup...');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [auth.currentUser]);

  return (
    <div className="dashboard-container">
      {/* Hero - Cliente Progress */}
      <div className="hero-section">
        {/* Progress Bar per il Cliente */}
        <div className="client-progress-section">
          <div className="client-info">
            <div className="client-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="client-details">
              <h3 className="client-name">{user?.email || 'Cliente'}</h3>
              <p className="client-status">Coach eFootballLab</p>
            </div>
          </div>
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">Progresso Coach</span>
              <span className="progress-percentage">75%</span>
            </div>
            <div className="progress-bar-large">
              <div
                className="progress-fill-large"
                style={{ width: '75%' }}
              ></div>
            </div>
            <div className="progress-details">
              <span className="progress-text">Livello: Intermedio</span>
              <span className="progress-next">Prossimo: Avanzato</span>
            </div>
          </div>
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
            <div className="kpi-value">
              {generalKpis.goalsFor}-{generalKpis.goalsAgainst}
            </div>
            <div className="kpi-diff">+{generalKpis.goalDiff}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('shots')}>
          <div className="kpi-icon purple">
            <Eye size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">
              Tiri in Porta {realStats?.lastMatch ? '📊' : '📋'}
            </div>
            <div className="kpi-value">{generalKpis.shotsOnTarget || 0}</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('possession')}>
          <div className="kpi-icon orange">
            <Clock size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">
              Possesso {realStats?.lastMatch ? '📊' : '📋'}
            </div>
            <div className="kpi-value">{generalKpis.avgPossession || 0}%</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => handleKpiClick('streak')}>
          <div className="kpi-icon red">
            <TrendingUp size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Serie</div>
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
            <div className="kpi-label">Porta Inviolata</div>
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
          <div className="step" onClick={() => onPageChange('statistiche-avanzate')}>
            <div className="step-number">2</div>
            <div className="step-label">Statistiche</div>
          </div>
          <div className="step" onClick={() => onPageChange('carica-partita')}>
            <div className="step-number">3</div>
            <div className="step-label">Carica Partita</div>
          </div>
          <div className="step" onClick={() => onPageChange('contromisure')}>
            <div className="step-number">4</div>
            <div className="step-label">Contromisure</div>
          </div>
          <div className="step" onClick={() => onPageChange('suggerimenti')}>
            <div className="step-number">5</div>
            <div className="step-label">Suggerimenti</div>
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
              onClick={() => onPageChange('statistiche-avanzate')}
            >
              {result}
            </button>
          ))}
        </div>
        <div className="last-match-info">
          <strong>Ultima partita:</strong> Barcelona 2-1 (15/01/2024)
        </div>
      </div>

      {/* AI Tasks */}
      <div className="ai-tasks">
        <div className="tasks-header">
          <h3>🤖 Task IA - Top 3</h3>
          <button
            className="btn btn-secondary"
            onClick={() => onPageChange('suggerimenti')}
          >
            Vedi tutti
          </button>
        </div>
        <div className="tasks-list">
          {aiTasks.map(task => (
            <div
              key={task.id}
              className={`task-item ${task.done ? 'completed' : ''}`}
            >
              <button
                className="task-toggle"
                onClick={() => handleTaskToggle(task.id)}
              >
                {task.done ? (
                  <CheckCircle size={16} />
                ) : (
                  <div className="task-circle" />
                )}
              </button>
              <div className="task-content">
                <div className="task-text">{task.text}</div>
                <div className="task-meta">
                  <span className={`priority ${task.priority}`}>
                    {task.impact} impatto
                  </span>
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
          <button
            className="btn btn-primary"
            onClick={() => onPageChange('rosa')}
          >
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
              <div
                className="index-fill"
                style={{ width: `${miniRosa.attack}%` }}
              ></div>
            </div>
            <span className="index-value">{miniRosa.attack}</span>
          </div>
          <div className="index-item">
            <span className="index-label">Difesa</span>
            <div className="index-bar">
              <div
                className="index-fill"
                style={{ width: `${miniRosa.defense}%` }}
              ></div>
            </div>
            <span className="index-value">{miniRosa.defense}</span>
          </div>
          <div className="index-item">
            <span className="index-label">Transizione</span>
            <div className="index-bar">
              <div
                className="index-fill"
                style={{ width: `${miniRosa.transition}%` }}
              ></div>
            </div>
            <span className="index-value">{miniRosa.transition}</span>
          </div>
        </div>
      </div>

      {/* Grafici Performance */}
      <div className="performance-charts">
        <div className="chart-section">
          <h3>📈 Trend Performance</h3>
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h4>Trend Vittorie</h4>
                <div className="chart-trend positive">
                  <TrendingUp size={16} />
                  +3.2%
                </div>
              </div>
              <div className="simple-chart">
                <div className="chart-bars">
                  {performanceData.winrate.map((value, index) => (
                    <div key={index} className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{ height: `${value}%` }}
                        title={`${value}%`}
                      ></div>
                      <span className="chart-label">
                        {
                          ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'][
                            index
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h4>Possesso Palla</h4>
                <div className="chart-trend positive">
                  <TrendingUp size={16} />
                  +6%
                </div>
              </div>
              <div className="simple-chart">
                <div className="chart-bars">
                  {performanceData.possession.map((value, index) => (
                    <div key={index} className="chart-bar-container">
                      <div
                        className="chart-bar possession"
                        style={{ height: `${value}%` }}
                        title={`${value}%`}
                      ></div>
                      <span className="chart-label">
                        {
                          ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'][
                            index
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h4>Gol per Partita</h4>
                <div className="chart-trend positive">
                  <TrendingUp size={16} />
                  +0.9
                </div>
              </div>
              <div className="simple-chart">
                <div className="chart-bars">
                  {performanceData.goals.map((value, index) => (
                    <div key={index} className="chart-bar-container">
                      <div
                        className="chart-bar goals"
                        style={{ height: `${value * 20}%` }}
                        title={`${value}`}
                      ></div>
                      <span className="chart-label">
                        {
                          ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'][
                            index
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>🎯 Analisi Dettagliata</h3>
          <div className="analysis-grid">
            <div className="analysis-card">
              <div className="analysis-icon">
                <Activity size={24} />
              </div>
              <div className="analysis-content">
                <h4>Forma Attuale</h4>
                <div className="analysis-value excellent">Eccellente</div>
                <div className="analysis-detail">3 vittorie consecutive</div>
              </div>
            </div>

            <div className="analysis-card">
              <div className="analysis-icon">
                <Target size={24} />
              </div>
              <div className="analysis-content">
                <h4>Precisione Tiri</h4>
                <div className="analysis-value good">67%</div>
                <div className="analysis-detail">+5% rispetto alla media</div>
              </div>
            </div>

            <div className="analysis-card">
              <div className="analysis-icon">
                <Shield size={24} />
              </div>
              <div className="analysis-content">
                <h4>Difesa</h4>
                <div className="analysis-value good">0.8 gol/subiti</div>
                <div className="analysis-detail">Miglioramento costante</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
