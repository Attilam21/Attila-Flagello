import { useState, useEffect, useMemo, useCallback } from 'react';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import {
  Trophy,
  TrendingUp,
  Target,
  Eye,
  Clock,
  MessageCircle,
  Brain,
  Zap,
} from 'lucide-react';

const Home = ({ user, onPageChange }) => {
  console.log('🏠 Home component rendering with user:', user?.email);

  const [summary, setSummary] = useState(null);
  const [routineState, setRoutineState] = useState({
    running: false,
    remainingSec: 0,
  });
  const [coachNote, setCoachNote] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Simula dati calcistici per eFootball
  useEffect(() => {
    console.log('⚽ Loading football summary data...');
    const mockSummary = {
      // Statistiche calcistiche pertinenti
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
    };
    setSummary(mockSummary);
    console.log('✅ Football summary loaded:', mockSummary);
  }, []);

  const motivationalMessages = useMemo(
    () => [
      '⚽ La tua squadra è pronta per la vittoria!',
      '🏆 Ogni formazione è un capolavoro tattico!',
      '🔥 I tuoi giocatori sono in forma perfetta!',
      '💪 La strategia è la chiave del successo!',
      "🌟 Il calcio è arte, tu sei l'artista!",
    ],
    []
  );

  const handleCoachBoost = useCallback(() => {
    const randomMessage =
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ];
    setCoachNote(randomMessage);
    setShowSnackbar(true);

    setTimeout(() => setShowSnackbar(false), 3000);
  }, [motivationalMessages]);

  const startRoutine = useCallback(() => {
    setRoutineState({ running: true, remainingSec: 300 }); // 5 minuti
  }, []);

  const stopRoutine = useCallback(() => {
    setRoutineState({ running: false, remainingSec: 0 });
  }, []);

  const handleNavigateToRosa = () => {
    if (onPageChange) {
      onPageChange('rosa');
    }
  };

  const handleNavigateToAnalisi = () => {
    if (onPageChange) {
      onPageChange('matchocr');
    }
  };

  const handleNavigateToStatistiche = () => {
    if (onPageChange) {
      onPageChange('statistiche');
    }
  };

  if (!summary) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🏆 Dashboard</h1>
          <p className="text-gray-400">Panoramica delle tue performance</p>
        </div>

        <EmptyState
          icon={Trophy}
          title="Nessun dato disponibile"
          description="Inizia a caricare i tuoi match per vedere le statistiche."
          action={<Button className="mt-4">📊 Vai a Corrispondenza OCR</Button>}
        />
      </div>
    );
  }

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

      {/* Annotatore IA */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🤖 Annotatore IA</h3>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ marginBottom: '16px', color: '#9CA3AF' }}>
            L'Annotatore IA analizza le tue partite e fornisce consigli tattici
            personalizzati.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleNavigateToAnalisi} className="btn btn-primary">🎯 Analizza Partita</button>
            <button onClick={handleNavigateToStatistiche} className="btn btn-secondary">📊 Statistiche IA</button>
            <button onClick={handleNavigateToStatistiche} className="btn btn-secondary">💡 Consigli Tattici</button>
          </div>
        </div>
      </div>

      {/* Caricamento Rosa */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">👥 Gestione Rosa</h3>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ marginBottom: '16px', color: '#9CA3AF' }}>
            Carica e gestisci la tua rosa con abilità, skill e booster
            precompilati.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleNavigateToRosa} className="btn btn-primary">➕ Aggiungi Giocatore</button>
            <button onClick={handleNavigateToRosa} className="btn btn-secondary">
              📸 Carica da Screenshot
            </button>
            <button onClick={handleNavigateToRosa} className="btn btn-secondary">⚙️ Editor Formazione</button>
          </div>
        </div>
      </div>

      {/* Coach Motivazionale */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">💬 Coach Motivazionale</h3>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '14px',
                color: '#9CA3AF',
                marginBottom: '8px',
              }}
            >
              Hai bisogno di una spinta?
            </p>
            {coachNote && (
              <p
                style={{
                  color: '#10B981',
                  fontWeight: '500',
                  marginTop: '4px',
                }}
              >
                "{coachNote}"
              </p>
            )}
          </div>
          <button onClick={handleCoachBoost} className="btn btn-primary">
            <Brain size={16} />
            Dammi un nuovo boost
          </button>
        </div>
      </div>

      {/* Snackbar */}
      {showSnackbar && <div className="snackbar">✅ Coach boost inviato!</div>}
    </div>
  );
};

export default Home;
