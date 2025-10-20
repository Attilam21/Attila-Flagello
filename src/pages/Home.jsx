import { useState, useEffect, useMemo, useCallback } from 'react';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Trophy, Target, Eye, Clock, Brain, Zap } from 'lucide-react';

const Home = ({ user, onPageChange }) => {
  console.log('🏠 Home component rendering with user:', user?.email);

  const [summary, setSummary] = useState(null);
  const [heroData, setHeroData] = useState({
    ultimaPartita: null,
    statoRosa: null,
    consiglioIA: null,
    warning: null,
  });
  // const [routineState, setRoutineState] = useState({
  //   running: false,
  //   remainingSec: 0,
  // });
  const [coachNote, setCoachNote] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Carica dati Hero Section
  useEffect(() => {
    loadHeroData();
  }, []);

  async function loadHeroData() {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const db = getFirestore();

      // Carica ultimo OCR (ultima partita)
      const ocrRef = doc(db, `matches/${userId}/ocr/latest`);
      const ocrSnap = await getDoc(ocrRef);
      const ultimaPartita = ocrSnap.exists() ? ocrSnap.data() : null;

      console.log('✅ Dati Hero caricati:', { ultimaPartita });

      setHeroData({
        ultimaPartita,
        statoRosa: { rating: 85, giocatori: 11 }, // TODO: caricare da DB
        consiglioIA: { preview: 'Migliora il possesso palla' }, // TODO: caricare da DB
        warning: null,
      });
    } catch (error) {
      console.error('❌ Errore caricamento Hero:', error);
      // In caso di errore, imposta dati di default
      setHeroData({
        ultimaPartita: null,
        statoRosa: { rating: 85, giocatori: 11 },
        consiglioIA: { preview: 'Migliora il possesso palla' },
        warning: null,
      });
    }
  }

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

  // const startRoutine = useCallback(() => {
  //   setRoutineState({ running: true, remainingSec: 300 }); // 5 minuti
  // }, []);

  // const stopRoutine = useCallback(() => {
  //   setRoutineState({ running: false, remainingSec: 0 });
  // }, []);

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
      {/* Hero Section KPI */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Ultima Partita */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              ⚽ Ultima Partita
            </h3>
            <p className="text-muted mb-4">
              {heroData.ultimaPartita?.status === 'done'
                ? `Testo rilevato: ${heroData.ultimaPartita.text?.substring(0, 50)}...`
                : 'Nessuna partita'}
            </p>
            <button
              onClick={() => onPageChange('matchocr')}
              className="btn btn-primary"
            >
              Vedi Dettagli
            </button>
          </div>

          {/* Card Stato Rosa */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
            <h3 className="text-lg font-semibold text-white mb-3">👥 Stato Rosa</h3>
            <p className="text-muted mb-4">
              {heroData.statoRosa
                ? `Rating: ${heroData.statoRosa.rating}, Giocatori: ${heroData.statoRosa.giocatori}`
                : 'Caricamento...'}
            </p>
            <button
              onClick={() => onPageChange('rosa')}
              className="btn btn-primary"
            >
              Gestisci Rosa
            </button>
          </div>

          {/* Card Consiglio IA */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              🤖 Ultimo Consiglio IA
            </h3>
            <p className="text-muted mb-4">
              {heroData.consiglioIA?.preview || 'Nessun consiglio'}
            </p>
            <button
              onClick={() => onPageChange('statistiche')}
              className="btn btn-primary"
            >
              Vedi Report
            </button>
          </div>

          {/* Card Warning */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              ⚠️ Warning/Trend
            </h3>
            <p className="text-muted">{heroData.warning || 'Tutto ok'}</p>
          </div>
        </div>
      </div>

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
      <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚽ Ultimi 5 Match</h3>
        <div className="flex gap-2 mb-4">
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
          <div className="text-muted">
            <strong>Ultima partita:</strong> {summary.lastMatch.opponent} -{' '}
            {summary.lastMatch.result} ({summary.lastMatch.date})
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-muted text-sm">Vittorie</div>
              <div className="text-2xl font-bold text-white">{summary.teamStats.wins}</div>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Trophy size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-muted text-sm">Gol Segnati</div>
              <div className="text-2xl font-bold text-white">{summary.teamStats.goalsScored}</div>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-muted text-sm">Possesso</div>
              <div className="text-2xl font-bold text-white">{summary.teamStats.possession}%</div>
            </div>
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-muted text-sm">Passaggi</div>
              <div className="text-2xl font-bold text-white">
                {summary.teamStats.passesCompleted}
              </div>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-muted text-sm">Tiri in Porta</div>
              <div className="text-2xl font-bold text-white">{summary.teamStats.shotsOnTarget}</div>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Eye size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Annotatore IA */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🤖 Annotatore IA</h3>
        <p className="text-muted mb-4">
          L'Annotatore IA analizza le tue partite e fornisce consigli tattici
          personalizzati.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleNavigateToAnalisi}
            className="btn btn-primary"
          >
            🎯 Analizza Partita
          </button>
          <button
            onClick={handleNavigateToStatistiche}
            className="btn btn-primary"
          >
            📊 Statistiche IA
          </button>
          <button
            onClick={handleNavigateToStatistiche}
            className="btn btn-primary"
          >
            💡 Consigli Tattici
          </button>
        </div>
      </div>

      {/* Caricamento Rosa */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
        <h3 className="text-lg font-semibold text-white mb-4">👥 Gestione Rosa</h3>
        <p className="text-muted mb-4">
          Carica e gestisci la tua rosa con abilità, skill e booster
          precompilati.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleNavigateToRosa} className="btn btn-primary">
            ➕ Aggiungi Giocatore
          </button>
          <button
            onClick={handleNavigateToRosa}
            className="btn btn-primary"
          >
            📸 Carica da Screenshot
          </button>
          <button
            onClick={handleNavigateToRosa}
            className="btn btn-primary"
          >
            ⚙️ Editor Formazione
          </button>
        </div>
      </div>

      {/* Coach Motivazionale */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-soft p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💬 Coach Motivazionale</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm mb-2">
              Hai bisogno di una spinta?
            </p>
            {coachNote && (
              <p className="text-green-500 font-medium">
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
