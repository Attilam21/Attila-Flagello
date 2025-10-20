import { useState, useEffect, useMemo, useCallback } from 'react';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { 
  Trophy, Target, Eye, Clock, Brain, Zap, 
  Upload, BarChart3, Users, TrendingUp, 
  AlertTriangle, CheckCircle, ArrowRight,
  Camera, FileText, Activity, Shield
} from 'lucide-react';

const Home = ({ user, onPageChange }) => {
  console.log('🏠 Home component rendering with user:', user?.email);

  const [heroData, setHeroData] = useState({
    ultimaPartita: null,
    statoRosa: null,
    consiglioIA: null,
    warning: null,
  });

  const [teamProfile, setTeamProfile] = useState({
    goal: 'Vincere Divisione 1',
    vision: 'Contropiede veloce',
    formation: '4-3-3',
    rating: 85
  });

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
        statoRosa: { rating: 85, giocatori: 11 },
        consiglioIA: { preview: 'Migliora il possesso palla' },
        warning: null,
      });
    } catch (error) {
      console.error('❌ Errore caricamento Hero:', error);
      setHeroData({
        ultimaPartita: null,
        statoRosa: { rating: 85, giocatori: 11 },
        consiglioIA: { preview: 'Migliora il possesso palla' },
        warning: null,
      });
    }
  }

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

  const handleNavigateToAvversario = () => {
    if (onPageChange) {
      onPageChange('avversario');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* === HERO SECTION: Obiettivi e Visione === */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Your Goal */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Il Tuo Obiettivo</h2>
                  <p className="text-gray-400">Cosa vuoi raggiungere</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-xl font-semibold text-green-400">{teamProfile.goal}</p>
              </div>
            </div>

            {/* Your Vision */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">La Tua Visione</h2>
                  <p className="text-gray-400">Come vuoi giocare</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-xl font-semibold text-blue-400">{teamProfile.vision}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === DATA COLLECTION: Immagini Post-Partita === */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">📊 Raccolta Dati</h2>
          <p className="text-gray-400 text-lg">Carica le tue immagini post-partita eFootball</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Statistiche Partita */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Statistiche Partita</h3>
                <p className="text-gray-400">Tabellino generale</p>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleNavigateToAnalisi}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Carica Screenshot
              </button>
              <button 
                onClick={handleNavigateToAnalisi}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Inserimento Manuale
              </button>
            </div>
          </div>

          {/* Voti Giocatori */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Voti Giocatori</h3>
                <p className="text-gray-400">Pagelle partita</p>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleNavigateToAnalisi}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Carica Screenshot
              </button>
              <button 
                onClick={handleNavigateToAnalisi}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Inserimento Manuale
              </button>
            </div>
          </div>

          {/* Mappa di Calore */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mr-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mappa di Calore</h3>
                <p className="text-gray-400">Heatmap presenza</p>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleNavigateToAnalisi}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Carica Screenshot
              </button>
              <button 
                onClick={handleNavigateToAnalisi}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Inserimento Manuale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === TEAM PERFORMANCE: Analytics Squadra === */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">🏆 Performance Squadra</h2>
          <p className="text-gray-400 text-lg">Analisi aggregata e sinergie</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPI Cards */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">📊 Statistiche Chiave</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">12</div>
                <div className="text-sm text-gray-400">Vittorie</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">58%</div>
                <div className="text-sm text-gray-400">Possesso</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">28</div>
                <div className="text-sm text-gray-400">Gol Segnati</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-400">85</div>
                <div className="text-sm text-gray-400">Rating Squadra</div>
              </div>
            </div>
          </div>

          {/* Formazione e Sinergie */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">⚽ Formazione e Sinergie</h3>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Formazione Attuale</span>
                  <span className="text-white font-semibold">{teamProfile.formation}</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sinergie Attive</span>
                  <span className="text-green-400 font-semibold">8/11</span>
                </div>
              </div>
              <button 
                onClick={handleNavigateToRosa}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <Users className="w-5 h-5 mr-2" />
                Gestisci Formazione
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === INDIVIDUAL DEVELOPMENT: Profiling Giocatori === */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">👤 Sviluppo Individuale</h2>
          <p className="text-gray-400 text-lg">Profiling AI dei singoli giocatori</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Top Performer</h4>
              </div>
              <p className="text-gray-300">Mbappé - 9.2</p>
              <p className="text-sm text-gray-400">Ultima partita</p>
            </div>

            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Da Migliorare</h4>
              </div>
              <p className="text-gray-300">Hakimi - 6.8</p>
              <p className="text-sm text-gray-400">Difesa laterale</p>
            </div>

            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">AI Suggestion</h4>
              </div>
              <p className="text-gray-300">Migliora il build</p>
              <p className="text-sm text-gray-400">di Messi</p>
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={handleNavigateToRosa}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Analizza Tutti i Giocatori
            </button>
          </div>
        </div>
      </div>

      {/* === OPPONENT ANALYSIS: Contromisure Tattiche === */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">🎯 Analisi Avversari</h2>
          <p className="text-gray-400 text-lg">Contromisure tattiche personalizzate</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">📸 Carica Formazione Avversario</h3>
              <p className="text-gray-400 mb-4">Analizza la formazione 2D dell'avversario per ottenere contromisure specifiche</p>
              <button 
                onClick={handleNavigateToAvversario}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Carica Screenshot Formazione
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">🤖 Contromisure AI</h3>
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-gray-300 mb-2">Basato su:</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Profilo della tua squadra</li>
                  <li>• Stile di gioco avversario</li>
                  <li>• Statistiche storiche</li>
                  <li>• Meta eFootball attuale</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === QUICK ACTIONS === */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Azioni Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              onClick={handleNavigateToAnalisi}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              Analizza Partita
            </button>
            <button 
              onClick={handleNavigateToRosa}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Gestisci Rosa
            </button>
            <button 
              onClick={handleNavigateToStatistiche}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Statistiche
            </button>
            <button 
              onClick={handleNavigateToAvversario}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Target className="w-5 h-5 mr-2" />
              Analisi Avversari
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;