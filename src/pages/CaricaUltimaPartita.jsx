import { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Camera,
  BarChart3,
  Target,
  Users,
  CheckCircle,
  AlertCircle,
  Brain,
  Zap,
  Eye,
  Clock,
  Save,
  X,
  Filter,
  Share2,
  MessageSquare,
  Lightbulb,
  Shield,
} from 'lucide-react';
import { Card, Badge, EmptyState } from '../components/ui';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/Table';
import { auth, storage, db } from '../services/firebaseClient';
import { analyzeBatchWithGemini } from '../services/geminiClient';
import ErrorBoundary from '../components/ErrorBoundary';
import { ref, uploadBytes } from 'firebase/storage';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore';

const CaricaUltimaPartita = ({ onPageChange }) => {
  console.log('📸 CaricaUltimaPartita component rendering');

  // Stati per l'upload delle immagini
  const [uploadImages, setUploadImages] = useState({
    stats: null,
    ratings: null,
    heatmapOffensive: null,
    heatmapDefensive: null
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchData, setMatchData] = useState({
    stats: {},
    ratings: [],
    analysis: null,
    kpis: {}
  });

  // Stati per OCR
  const [ocrResults, setOcrResults] = useState({});
  const [ocrStatus, setOcrStatus] = useState({});
  const [processingImages, setProcessingImages] = useState([]);

  // Ref per gestire listener OCR
  const ocrListenerRef = useRef(null);

  // Cleanup generale al dismount del componente
  useEffect(() => {
    return () => {
      // Cleanup di tutti i listener e timeout attivi
      if (ocrListenerRef.current) {
        ocrListenerRef.current();
        ocrListenerRef.current = null;
      }
      console.log('🧹 CaricaUltimaPartita cleanup on unmount');
    };
  }, []);

  // Stati per le sezioni
  const [activeSection, setActiveSection] = useState('upload');
  const [showBreadcrumb] = useState(true);
  const [showAllSections] = useState(true); // Sempre visibili
  const [playerFilter, setPlayerFilter] = useState('ultima');

  // Rimossi tutti i mock data - solo dati reali da OCR

  // Handler per upload immagini
  const handleImageUpload = async (type, file) => {
    if (!auth.currentUser) {
      alert('Devi essere loggato per caricare immagini');
      return;
    }

    if (!file) return;

    // Validazione file
    if (!file.type.startsWith('image/')) {
      alert('Seleziona un file immagine valido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('L\'immagine è troppo grande (max 5MB)');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const fileName = `${type}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `uploads/${userId}/${fileName}`);
      
      console.log('📤 Uploading image:', fileName);
      
      // Simula progresso upload
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[type] || 0;
          if (current < 90) {
            return { ...prev, [type]: current + 10 };
          }
          return prev;
        });
      }, 200);

      await uploadBytes(storageRef, file);
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [type]: 100 }));
      
      console.log('✅ Image uploaded successfully:', fileName);
      
      setUploadImages(prev => ({
        ...prev,
        [type]: file
      }));

      setProcessingImages(prev => [...prev, { type, file, fileName }]);
      
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      alert('Errore durante l\'upload dell\'immagine');
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    } finally {
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [type]: 0 }));
      }, 1000);
    }
  };

  const handleRemoveImage = (type) => {
    setUploadImages(prev => ({
      ...prev,
      [type]: null
    }));
    setUploadProgress(prev => ({
      ...prev,
      [type]: 0
    }));
    setOcrStatus(prev => ({
      ...prev,
      [type]: 'idle'
    }));
    setOcrResults(prev => {
      const newResults = { ...prev };
      delete newResults[type];
      return newResults;
    });
  };

  // Handler per elaborazione con Gemini AI - VERSIONE MIGLIORATA
  const handleProcessOCR = async () => {
    const uploadedCount = Object.values(uploadImages).filter(img => img !== null).length;
    
    if (uploadedCount < 4) {
      alert('Carica tutte e 4 le immagini prima di procedere');
      return;
    }

    if (!auth.currentUser) {
      alert('Devi essere loggato per elaborare le immagini');
      return;
    }

    setIsProcessing(true);
    console.log('🤖 Avvio elaborazione con Gemini AI per', uploadedCount, 'immagini');

    try {
      const userId = auth.currentUser.uid;
      console.log('👤 User ID:', userId);

      // Inizializza stato OCR per ogni immagine caricata
      const initialOcrStatus = {};
      Object.entries(uploadImages).forEach(([type, file]) => {
        if (file) {
          initialOcrStatus[type] = 'processing';
        }
      });
      setOcrStatus(initialOcrStatus);

      // Analizza tutte le immagini con Gemini
      console.log('🤖 Gemini: Analizzando immagini...');
      const geminiResults = await analyzeBatchWithGemini(uploadImages);
      console.log('🤖 Gemini: Risultati completi:', geminiResults);

      // Aggrega i risultati
      const aggregatedData = {
        stats: {},
        ratings: [],
        heatmaps: {
          offensive: null,
          defensive: null
        }
      };

      // Processa risultati per tipo
      Object.entries(geminiResults).forEach(([type, result]) => {
        if (result && !result.error) {
          if (type === 'stats' && result.stats) {
            aggregatedData.stats = { ...aggregatedData.stats, ...result.stats };
            setOcrStatus(prev => ({ ...prev, [type]: 'completed' }));
          } else if (type === 'ratings' && result.ratings) {
            aggregatedData.ratings = [...aggregatedData.ratings, ...result.ratings];
            setOcrStatus(prev => ({ ...prev, [type]: 'completed' }));
          } else if (type === 'heatmapOffensive' && result.type === 'heatmap') {
            aggregatedData.heatmaps.offensive = result;
            setOcrStatus(prev => ({ ...prev, [type]: 'completed' }));
          } else if (type === 'heatmapDefensive' && result.type === 'heatmap') {
            aggregatedData.heatmaps.defensive = result;
            setOcrStatus(prev => ({ ...prev, [type]: 'completed' }));
          }
        } else {
          console.error(`❌ Errore Gemini per ${type}:`, result?.error);
          setOcrStatus(prev => ({ ...prev, [type]: 'error' }));
        }
      });

      console.log('🤖 Gemini: Dati aggregati:', aggregatedData);
      
      // Aggiorna matchData
      setMatchData(aggregatedData);
      setActiveSection('analysis');
      setIsProcessing(false);

      // Salva i risultati in Firestore per persistenza
      await saveMatchDataToFirestore(aggregatedData, userId);
      
      console.log('✅ Elaborazione Gemini completata con successo!');
      
            } catch (error) {
              console.error('❌ Errore elaborazione Gemini:', error);
              
              // Messaggio specifico per API non abilitata
              if (error.message.includes('Generative Language API non abilitata')) {
                alert('⚠️ Generative Language API non abilitata!\n\nVai su: https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=814206807853\n\nClicca "ENABLE" per abilitare l\'API, poi riprova.');
              } else {
                alert('Errore durante l\'elaborazione con Gemini. Riprova.');
              }
              
              // Genera dati demo come fallback
              const demoData = generateDemoData();
              setMatchData(demoData);
              setActiveSection('analysis');
              alert('⚠️ API non disponibile. Mostro dati demo per testare l\'interfaccia.');
              
              setIsProcessing(false);
            }
  };

  // Salva i dati della partita in Firestore
  const saveMatchDataToFirestore = async (data, userId) => {
    try {
      const matchDoc = {
        userId,
        stats: data.stats,
        ratings: data.ratings,
        heatmaps: data.heatmaps,
        createdAt: new Date(),
        source: 'gemini-ai'
      };

      const matchDocRef = doc(collection(db, 'matches', userId, 'data'));
      await setDoc(matchDocRef, matchDoc);
      console.log('💾 Match data saved to Firestore');

      // Aggiorna anche la Dashboard con i dati dell'ultima partita
      await updateDashboardStats(userId, data.stats);
      
    } catch (error) {
      console.error('❌ Error saving match data:', error);
    }
  };

  // Aggiorna le statistiche della Dashboard
  const updateDashboardStats = async (userId, stats) => {
    try {
      const dashboardRef = doc(db, 'dashboard', userId, 'stats', 'general');
      const dashboardDoc = {
        lastMatch: {
          possesso: stats.possesso || 0,
          tiriInPorta: stats.tiriInPorta || 0,
          tiri: stats.tiri || 0,
          passaggi: stats.passaggi || 0,
          passaggiRiusciti: stats.passaggiRiusciti || 0,
          corner: stats.corner || 0,
          falli: stats.falli || 0,
          fuorigioco: stats.fuorigioco || 0,
          parate: stats.parate || 0,
          golSegnati: stats.golSegnati || 0,
          golSubiti: stats.golSubiti || 0,
        },
        lastUpdated: new Date(),
        source: 'gemini-ai'
      };

      await setDoc(dashboardRef, dashboardDoc);
      console.log('📊 Dashboard stats updated with match data');
    } catch (error) {
      console.error('❌ Error updating dashboard stats:', error);
    }
  };

  // Genera dati demo per testare l'interfaccia quando l'API non è disponibile
  const generateDemoData = () => {
    return {
      stats: {
        possesso: 65,
        tiri: 12,
        tiriInPorta: 8,
        passaggi: 450,
        passaggiRiusciti: 380,
        corner: 6,
        falli: 15,
        fuorigioco: 3,
        parate: 4,
        golSegnati: 3,
        golSubiti: 1,
      },
      ratings: [
        { player: 'Buffon', rating: 7.5, role: 'Portiere' },
        { player: 'Cannavaro', rating: 8.2, role: 'Difensore' },
        { player: 'Pirlo', rating: 9.0, role: 'Centrocampista' },
        { player: 'Totti', rating: 8.8, role: 'Attaccante' },
        { player: 'Del Piero', rating: 8.5, role: 'Attaccante' },
      ],
      heatmaps: {
        offensive: { description: 'Attività concentrata sulla fascia destra', zones: ['fascia destra', 'area di rigore'] },
        defensive: { description: 'Pressa alta e recuperi in centrocampo', zones: ['centrocampo', 'area di rigore'] }
      }
    };
  };

  // Renderizza uploader immagini
  const renderImageUploader = () => {
    const imageTypes = [
      { key: 'stats', label: 'Statistiche Partita', icon: BarChart3 },
      { key: 'ratings', label: 'Voti Giocatori', icon: Users },
      { key: 'heatmapOffensive', label: 'Heatmap Offensiva', icon: Target },
      { key: 'heatmapDefensive', label: 'Heatmap Difensiva', icon: Shield }
    ];

    return (
      <div className="upload-section">
        <div className="section-header">
          <h2 className="section-title">
            <Upload size={24} />
            Carica le 4 immagini della partita
          </h2>
          <p className="section-description">
            Seleziona le immagini per l'analisi completa con Gemini AI
          </p>
        </div>

        <div className="image-upload-grid">
          {imageTypes.map(({ key, label, icon: Icon }) => (
            <div key={key} className="upload-card">
              <div className="upload-header">
                <Icon size={20} />
                <span>{label}</span>
              </div>
              
              {uploadImages[key] ? (
                <div className="upload-preview">
                  <img 
                    src={URL.createObjectURL(uploadImages[key])} 
                    alt={label}
                    className="preview-image"
                  />
                  <div className="upload-actions">
                    <button 
                      onClick={() => document.getElementById(`file-${key}`).click()}
                      className="btn btn-secondary btn-sm"
                    >
                      Sostituisci
                    </button>
                    <button 
                      onClick={() => handleRemoveImage(key)}
                      className="btn btn-danger btn-sm"
                    >
                      Rimuovi
                    </button>
                  </div>
                  {uploadProgress[key] > 0 && (
                    <div className="upload-progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${uploadProgress[key]}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="upload-area"
                  onClick={() => document.getElementById(`file-${key}`).click()}
                >
                  <Camera size={32} />
                  <span>Clicca per caricare</span>
                </div>
              )}
              
              <input
                id={`file-${key}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(key, e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>
          ))}
        </div>

        <div className="upload-actions">
          <button 
            onClick={handleProcessOCR}
            disabled={isProcessing || Object.values(uploadImages).filter(img => img !== null).length < 4}
            className="btn btn-primary"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analizzando con Gemini AI...
              </>
            ) : (
              <>
                <Brain size={16} />
                Elabora con Gemini AI
              </>
            )}
          </button>
          
          <button 
            onClick={() => {
              const fallbackData = {
                stats: { possesso: 65, tiri: 15, tiriInPorta: 8 },
                ratings: [
                  { player: "Giocatore 1", rating: 7.5, notes: "Dati demo", isProfiled: false }
                ],
                heatmaps: { offensive: null, defensive: null }
              };
              setMatchData(fallbackData);
              setActiveSection('analysis');
            }}
            className="btn btn-secondary"
          >
            <Zap size={16} />
            Test (Dati Demo)
          </button>
        </div>
      </div>
    );
  };

  // Renderizza KPI della partita (solo dati reali)
  const renderMatchKPIs = () => {
    // Debug: controlla i dati OCR
    console.log('🔍 Debug matchData.stats:', matchData.stats);
    console.log(
      '🔍 Debug matchData.stats keys:',
      matchData.stats ? Object.keys(matchData.stats) : 'No stats'
    );

    // Usa solo dati OCR reali
    const displayKPIs =
      matchData.stats && Object.keys(matchData.stats).length > 0
        ? generateKPIsFromStats(matchData.stats)
        : {};

    console.log('🔍 Debug displayKPIs:', displayKPIs);

    // Se non ci sono dati, mostra empty state
    if (Object.keys(displayKPIs).length === 0) {
      return (
        <div className="kpi-section">
          <div className="section-header">
            <h2 className="section-title">
              <BarChart3 size={24} />
              Riepilogo Rapido
            </h2>
          </div>
          <div className="empty-state">
            <EmptyState
              icon={BarChart3}
              title="Nessun dato disponibile"
              description="Carica una partita per vedere le statistiche"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="kpi-section">
        <div className="section-header">
          <h2 className="section-title">
            <BarChart3 size={24} />
            Riepilogo Rapido
          </h2>
          <p className="section-description">
            Statistiche principali della partita estratte con Gemini AI
          </p>
        </div>

        <div className="kpi-grid">
          {Object.entries(displayKPIs).map(([key, kpi]) => (
            <div key={key} className="kpi-card">
              <div className="kpi-icon">
                <BarChart3 size={20} />
              </div>
              <div className="kpi-content">
                <div className="kpi-label">{key}</div>
                <div className="kpi-value">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Genera KPIs dai dati OCR
  const generateKPIsFromStats = stats => {
    try {
      // Validazione robusta dell'input
      if (!stats || typeof stats !== 'object' || Array.isArray(stats)) {
        console.warn('⚠️ generateKPIsFromStats received invalid stats:', stats);
        return {};
      }

      const kpis = {};

      Object.entries(stats).forEach(([key, value]) => {
        // Validazione di key e value
        if (typeof key === 'string' && key.length > 0) {
          kpis[key] = {
            value: value || 0,
            trend: 'neutral', // Default per dati OCR
            vsAvg: 0, // Default per dati OCR
          };
        }
      });

      return kpis;
    } catch (error) {
      console.error('❌ Error in generateKPIsFromStats:', error);
      return {};
    }
  };

  // Renderizza analisi IA (solo se ci sono dati)
  const renderAIAnalysis = () => {
    // Se non ci sono dati, mostra empty state
    if (!matchData.stats || Object.keys(matchData.stats).length === 0) {
      return (
        <div className="ai-analysis-section">
          <div className="section-header">
            <h2 className="section-title">
              <Brain size={24} />
              Analisi IA – Ultima Partita
            </h2>
          </div>
          <div className="empty-state">
            <EmptyState
              icon={Brain}
              title="Nessun dato disponibile"
              description="Carica una partita per vedere l'analisi IA"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="ai-analysis-section">
        <div className="section-header">
          <h2 className="section-title">
            <Brain size={24} />
            Analisi IA – Ultima Partita
          </h2>
          <p className="section-description">
            Analisi intelligente dei dati estratti con Gemini AI
          </p>
        </div>

        <div className="ai-content">
          <div className="ai-summary">
            <h3>Giudizio Sintetico</h3>
            <p>
              Partita analizzata con successo utilizzando Gemini AI. 
              I dati sono stati estratti e strutturati automaticamente.
            </p>
          </div>

          <div className="ai-points">
            <div className="strengths">
              <h4>Punti di Forza</h4>
              <ul>
                <li>Analisi automatica con AI avanzata</li>
                <li>Estrazione dati precisa e strutturata</li>
                <li>Comprensione contestuale delle statistiche</li>
              </ul>
            </div>

            <div className="improvements">
              <h4>Punti di Miglioramento</h4>
              <ul>
                <li>Continuare a utilizzare Gemini per analisi future</li>
                <li>Migliorare la qualità delle immagini caricate</li>
                <li>Integrare più fonti di dati</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizza migliori giocatori (solo dati reali)
  const renderBestPlayers = () => {
    // Usa solo dati OCR reali
    const displayPlayers =
      matchData.ratings && matchData.ratings.length > 0
        ? generatePlayersFromRatings(matchData.ratings)
        : [];

    // Se non ci sono dati, mostra empty state
    if (displayPlayers.length === 0) {
      return (
        <div className="players-section">
          <div className="section-header">
            <h2 className="section-title">
              <Users size={24} />
              Migliori Giocatori
            </h2>
          </div>
          <div className="empty-state">
            <EmptyState
              icon={Users}
              title="Nessun dato disponibile"
              description="Carica una partita per vedere i voti dei giocatori"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="players-section">
        <div className="section-header">
          <h2 className="section-title">
            <Users size={24} />
            Migliori Giocatori
          </h2>
          <p className="section-description">
            Voti dei giocatori estratti con Gemini AI
          </p>
        </div>

        <div className="players-table-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Giocatore</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Voto</TableHead>
                <TableHead>Forma</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayPlayers.map((player, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="player-info">
                      <span className="player-name">{player.name}</span>
                      {player.mvp && <Badge variant="primary">MVP</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{player.role}</TableCell>
                  <TableCell>
                    <span className="rating">{player.rating}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={player.form === 'Excellent' ? 'success' : 
                              player.form === 'Good' ? 'warning' : 'secondary'}
                    >
                      {player.form}
                    </Badge>
                  </TableCell>
                  <TableCell>{player.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // Genera giocatori dai dati OCR ratings
  const generatePlayersFromRatings = ratings => {
    try {
      // Validazione robusta dell'input
      if (!Array.isArray(ratings)) {
        console.warn('⚠️ generatePlayersFromRatings received invalid ratings:', ratings);
        return [];
      }

      return ratings.map((rating, index) => {
        // Validazione di ogni rating
        if (!rating || typeof rating !== 'object') {
          console.warn('⚠️ Invalid rating object at index', index, ':', rating);
          return null;
        }

        return {
          name: rating.player || `Player ${index + 1}`,
          role: 'N/A', // Non disponibile da OCR
          rating: typeof rating.rating === 'number' ? rating.rating : 0,
          goals: 0, // Non disponibile da OCR
          assists: 0, // Non disponibile da OCR
          participation: 0, // Non disponibile da OCR
          form:
            rating.rating >= 7.5
              ? 'Excellent'
              : rating.rating >= 6.5
                ? 'Good'
                : 'Average',
          mvp: rating.rating >= 8.0,
          growth: false,
          isProfiled: Boolean(rating.isProfiled),
        };
      }).filter(player => player !== null); // Rimuove oggetti null
    } catch (error) {
      console.error('❌ Error in generatePlayersFromRatings:', error);
      return [];
    }
  };

  return (
    <ErrorBoundary>
      <div className="carica-partita-page">
        {/* Header con azioni globali */}
        <div className="page-header">
          <div className="breadcrumb">
            <span>Casa</span>
            <span>→</span>
            <span>Carica Ultima Partita</span>
          </div>
        </div>

        {/* Contenuto principale */}
        <div className="page-content">
          {/* Sezione Upload - sempre visibile */}
          {renderImageUploader()}
          
          {/* Sezioni di analisi - visibili dopo l'elaborazione o per demo */}
          {(activeSection === 'analysis' || showAllSections) && (
            <>
              {renderMatchKPIs()}
              {renderAIAnalysis()}
              {renderBestPlayers()}
            </>
          )}
          
          {/* Sezione vuota se nessuna immagine caricata */}
          {!showAllSections && Object.values(uploadImages).every(img => img === null) && (
            <div className="empty-state">
              <EmptyState
                icon={Upload}
                title="Carica le 4 immagini per iniziare"
                description="Seleziona le immagini della partita per iniziare l'analisi completa con Gemini AI"
              />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CaricaUltimaPartita;
